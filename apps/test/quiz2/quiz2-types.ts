// Type definitions for Quiz 2 alternative design

export interface Quiz2Question {
  id: string;
  text: string;
  answers: Quiz2Answer[];
}

export interface Quiz2Answer {
  id: string;
  text: string;
  correct: boolean;
}

export interface Quiz2 {
  id: string;
  title: string;
  description: string;
  settings: Quiz2Settings;
  questions: Quiz2Question[];
}

export interface Quiz2Settings {
  anonymous: boolean;
  allowPause: boolean;
  oneAttemptPerUser: boolean;
  showCorrectAnswers: boolean;
  hasTimer: boolean;
  timerMinutes: number | null;
  visibility: 'owner' | 'partners' | 'public';
}

export interface Quiz2Result {
  id: string;
  quizId: string;
  score: number;
  total: number;
  userAnswers: Record<string, string[]>;
  completedAt: string;
}

export interface Quiz2Attempt {
  id: string;
  userName: string;
  avatarUrl: string;
  score: number;
  completedAt: string;
}
