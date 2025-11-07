// Component for displaying correct answers with enhanced visual feedback

import { useEffect, useState } from "react";
import { QuizCorrectAnswer } from "../types/quiz";
import { FPApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card className="shadow-md">
        <CardContent className="py-8 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground mt-4">Загрузка правильных ответов...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-blue-500" />
          <CardTitle>Правильные ответы</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((q, idx) => (
          <div key={q.id} className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {userAnswers[q.id]?.every((id) => q.answers.find((a) => a.id === id)?.correct) &&
                userAnswers[q.id]?.length === q.answers.filter((a) => a.correct).length ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold">
                  {idx + 1}. {q.title}
                </div>
              </div>
            </div>
            <div className="ml-8 space-y-2">
              {q.answers.map((a) => {
                const userSelected = userAnswers[q.id]?.includes(a.id);
                const isCorrectAnswer = a.correct;

                let className = 'flex items-center gap-2 p-3 rounded-lg ';
                if (isCorrectAnswer) {
                  className += 'bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800';
                } else if (userSelected) {
                  className += 'bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800';
                } else {
                  className += 'bg-accent/30';
                }

                return (
                  <div key={a.id} className={className}>
                    {isCorrectAnswer ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : userSelected ? (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span
                      className={
                        isCorrectAnswer
                          ? 'font-medium'
                          : userSelected
                          ? 'text-muted-foreground'
                          : 'text-muted-foreground'
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
