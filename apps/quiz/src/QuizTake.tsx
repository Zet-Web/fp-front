import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuthContext } from "@/components/auth-provider";
import { FPApi } from "@/lib/api";
import { Clock, Award, XCircle, ChevronRight, Trophy } from "lucide-react";
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
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Загрузка квиза...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold">Квиз не найден</h2>
            <p className="text-gray-600">Запрашиваемый квиз не существует</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quiz.allow_pause) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <Clock className="w-16 h-16 text-orange-500 mx-auto" />
            <h2 className="text-xl font-semibold">Квиз на паузе</h2>
            <p className="text-gray-600">Квиз временно недоступен</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quiz.anonymous && !profileId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold">Требуется авторизация</h2>
            <p className="text-gray-600">
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

    return (
      <div className="max-w-3xl mx-auto space-y-6 py-8">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 text-center">
            <Trophy className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Квиз завершен!</h1>
            <p className="text-blue-100">Отличная работа</p>
          </div>

          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {result?.score}/{result?.total}
                </div>
                <div className="text-gray-600 mt-2 text-lg">
                  {percentage}% правильных ответов
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {quiz.show_correct_answers && (
          <ShowCorrectAnswers quizId={quiz.id} userAnswers={answers} />
        )}

        {quiz.visibility === "public" && resultsTable.length > 0 && (
          <Card>
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
      <Card>
        <CardHeader className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{quiz.title}</h1>
            {quiz.description && (
              <p className="text-gray-600 text-lg">{quiz.description}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                Вопрос {currentQuestionIndex + 1} из {totalQuestions}
              </div>
            </div>

            {quiz.has_timer && timeLeft !== null && (
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full font-medium ${
                  timeLeft < 60
                    ? "bg-red-100 text-red-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>
                  {Math.floor(timeLeft / 60)}:
                  {String(timeLeft % 60).padStart(2, "0")}
                </span>
              </div>
            )}
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
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
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
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
            >
              Назад
            </Button>

            <Button onClick={handleNext} disabled={!hasAnswered}>
              {isLastQuestion ? "Завершить" : "Далее"}
              {!isLastQuestion && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
