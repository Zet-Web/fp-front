// Compact quiz taking interface with start screen and optimized design

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthContext } from "@/components/auth-provider";
import { FPApi } from "@/lib/api";
import {
  Clock,
  Award,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Trophy,
  CheckCircle2,
  Play,
} from "lucide-react";
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
  const [quizStarted, setQuizStarted] = useState(false);

  const load = async () => {
    const res = await FPApi.axios.get<QuizResponse>(`/quiz/by-post/${postId}`);
    const data = res.data;
    setQuiz(data);

    const init: Record<string, number[]> = {};
    data.questions?.forEach((q) => (init[q.id] = []));
    setAnswers(init);

    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  useEffect(() => {
    if (timeLeft === null || finished || !quizStarted) return;
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
  }, [timeLeft, finished, quizStarted]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setStartedAt(new Date().toISOString());
    if (quiz?.has_timer && quiz?.timer_minutes) {
      setTimeLeft(quiz.timer_minutes * 60);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-6 text-center space-y-3">
          <XCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-lg font-semibold">Тест не найден</h3>
          <p className="text-sm text-muted-foreground">
            Запрашиваемый тест не существует
          </p>
        </CardContent>
      </Card>
    );
  }

  if (quiz.allow_pause) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-6 text-center space-y-3">
          <Clock className="w-12 h-12 text-orange-500 mx-auto" />
          <h3 className="text-lg font-semibold">Тест на паузе</h3>
          <p className="text-sm text-muted-foreground">
            Тест временно недоступен
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!quiz.anonymous && !profileId) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-6 text-center space-y-3">
          <XCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-lg font-semibold">Требуется авторизация</h3>
          <p className="text-sm text-muted-foreground">
            Только авторизованные пользователи могут пройти этот тест
          </p>
        </CardContent>
      </Card>
    );
  }

  if (
    (quiz.one_attempt_per_user || !quiz.anonymous) &&
    profileId &&
    quiz.alreadyAttempted
  ) {
    return (
      <AlreadyAttemptedView
        quizId={quiz.id}
        visibility={quiz.visibility}
        quizAuthorId={quiz.author_id}
      />
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

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  if (!quizStarted) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-sm">
                {quiz.questions.length}{" "}
                {quiz.questions.length === 1 ? "вопрос" : "вопросов"}
              </Badge>
              {quiz.has_timer && quiz.timer_minutes && (
                <Badge variant="outline" className="gap-1.5 text-sm">
                  <Clock className="h-3.5 w-3.5" />
                  {quiz.timer_minutes} мин
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                {quiz.anonymous
                  ? "Анонимно"
                  : "Требуется авторизация"}
              </p>
            </div>
            {quiz.one_attempt_per_user && (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Одна попытка
                </p>
              </div>
            )}
            {quiz.show_correct_answers && (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Правильные ответы будут показаны после завершения
                </p>
              </div>
            )}
          </div>

          <Button
            onClick={handleStartQuiz}
            className="w-full gap-2 mt-4"
            size="lg"
          >
            <Play className="h-4 w-4" />
            Начать
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (finished) {
    const percentage = result
      ? Math.round((result.score / result.total) * 100)
      : 0;

    const getPerformanceLevel = (percent: number) => {
      if (percent >= 90) return { label: "Отлично", color: "text-green-600" };
      if (percent >= 70) return { label: "Хорошо", color: "text-blue-600" };
      if (percent >= 50) return { label: "Средне", color: "text-yellow-600" };
      return { label: "Нужно улучшить", color: "text-red-600" };
    };

    const performance = getPerformanceLevel(percentage);

    return (
      <div className="space-y-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent dark:from-blue-500/20 dark:via-blue-500/10 p-6 text-center border-b">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-blue-500" />
            <h2 className="text-2xl font-bold mb-1">Тест завершен!</h2>
            <p className="text-sm text-muted-foreground">Отличная работа</p>
          </div>

          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="inline-block bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
                  {result?.score}/{result?.total}
                </div>
                <div className="text-muted-foreground mt-1.5 text-base font-medium">
                  {percentage}% Правильных
                </div>
                <Badge
                  className={`mt-2 ${performance.color}`}
                  variant="secondary"
                >
                  {performance.label}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-accent/50">
                  <div className="text-xl font-bold text-foreground">
                    {result?.total}
                  </div>
                  <div className="text-xs text-muted-foreground">Всего</div>
                </div>
                <div className="p-3 rounded-lg bg-accent/50">
                  <div className="text-xl font-bold text-green-600">
                    {result?.score}
                  </div>
                  <div className="text-xs text-muted-foreground">Верно</div>
                </div>
                <div className="p-3 rounded-lg bg-accent/50">
                  <div className="text-xl font-bold text-red-600">
                    {result ? result.total - result.score : 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Неверно</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {quiz.show_correct_answers && (
          <ShowCorrectAnswers quizId={quiz.id} userAnswers={answers} />
        )}

        {quiz.visibility === "public" && resultsTable.length > 0 && (
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold">Результаты</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Лучшие результаты
              </p>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 text-sm font-semibold">
                        #
                      </th>
                      <th className="text-left py-2 px-3 text-sm font-semibold">
                        Пользователь
                      </th>
                      <th className="text-right py-2 px-3 text-sm font-semibold">
                        Баллы
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsTable.map((row, idx: number) => (
                      <tr
                        key={row.id}
                        className="border-b hover:bg-accent/50 transition-colors"
                      >
                        <td className="py-2 px-3">
                          <div className="flex items-center justify-center">
                            {idx === 0 ? (
                              <Award className="h-4 w-4 text-yellow-500" />
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                {idx + 1}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-3 text-sm">
                          {row.profile?.name ?? "Аноним"}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <Badge
                            variant="secondary"
                            className="text-xs font-semibold"
                          >
                            {row.score}/{result?.total}
                          </Badge>
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
    <div className="space-y-4">
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="secondary" className="text-xs">
              {currentQuestionIndex + 1} / {totalQuestions}
            </Badge>

            {quiz.has_timer && timeLeft !== null && (
              <Badge
                variant={timeLeft < 60 ? "destructive" : "secondary"}
                className="gap-1.5 text-xs"
              >
                <Clock className="h-3.5 w-3.5" />
                {formatTime(timeLeft)}
              </Badge>
            )}
          </div>

          <Progress value={progress} className="h-1.5" />
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-4">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold leading-snug">
              {currentQuestion.text}
            </h2>

            <div className="space-y-2">
              {currentQuestion.answers.map((a) => {
                const isSelected = answers[currentQuestion.id]?.includes(a.id);

                return (
                  <label
                    key={a.id}
                    className={`flex items-start gap-2.5 p-3 rounded-lg border-2 cursor-pointer transition-all ${
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
                    <span className="flex-1 text-sm leading-relaxed">
                      {a.text}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              size="sm"
              className="gap-1.5"
            >
              <ChevronLeft className="h-4 w-4" />
              Назад
            </Button>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>
                {
                  Object.keys(answers).filter((key) => answers[key].length > 0)
                    .length
                }{" "}
                / {totalQuestions}
              </span>
            </div>

            <Button
              onClick={handleNext}
              disabled={!hasAnswered}
              size="sm"
              className="gap-1.5"
            >
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
    </div>
  );
}
