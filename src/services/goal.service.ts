import { Injectable, signal, effect, inject } from '@angular/core';
import { Goal } from '../models/goal.model';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private goals = signal<Goal[]>([]);
  private storageKey = 'study-hub-goals';

  allGoals = this.goals.asReadonly();

  constructor() {
    this.loadFromLocalStorage();
  }

  addGoal(text: string) {
    this.goals.update(current => {
      const newGoal: Goal = { id: Date.now(), text, isCompleted: false };
      const updated = [...current, newGoal];
      this.saveToLocalStorage(updated);
      return updated;
    });
  }

  toggleGoal(id: number) {
    this.goals.update(current => {
      const updated = current.map(g => g.id === id ? { ...g, isCompleted: !g.isCompleted } : g);
      this.saveToLocalStorage(updated);
      return updated;
    });
  }

  deleteGoal(id: number) {
    this.goals.update(current => {
      const updated = current.filter(g => g.id !== id);
      this.saveToLocalStorage(updated);
      return updated;
    });
  }

  private loadFromLocalStorage() {
    if (typeof localStorage !== 'undefined' && this.storageKey) {
      const savedData = localStorage.getItem(this.storageKey);
      this.goals.set(savedData ? JSON.parse(savedData) : []);
    }
  }

  private saveToLocalStorage(goals: Goal[]) {
    if (typeof localStorage !== 'undefined' && this.storageKey) {
      localStorage.setItem(this.storageKey, JSON.stringify(goals));
    }
  }
}