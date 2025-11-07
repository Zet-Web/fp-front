// Component displaying message when user has already attempted the quiz

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FPApi } from "@/lib/api";
import { Award, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { QuizResultsTableRow } from "../types/quiz";

type Props = {
  quizId: number;
  visibility: string;
};

export function AlreadyAttemptedView({ quizId, visibility }: Props) {
  const [resultsTable, setResultsTable] = useState<QuizResultsTableRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (visibility === "public") {
        try {
          const res = await FPApi.axios.get<QuizResultsTableRow[]>(
            `/quiz/${quizId}/results`
          );
          setResultsTable(res.data);
        } catch (error) {
          console.error("Error loading results:", error);
        }
      }
      setLoading(false);
    })();
  }, [quizId, visibility]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-8">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="pt-6 text-center space-y-6">
          <CheckCircle2 className="w-20 h-20 text-blue-500 mx-auto" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Квиз уже пройден</h2>
            <p className="text-muted-foreground text-lg">
              Вы уже проходили этот квиз ранее
            </p>
          </div>
        </CardContent>
      </Card>

      {visibility === "public" && (
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <CardTitle>Таблица результатов</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Лучшие результаты по этому квизу
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-muted-foreground mt-4">Загрузка результатов...</p>
              </div>
            ) : resultsTable.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-sm">#</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">
                        Пользователь
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-sm">
                        Результат
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsTable
                      .sort((a, b) => b.score - a.score)
                      .map((row, idx: number) => (
                      <tr
                        key={row.id}
                        className="border-b hover:bg-accent/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center">
                            {idx === 0 ? (
                              <Award className="h-5 w-5 text-yellow-500" />
                            ) : (
                              <span className="text-muted-foreground">{idx + 1}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {row.profile?.name ?? "Аноним"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Badge variant="secondary" className="font-semibold">
                            {row.score}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Нет доступных результатов
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
