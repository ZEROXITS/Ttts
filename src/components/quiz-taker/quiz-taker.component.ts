import { ChangeDetectionStrategy, Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { Quiz } from '../../models/quiz.model';

type QuizState = 'selection' | 'taking' | 'results' | 'history' | 'review';

@Component({
  selector: 'app-quiz-taker',
  templateUrl: './quiz-taker.component.html',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizTakerComponent {
  private quizService = inject(QuizService);
  
  quizzes = this.quizService.allQuizzes;
  quizHistory = this.quizService.history;
  
  quizState = signal<QuizState>('selection');
  selectedQuiz = signal<Quiz | null>(null);
  currentQuestionIndex = signal(0);
  userAnswers = signal<Record<number, number>>({}); // { questionId: selectedOptionIndex }
  score = signal(0);
  
  currentQuestion = computed(() => {
    const quiz = this.selectedQuiz();
    if (quiz) {
      return quiz.questions[this.currentQuestionIndex()];
    }
    return null;
  });

  startQuiz(quiz: Quiz) {
    this.selectedQuiz.set(quiz);
    this.currentQuestionIndex.set(0);
    this.userAnswers.set({});
    this.score.set(0);
    this.quizState.set('taking');
  }

  selectAnswer(questionId: number, optionIndex: number) {
    this.userAnswers.update(answers => ({...answers, [questionId]: optionIndex}));
  }

  nextQuestion() {
    const quiz = this.selectedQuiz();
    if (quiz && this.currentQuestionIndex() < quiz.questions.length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update(i => i - 1);
    }
  }

  finishQuiz() {
    const quiz = this.selectedQuiz();
    if (!quiz) return;

    let correctAnswers = 0;
    quiz.questions.forEach(q => {
      const userAnswerIndex = this.userAnswers()[q.id];
      if (userAnswerIndex !== undefined && q.options[userAnswerIndex]?.isCorrect) {
        correctAnswers++;
      }
    });

    const finalScore = (correctAnswers / quiz.questions.length) * 100;
    this.score.set(finalScore);
    this.quizService.addResultToHistory({
      quizId: quiz.id,
      quizTitle: quiz.title,
      score: finalScore
    });
    this.quizState.set('results');
  }
  
  reviewAnswers() {
    this.quizState.set('review');
  }

  backToResults() {
    this.quizState.set('results');
  }

  restart() {
    this.quizState.set('selection');
    this.selectedQuiz.set(null);
  }

  viewHistory() {
    this.quizState.set('history');
  }

  backToSelection() {
    this.quizState.set('selection');
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString('ar-EG');
  }
}
