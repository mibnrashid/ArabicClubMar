export interface Question {
  id: string;
  text: string;
  options: Record<string, string>;
  correctAnswer: string;
}

export interface GameState {
  currentQuestionId: string;
  isActive: boolean;
  hasStarted?: boolean;
  updatedAt?: string;
}

export interface UserDoc {
  username: string;
  realName: string;
  createdAt: string;
}

export interface AnswerDoc {
  username: string;
  answer: string;
  questionId: string;
  submittedAt: string;
}

export interface ResultDoc {
  questionId: string;
  questionText: string;
  correctAnswer: string;
  options: Record<string, string>;
  finishedAt: string;
  totalAnswers: number;
}

export interface ArchivedAnswerDoc {
  username: string;
  answer: string;
  submittedAt: string;
}

export type UIState =
  | "not_registered"
  | "waiting"
  | "active_not_answered"
  | "answered";
