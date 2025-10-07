
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../services/quiz.service';
import { Question, Option } from '../../models/quiz.model';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizMakerComponent {
  quizTitle = signal('');
  questions = signal<Question[]>([]);
  notification = signal<{message: string, type: 'success' | 'error'} | null>(null);

  constructor(private quizService: QuizService) {
    this.addQuestion(); // Start with one question
  }

  addQuestion() {
    this.questions.update(qs => [
      ...qs,
      {
        id: Date.now(),
        text: '',
        options: [
          { text: '', isCorrect: true },
          { text: '', isCorrect: false },
        ]
      }
    ]);
  }

  removeQuestion(questionId: number) {
    this.questions.update(qs => qs.filter(q => q.id !== questionId));
  }
  
  addOption(questionId: number) {
      this.questions.update(qs => qs.map(q => {
          if (q.id === questionId && q.options.length < 5) {
              q.options.push({ text: '', isCorrect: false });
          }
          return q;
      }));
  }

  removeOption(questionId: number, optionIndex: number) {
    this.questions.update(qs => qs.map(q => {
        if(q.id === questionId && q.options.length > 2) {
            q.options.splice(optionIndex, 1);
        }
        return q;
    }));
  }

  updateQuestionText(event: Event, questionId: number) {
    const text = (event.target as HTMLInputElement).value;
    this.questions.update(qs => qs.map(q => q.id === questionId ? { ...q, text } : q));
  }

  updateOptionText(event: Event, questionId: number, optionIndex: number) {
    const text = (event.target as HTMLInputElement).value;
    this.questions.update(qs => qs.map(q => {
      if (q.id === questionId) {
        q.options[optionIndex].text = text;
      }
      return q;
    }));
  }
  
  setCorrectOption(questionId: number, correctOptionIndex: number) {
      this.questions.update(qs => qs.map(q => {
          if (q.id === questionId) {
              q.options.forEach((opt, index) => {
                  opt.isCorrect = (index === correctOptionIndex);
              });
          }
          return q;
      }));
  }

  saveQuiz() {
    if (!this.quizTitle().trim()) {
        this.showNotification('الرجاء إدخال عنوان للاختبار.', 'error');
        return;
    }
    if (this.questions().some(q => !q.text.trim() || q.options.some(o => !o.text.trim()))) {
        this.showNotification('الرجاء ملء جميع حقول الأسئلة والإجابات.', 'error');
        return;
    }

    this.quizService.addQuiz({
      title: this.quizTitle(),
      questions: this.questions(),
    });

    this.showNotification('تم حفظ الاختبار بنجاح!', 'success');
    this.resetForm();
  }

  private resetForm() {
      this.quizTitle.set('');
      this.questions.set([]);
      this.addQuestion();
  }

  private showNotification(message: string, type: 'success' | 'error') {
      this.notification.set({ message, type });
      setTimeout(() => this.notification.set(null), 3000);
  }
}
