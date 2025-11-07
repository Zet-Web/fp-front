import { useEffect, useState } from "react";
import { QuizCorrectAnswer } from "../types/quiz";
import { FPApi } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

type Props = {
  quizId: number;
  userAnswers: Record<string, number[]>;
};

export function ShowCorrectAnswers({ quizId, userAnswers }: Props) {
  const [data, setData] = useState<QuizCorrectAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await FPApi.axios.get<QuizCorrectAnswer[]>(
        `/quiz/${quizId}/correct`
      );
      setData(res.data);
      setLoading(false);
    })();
  }, [quizId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Загрузка правильных ответов...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
          Правильные ответы
        </h2>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((q, idx) => (
          <div key={q.id} className="space-y-3">
            <div className="font-semibold text-lg">
              {idx + 1}. {q.title}
            </div>
            <div className="space-y-2 pl-4">
              {q.answers.map((a) => {
                const userSelected = userAnswers[q.id]?.includes(a.id);
                const correct = a.correct;

                return (
                  <div
                    key={a.id}
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      correct
                        ? "bg-green-50 border-2 border-green-200"
                        : userSelected
                        ? "bg-red-50 border-2 border-red-200"
                        : "bg-gray-50"
                    }`}
                  >
                    {correct ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : userSelected ? (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span
                      className={
                        correct
                          ? "text-green-800 font-medium"
                          : userSelected
                          ? "text-red-800"
                          : "text-gray-600"
                      }
                    >
                      {a.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
