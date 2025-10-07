import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Quiz } from '../models/quiz.model';

export interface QuizResult {
  quizId: number;
  quizTitle: string;
  score: number;
  date: number;
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private quizzes = signal<Quiz[]>([]);
  private quizHistory = signal<QuizResult[]>([]);

  // Public API
  allQuizzes = this.quizzes.asReadonly();
  history = this.quizHistory.asReadonly();
  
  constructor() {
    this.loadFromLocalStorage();
  }

  addQuiz(quiz: Omit<Quiz, 'id'>) {
    this.quizzes.update(currentQuizzes => {
      const newQuiz: Quiz = {
        ...quiz,
        id: Date.now()
      };
      const updatedQuizzes = [...currentQuizzes, newQuiz];
      this.saveToLocalStorage(updatedQuizzes);
      return updatedQuizzes;
    });
  }

  getQuizById(id: number): Quiz | undefined {
    return this.quizzes().find(q => q.id === id);
  }

  addResultToHistory(result: Omit<QuizResult, 'date'>) {
    this.quizHistory.update(current => {
        const newResult: QuizResult = {...result, date: Date.now() };
        const updatedHistory = [newResult, ...current];
        this.saveToLocalStorage(this.quizzes(), updatedHistory);
        return updatedHistory;
    });
  }

  private loadFromLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      const savedQuizzes = localStorage.getItem('study-hub-quizzes');
      if (savedQuizzes) {
        this.quizzes.set(JSON.parse(savedQuizzes));
      } else {
        this.quizzes.set([]);
      }
      const savedHistory = localStorage.getItem('study-hub-history');
      if (savedHistory) {
        this.quizHistory.set(JSON.parse(savedHistory));
      } else {
        this.quizHistory.set([]);
      }
    }
  }

  private saveToLocalStorage(quizzes: Quiz[], history?: QuizResult[]) {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('study-hub-quizzes', JSON.stringify(quizzes));
        if (history) {
            localStorage.setItem('study-hub-history', JSON.stringify(history));
        } else {
            // Also save history when quizzes are updated, to not lose it
            localStorage.setItem('study-hub-history', JSON.stringify(this.quizHistory()));
        }
    }
  }
}