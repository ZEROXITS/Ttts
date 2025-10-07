export interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

export interface FlashcardSet {
  id: number;
  title: string;
  cards: Flashcard[];
}
