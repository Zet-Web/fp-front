// Type definitions for Quiz test components

export interface QuizQuestion {
  id: string;
  text: string;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  id: string;
  text: string;
  correct: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  settings: QuizSettings;
  questions: QuizQuestion[];
}

export interface QuizSettings {
  anonymous: boolean;
  allowPause: boolean;
  oneAttemptPerUser: boolean;
  showCorrectAnswers: boolean;
  hasTimer: boolean;
  timerMinutes: number | null;
  visibility: 'owner' | 'partners' | 'public';
}

export interface QuizResult {
  id: string;
  quizId: string;
  score: number;
  total: number;
  userAnswers: Record<string, string[]>;
  completedAt: string;
}

export interface QuizAttempt {
  id: string;
  userName: string;
  avatarUrl: string;
  score: number;
  completedAt: string;
}
