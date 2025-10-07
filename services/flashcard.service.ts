import { Injectable, signal, effect, inject } from '@angular/core';
import { FlashcardSet } from '../models/flashcard.model';

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {
  private sets = signal<FlashcardSet[]>([]);
  private storageKey = 'study-hub-flashcards';

  allSets = this.sets.asReadonly();

  constructor() {
    this.loadFromLocalStorage();
  }

  addSet(set: Omit<FlashcardSet, 'id'>) {
    this.sets.update(currentSets => {
      const newSet: FlashcardSet = { ...set, id: Date.now() };
      const updatedSets = [...currentSets, newSet];
      this.saveToLocalStorage(updatedSets);
      return updatedSets;
    });
  }
  
  updateSet(updatedSet: FlashcardSet) {
    this.sets.update(currentSets => {
        const index = currentSets.findIndex(s => s.id === updatedSet.id);
        if(index !== -1) {
            currentSets[index] = updatedSet;
        }
        this.saveToLocalStorage([...currentSets]);
        return [...currentSets];
    });
  }

  deleteSet(setId: number) {
    this.sets.update(currentSets => {
      const updatedSets = currentSets.filter(s => s.id !== setId);
      this.saveToLocalStorage(updatedSets);
      return updatedSets;
    });
  }

  private loadFromLocalStorage() {
    if (typeof localStorage !== 'undefined' && this.storageKey) {
      const savedData = localStorage.getItem(this.storageKey);
      this.sets.set(savedData ? JSON.parse(savedData) : []);
    }
  }

  private saveToLocalStorage(sets: FlashcardSet[]) {
    if (typeof localStorage !== 'undefined' && this.storageKey) {
      localStorage.setItem(this.storageKey, JSON.stringify(sets));
    }
  }
}