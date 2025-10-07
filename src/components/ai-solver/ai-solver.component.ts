import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { GeminiService } from '../../services/gemini.service';
import { CommonModule } from '@angular/common';
import { Content } from '@google/genai';

type SolverMode = 'text' | 'image' | 'summarize';

interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}


@Component({
  selector: 'app-ai-solver',
  templateUrl: './ai-solver.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class AiSolverComponent {
  mode = signal<SolverMode>('text');
  isLoading = signal(false);
  error = signal('');
  
  // For conversation history
  conversationHistory = signal<ChatMessage[]>([]);

  // For image mode
  imagePreview = signal<string | null>(null);
  private imageFile: { base64: string; type: string; } | null = null;
  
  constructor(private geminiService: GeminiService) {}

  setMode(newMode: SolverMode) {
    this.mode.set(newMode);
    this.resetState();
  }

  async handleTextInput(prompt: string, textarea: HTMLTextAreaElement) {
    if (!prompt.trim() || this.isLoading()) return;
    
    this.isLoading.set(true);
    this.error.set('');

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: prompt }] };
    this.conversationHistory.update(h => [...h, userMessage]);
    textarea.value = ''; // Clear input

    try {
      let result: string;
      const historyForApi = this.conversationHistory().slice(0,-1) as Content[];

      if (this.conversationHistory().length > 1) {
          result = await this.geminiService.continueConversation(historyForApi, prompt);
      } else {
          result = await this.geminiService.solveTextProblem(prompt);
      }

      const modelMessage: ChatMessage = { role: 'model', parts: [{ text: result }] };
      this.conversationHistory.update(h => [...h, modelMessage]);

    } catch (e) {
      this.error.set('حدث خطأ غير متوقع.');
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.imagePreview.set(result);
        this.imageFile = { base64: result.split(',')[1], type: file.type };
      };
      reader.readAsDataURL(file);
    }
  }

  async solveImageProblem(textContext: string) {
    if (!this.imageFile) {
      this.error.set('الرجاء اختيار صورة أولاً.');
      return;
    }
    this.isLoading.set(true);
    this.error.set('');
    
    const userMessage = `طلب صورة: ${textContext || '(بدون نص إضافي)'}`;
    this.conversationHistory.set([{ role: 'user', parts: [{ text: userMessage }] }]);

    try {
      const result = await this.geminiService.solveImageProblem(textContext, this.imageFile.base64, this.imageFile.type);
      this.conversationHistory.update(h => [...h, { role: 'model', parts: [{ text: result }] }]);
    } catch (e) {
      this.error.set('حدث خطأ غير متوقع أثناء تحليل الصورة.');
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  async summarizeText(textToSummarize: string, textarea: HTMLTextAreaElement) {
    if (!textToSummarize.trim()) {
      this.error.set('الرجاء إدخال نص لتلخيصه.');
      return;
    }
    this.isLoading.set(true);
    this.error.set('');
    this.conversationHistory.set([{ role: 'user', parts: [{ text: `الرجاء تلخيص النص التالي:\n${textToSummarize}` }] }]);
    textarea.value = '';

    try {
      const result = await this.geminiService.summarizeText(textToSummarize);
      this.conversationHistory.update(h => [...h, { role: 'model', parts: [{ text: result }] }]);
    } catch (e) {
      this.error.set('حدث خطأ غير متوقع أثناء التلخيص.');
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
  
  parseMarkdown(text: string): string {
    // Basic bold **text** -> <strong>text</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Basic code `code` -> <code>code</code>
    text = text.replace(/`(.*?)`/g, '<code class="bg-gray-700 text-yellow-300 rounded px-1 py-0.5">$1</code>');
    // Basic bullet points * item -> <ul><li>item</li></ul>
    text = text.replace(/^\s*\*[ \t]+(.*)/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    return text;
  }

  resetState() {
    this.isLoading.set(false);
    this.error.set('');
    this.imagePreview.set(null);
    this.imageFile = null;
    this.conversationHistory.set([]);
  }
}