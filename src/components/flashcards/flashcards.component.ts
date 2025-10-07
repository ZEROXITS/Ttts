import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashcardService } from '../../services/flashcard.service';
import { Flashcard, FlashcardSet } from '../../models/flashcard.model';

type ViewMode = 'list' | 'create' | 'study';

@Component({
  selector: 'app-flashcards',
  templateUrl: './flashcards.component.html',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlashcardsComponent {
  flashcardService = inject(FlashcardService);
  
  viewMode = signal<ViewMode>('list');
  sets = this.flashcardService.allSets;

  // For creating/editing a set
  newSetTitle = signal('');
  newCards = signal<Omit<Flashcard, 'id'>[]>([]);
  
  // For studying a set
  studyingSet = signal<FlashcardSet | null>(null);
  currentCardIndex = signal(0);
  isFlipped = signal(false);
  isShuffled = signal(false);

  // --- Main View Logic ---
  showCreateView() {
    this.newSetTitle.set('');
    this.newCards.set([{ question: '', answer: '' }]);
    this.viewMode.set('create');
  }
  
  backToList() {
      this.viewMode.set('list');
      this.studyingSet.set(null);
  }

  // --- Creation Logic ---
  addCardField() {
    this.newCards.update(cards => [...cards, { question: '', answer: '' }]);
  }

  removeCardField(index: number) {
    this.newCards.update(cards => cards.filter((_, i) => i !== index));
  }

  updateCardField(index: number, field: 'question' | 'answer', event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.newCards.update(cards => {
      cards[index][field] = value;
      return [...cards];
    });
  }

  saveSet() {
    if (!this.newSetTitle().trim()) return;
    const cards: Flashcard[] = this.newCards()
        .filter(c => c.question.trim() && c.answer.trim())
        .map((c, i) => ({ ...c, id: i }));
    
    if (cards.length === 0) return;

    this.flashcardService.addSet({ title: this.newSetTitle(), cards });
    this.viewMode.set('list');
  }

  // --- Study Logic ---
  startStudy(set: FlashcardSet) {
    let cardsToStudy = [...set.cards];
    if (this.isShuffled()) {
      // Fisher-Yates shuffle algorithm
      for (let i = cardsToStudy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardsToStudy[i], cardsToStudy[j]] = [cardsToStudy[j], cardsToStudy[i]];
      }
    }
    this.studyingSet.set({ ...set, cards: cardsToStudy });
    this.currentCardIndex.set(0);
    this.isFlipped.set(false);
    this.viewMode.set('study');
  }
  
  flipCard() {
    this.isFlipped.update(v => !v);
  }

  nextCard() {
    const set = this.studyingSet();
    if (!set) return;
    this.isFlipped.set(false);
    // Use a short timeout to allow the card to flip back before changing content
    setTimeout(() => {
        this.currentCardIndex.update(i => (i + 1) % set.cards.length);
    }, 150);
  }
  
  prevCard() {
     const set = this.studyingSet();
    if (!set) return;
    this.isFlipped.set(false);
     setTimeout(() => {
        this.currentCardIndex.update(i => (i - 1 + set.cards.length) % set.cards.length);
     }, 150);
  }
}