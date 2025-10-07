
export interface Option {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
}

export interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}
