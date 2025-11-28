import { z } from "zod";

export const quizSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    settings: z.object({
      anonymous: z.boolean(),
      allowPause: z.boolean(),
      oneAttemptPerUser: z.boolean(),
      showCorrectAnswers: z.boolean(),
      hasTimer: z.boolean(),
      timerMinutes: z.number().int().positive().nullable(),
      visibility: z.enum(["owner", "partners", "public"]),
    }),
    questions: z
      .array(
        z.object({
          text: z.string().min(1, "Введите вопрос"),
          explanation: z.string().optional(),
          answers: z
            .array(
              z.object({
                text: z.string().min(1, "Введите ответ"),
                correct: z.boolean(),
              })
            )
            .min(2, "Минимум два варианта ответа"),
        })
      )
      .min(1, "Добавьте хотя бы один вопрос"),
  })
  .superRefine((data, ctx) => {
  if (data.settings.hasTimer) {
    if (!data.settings.timerMinutes || data.settings.timerMinutes <= 0) {
      ctx.addIssue({
        code: "custom",
        message: "Укажите количество минут",
        path: ["settings", "timerMinutes"],
      });
    }
  }
})

export type QuizFormData = z.infer<typeof quizSchema>;

export interface QuizResponse {
  id: number;
  author_id: string;
  post_id: number;
  title: string;
  description: string;
  anonymous: boolean;
  allow_pause: boolean;
  one_attempt_per_user: boolean;
  show_correct_answers: boolean;
  has_timer: boolean;
  timer_minutes: number | null;
  visibility: "owner" | "partners" | "public";
  created_at: string;
  questions: QuizQuestion[];
  alreadyAttempted: boolean;
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  text: string;
  explanation?: string;
  created_at: string;
  position: number;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  id: number;
  question_id: number;
  text: string;
  correct: boolean;
  created_at: string;
  position: number;
}

export interface QuizSubmitResult {
  resultId: number;
  quizId: number;
  score: number;
  total: number;
}

export type QuizCorrectAnswersResult = QuizCorrectAnswer[];

export interface QuizCorrectAnswer {
  id: number;
  title: string;
  answers: QuizAnswer[];
}

export type QuizResultsTablesResult = QuizResultsTableRow[]

export type QuizResultsTableRow = {
  id: number;
  score: number;
  created_at: string;
  profile?: { name?: string | null; avatar_url?: string | null, is_verified: boolean } | null;
  rank: number;
};

export interface QuizResultsTableProfile {
  name: string
  avatar_url: string
}
