import { Injectable, signal } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse, Content } from '@google/genai';

// In a real app, manage the API key securely. Here we assume it's in the environment.
const API_KEY = process.env.API_KEY;

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private genAI: GoogleGenAI | null = null;
  
  constructor() {
     if (API_KEY) {
      this.genAI = new GoogleGenAI({ apiKey: API_KEY });
    } else {
      console.error('API_KEY environment variable not set.');
    }
  }

  async solveTextProblem(problem: string): Promise<string> {
    if (!this.genAI) {
      return Promise.resolve('خطأ: مفتاح API الخاص بـ Gemini غير مهيأ.');
    }

    try {
      const response: GenerateContentResponse = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Please solve the following academic problem. Provide a detailed, step-by-step explanation. Problem: "${problem}"`,
        config: {
          systemInstruction: "You are a world-class academic assistant for an Arabic-speaking student. Your expertise covers math, physics, chemistry, and other sciences. Explain your answers clearly and concisely in Arabic. Use markdown-style formatting like **bolding** for key terms, `code blocks` for equations or formulas, and bullet points for steps to make the solution easy to understand.",
        }
      });
      return response.text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return `حدث خطأ أثناء معالجة طلبك: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
  
  async continueConversation(history: Content[], newPrompt: string): Promise<string> {
    if (!this.genAI) {
      return Promise.resolve('خطأ: مفتاح API الخاص بـ Gemini غير مهيأ.');
    }
    
    try {
      const chat = this.genAI.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: "You are a world-class academic assistant for an Arabic-speaking student. Your expertise covers math, physics, chemistry, and other sciences. Explain your answers clearly and concisely in Arabic. Use markdown-style formatting like **bolding** for key terms, `code blocks` for equations or formulas, and bullet points for steps to make the solution easy to understand.",
          },
          history: history,
      });

      const response = await chat.sendMessage({ message: newPrompt });
      return response.text;

    } catch (error) {
      console.error('Error continuing conversation with Gemini API:', error);
      return `حدث خطأ أثناء معالجة طلبك: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  async solveImageProblem(problem: string, imageBase64: string, mimeType: string): Promise<string> {
    if (!this.genAI) {
      return Promise.resolve('خطأ: مفتاح API الخاص بـ Gemini غير مهيأ.');
    }
    
    try {
      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      };

      const textPart = {
        text: `Please solve the problem shown in the image. Provide a step-by-step explanation. Additional context from user: "${problem}"`
      };

      const response: GenerateContentResponse = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [textPart, imagePart] },
        config: {
          systemInstruction: "You are a world-class academic assistant for an Arabic-speaking student. Analyze the image and solve the academic problem it contains. Explain your steps clearly in Arabic. Use markdown-style formatting like **bolding** for key terms, `code blocks` for equations or formulas, and bullet points for steps to make the solution easy to understand.",
        }
      });

      return response.text;
    } catch (error) {
      console.error('Error calling Gemini API with image:', error);
      return `حدث خطأ أثناء معالجة الصورة: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  async summarizeText(text: string): Promise<string> {
    if (!this.genAI) {
      return Promise.resolve('خطأ: مفتاح API الخاص بـ Gemini غير مهيأ.');
    }
    
    try {
       const response: GenerateContentResponse = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Please summarize the following text into key points. Text: "${text}"`,
        config: {
          systemInstruction: "You are an expert summarizer for an Arabic-speaking student. Your goal is to extract the most critical information and present it as clear, concise bullet points in Arabic.",
        }
      });
      return response.text;
    } catch (error) {
      console.error('Error calling Gemini API for summarization:', error);
      return `حدث خطأ أثناء تلخيص النص: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
}