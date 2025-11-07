import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
      <Card>
        <CardContent className="pt-6 text-center space-y-6">
          <CheckCircle2 className="w-20 h-20 text-blue-500 mx-auto" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Квиз уже пройден</h2>
            <p className="text-gray-600 text-lg">
              Вы уже проходили этот квиз ранее
            </p>
          </div>
        </CardContent>
      </Card>

      {visibility === "public" && (
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              Таблица результатов
            </h2>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-600 mt-4">Загрузка результатов...</p>
              </div>
            ) : resultsTable.length > 0 ? (
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
            ) : (
              <p className="text-center text-gray-600 py-4">
                Нет доступных результатов
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
