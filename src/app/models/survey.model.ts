/** A selectable answer option of a question. */
export interface Answer {
  id: string;
  text: string;
}

/** A question with its answer options. */
export interface Question {
  id: string;
  text: string;
  allowMultiple: boolean;
  answers: Answer[];
}

/** A survey as stored in Firestore. Dates are epoch milliseconds. */
export interface Survey {
  id: string;
  title: string;
  category: string;
  description: string;
  endDate: number | null;
  createdAt: number;
  questions: Question[];
  votes: Record<string, number>;
}

/** Data needed to create a new survey. */
export type NewSurvey = Omit<Survey, 'id' | 'createdAt' | 'votes'>;

/** Selected answer ids per question id. */
export type Selection = Record<string, string[]>;
