// Quiz taking interface with modernized card-based design and theme support

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthContext } from "@/components/auth-provider";
import { FPApi } from "@/lib/api";
import { Clock, Award, XCircle, ChevronRight, ChevronLeft, Trophy, CheckCircle2 } from "lucide-react";
import {
  QuizResponse,
  QuizResultsTableRow,
  QuizSubmitResult,
} from "../types/quiz";
import { ShowCorrectAnswers } from "./ShowCorrectAnswers";
import { AlreadyAttemptedView } from "./AlreadyAttempedView";

type Props = {
  postId: number;
};

export default function QuizTake({ postId }: Props) {
  const { profile } = useAuthContext();
  const profileId = profile?.id || null;

  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [startedAt, setStartedAt] = useState<string>("");
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<QuizSubmitResult | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [resultsTable, setResultsTable] = useState<QuizResultsTableRow[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const res = await FPApi.axios.get<QuizResponse>(
        `/quiz/by-post/${postId}`
      );
      const data = res.data;
      setQuiz(data);
      setStartedAt(new Date().toISOString());

      const init: Record<string, number[]> = {};
      data.questions?.forEach((q) => (init[q.id] = []));
      setAnswers(init);

      if (data.has_timer && data.timer_minutes) {
        setTimeLeft(data.timer_minutes * 60);
      }

      setLoading(false);
    }
    load();
  }, [postId]);

  useEffect(() => {
    if (timeLeft === null || finished) return;
    const t = setInterval(() => {
      setTimeLeft((x) => {
        if (x === null) return null;
        if (x <= 1) {
          handleSubmit();
          return 0;
        }
        return x - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, finished]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Загрузка квиза...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full shadow-md">
          <CardContent className="pt-6 text-center space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold">Квиз не найден</h2>
            <p className="text-muted-foreground">Запрашиваемый квиз не существует</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quiz.allow_pause) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full shadow-md">
          <CardContent className="pt-6 text-center space-y-4">
            <Clock className="w-16 h-16 text-orange-500 mx-auto" />
            <h2 className="text-xl font-semibold">Квиз на паузе</h2>
            <p className="text-muted-foreground">Квиз временно недоступен</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quiz.anonymous && !profileId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full shadow-md">
          <CardContent className="pt-6 text-center space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold">Требуется авторизация</h2>
            <p className="text-muted-foreground">
              Только авторизованные пользователи могут пройти этот квиз
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (
    (quiz.one_attempt_per_user || !quiz.anonymous) &&
    profileId &&
    quiz.alreadyAttempted
  ) {
    return (
      <AlreadyAttemptedView quizId={quiz.id} visibility={quiz.visibility} />
    );
  }

  const toggleAnswer = (questionId: number, answerId: number) => {
    setAnswers((prev) => {
      const list = prev[questionId] ?? [];
      const exists = list.includes(answerId);
      return {
        ...prev,
        [questionId]: exists
          ? list.filter((x) => x !== answerId)
          : [...list, answerId],
      };
    });
  };

  async function handleSubmit() {
    if (finished || !quiz) return;
    setFinished(true);
    const finishedAt = new Date().toISOString();

    const payload = {
      quizId: quiz.id,
      answers: Object.entries(answers).map(([questionId, ids]) => ({
        questionId,
        selectedAnswerIds: ids,
      })),
      startedAt,
      finishedAt,
    };

    const res = await FPApi.axios.post<QuizSubmitResult>(
      `/quiz/submit`,
      payload
    );

    const r = res.data;
    setResult(r);

    if (quiz.visibility === "public") {
      const t = await FPApi.axios.get(`/quiz/${quiz.id}/results`);
      setResultsTable(t.data);
    }
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const hasAnswered = answers[currentQuestion?.id]?.length > 0;

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  if (finished) {
    const percentage = result
      ? Math.round((result.score / result.total) * 100)
      : 0;

    const getPerformanceLevel = (percent: number) => {
      if (percent >= 90) return { label: 'Отлично', color: 'text-green-600' };
      if (percent >= 70) return { label: 'Хорошо', color: 'text-blue-600' };
      if (percent >= 50) return { label: 'Средне', color: 'text-yellow-600' };
      return { label: 'Нужно улучшить', color: 'text-red-600' };
    };

    const performance = getPerformanceLevel(percentage);

    return (
      <div className="max-w-3xl mx-auto space-y-6 py-8">
        <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent dark:from-blue-500/20 dark:via-blue-500/10 p-8 text-center border-b">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <h1 className="text-3xl font-bold mb-2">Квиз завершен!</h1>
            <p className="text-muted-foreground">Отличная работа</p>
          </div>

          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="inline-block bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800">
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
                  {result?.score}/{result?.total}
                </div>
                <div className="text-muted-foreground mt-2 text-lg font-medium">
                  {percentage}% правильных ответов
                </div>
                <Badge className={`mt-3 ${performance.color}`} variant="secondary">
                  {performance.label}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="p-4 rounded-lg bg-accent/50">
                  <div className="text-2xl font-bold text-foreground">{result?.total}</div>
                  <div className="text-xs text-muted-foreground">Всего вопросов</div>
                </div>
                <div className="p-4 rounded-lg bg-accent/50">
                  <div className="text-2xl font-bold text-green-600">{result?.score}</div>
                  <div className="text-xs text-muted-foreground">Правильных</div>
                </div>
                <div className="p-4 rounded-lg bg-accent/50">
                  <div className="text-2xl font-bold text-red-600">{result ? result.total - result.score : 0}</div>
                  <div className="text-xs text-muted-foreground">Неправильных</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {quiz.show_correct_answers && (
          <ShowCorrectAnswers quizId={quiz.id} userAnswers={answers} />
        )}

        {quiz.visibility === "public" && resultsTable.length > 0 && (
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-500" />
                Таблица результатов
              </h2>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">#</th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Пользователь
                      </th>
                      <th className="text-right py-3 px-4 font-semibold">
                        Счёт
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsTable.map((row, idx: number) => (
                      <tr
                        key={row.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 text-gray-600">{idx + 1}</td>
                        <td className="py-3 px-4">
                          {row.profile?.name ?? "Аноним"}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">
                          {row.score}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-8">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{quiz.title}</h1>
            {quiz.description && (
              <p className="text-muted-foreground text-lg">{quiz.description}</p>
            )}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <Badge variant="secondary" className="text-sm">
              Вопрос {currentQuestionIndex + 1} из {totalQuestions}
            </Badge>

            {quiz.has_timer && timeLeft !== null && (
              <Badge
                variant={timeLeft < 60 ? 'destructive' : 'secondary'}
                className="gap-2 text-sm"
              >
                <Clock className="h-4 w-4" />
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
              </Badge>
            )}
          </div>

          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{currentQuestion.text}</h2>

            <div className="space-y-3">
              {currentQuestion.answers.map((a) => {
                const isSelected = answers[currentQuestion.id]?.includes(a.id);

                return (
                  <label
                    key={a.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                        : "border-border hover:border-accent-foreground/20 hover:bg-accent/50"
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() =>
                        toggleAnswer(currentQuestion.id, a.id)
                      }
                      className="mt-0.5"
                    />
                    <span className="flex-1 text-base">{a.text}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestionIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Назад
            </Button>

            <Button onClick={handleNext} disabled={!hasAnswered} className="gap-2">
              {isLastQuestion ? (
                <>
                  <Trophy className="h-4 w-4" />
                  Завершить
                </>
              ) : (
                <>
                  Далее
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
            <span>
              {Object.keys(answers).length} из {totalQuestions} вопросов отвечено
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
