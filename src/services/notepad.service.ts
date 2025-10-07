import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotepadService {
  notes = signal('');
  saveStatus = signal('');
  private storageKey = 'study-hub-notepad';
  private debounceTimer: any;

  constructor() {
    this.loadFromLocalStorage();
  }

  updateNotes(newNotes: string) {
    this.notes.set(newNotes);
    
    // Debounce saving to avoid excessive writes to localStorage
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
        this.saveToLocalStorage(newNotes);
    }, 500);
  }

  loadNotes(data: string) {
    this.notes.set(data);
    this.saveToLocalStorage(data);
  }
  
  private loadFromLocalStorage() {
    if (typeof localStorage !== 'undefined') {
        const savedNotes = localStorage.getItem(this.storageKey);
        this.notes.set(savedNotes || '');
    }
  }

  private saveToLocalStorage(notesToSave: string) {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, notesToSave);
        this.showSaveStatus();
    }
  }

  private showSaveStatus() {
      this.saveStatus.set('تم الحفظ!');
      setTimeout(() => this.saveStatus.set(''), 2000);
  }
}
