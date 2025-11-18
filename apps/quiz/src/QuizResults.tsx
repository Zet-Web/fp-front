import { useAuthContext } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";
import { QuizResponse, QuizResultsTableRow } from "../types/quiz";
import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { FPApi } from "@/lib/api";

type Props = {
  quizId: number;
  visibility: QuizResponse["visibility"];
  quizAuthorId?: string;
};

export const QuizResults: React.FC<Props> = ({
  quizId,
  visibility,
  quizAuthorId,
}) => {
  const PAGE_LIMIT = 50;

  const { profile } = useAuthContext();
  const canShowResults =
    visibility === "public" ||
    ((visibility === "owner" || visibility === "partners") &&
      quizAuthorId === profile?.id);

  const [resultsTable, setResultsTable] = useState<QuizResultsTableRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const [sortBy, setSortBy] = useState<"score" | "name" | "created_at">(
    "score"
  );
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const debouncedSetSearch = useMemo(
    () =>
      debounce((val: string) => {
        setSearch(val);
        setOffset(0);
        setResultsTable([]);
      }, 400),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  const fetchPage = async (reset = false) => {
    if (!canShowResults) return;
    setLoading(true);

    try {
      const res = await FPApi.axios.get<{
        total_count: number;
        results: QuizResultsTableRow[];
      }>(`/quiz/${quizId}/results`, {
        params: {
          limit: PAGE_LIMIT,
          offset,
          sort: sortBy,
          order,
          search: search ?? undefined,
        },
      });

      const { results, total_count } = res.data;
      if (reset) {
        setResultsTable(results);
      } else {
        setResultsTable((prev) => [...prev, ...results]);
      }
      setTotalCount(total_count);
    } catch (err) {
      console.error("Error loading results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setOffset(0);
    setResultsTable([]);
    fetchPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId, visibility, sortBy, order, search, canShowResults]);

  const handleLoadMore = async () => {
    const nextOffset = offset + PAGE_LIMIT;
    setOffset(nextOffset);
    setLoading(true);
    try {
      const res = await FPApi.axios.get<{
        total_count: number;
        results: QuizResultsTableRow[];
      }>(`/quiz/${quizId}/results`, {
        params: {
          limit: PAGE_LIMIT,
          offset: nextOffset,
          sort: sortBy,
          order,
          search: search ?? undefined,
        },
      });
      setResultsTable((prev) => [...prev, ...res.data.results]);
      setTotalCount(res.data.total_count);
    } catch (err) {
      console.error("Error loading more results", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSortClick = (column: "score" | "name" | "created_at") => {
    if (sortBy === column) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setOrder(column === "score" ? "desc" : "asc");
    }
  };

  const onSearchChange = (v: string) => {
    setSearchInput(v);
    debouncedSetSearch(v);
  };

  if (!canShowResults) return <></>;

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <h2 className="text-2xl font-bold">Результаты</h2>
        <p className="text-sm text-muted-foreground">Лучшие результаты</p>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between gap-4">
          <Input
            placeholder="Поиск..."
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-md"
          />
          <div className="text-sm text-muted-foreground">
            {totalCount !== null ? `Всего результатов: ${totalCount}` : null}
          </div>
        </div>

        {loading && resultsTable.length === 0 ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground mt-4">Загрузка...</p>
          </div>
        ) : resultsTable.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th
                    className="text-left py-3 px-4 font-semibold cursor-pointer select-none"
                    onClick={() => {
                      handleSortClick("score");
                    }}
                  >
                    <div className="flex items-center gap-2">
                      #
                      {sortBy === "score" &&
                        (order === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </div>
                  </th>

                  <th
                    className="text-left py-3 px-4 font-semibold cursor-pointer select-none"
                    onClick={() => handleSortClick("name")}
                  >
                    <div className="flex items-center gap-2">
                      Пользователь
                      {sortBy === "name" &&
                        (order === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </div>
                  </th>

                  <th
                    className="text-right py-3 px-4 font-semibold cursor-pointer select-none"
                    onClick={() => handleSortClick("score")}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Счёт
                      {sortBy === "score" &&
                        (order === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {resultsTable.map((row) => {
                  const getRankDisplay = (rank: number) => {
                    if (rank === 1) {
                      return (
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white font-bold text-sm shadow-sm">
                          1
                        </div>
                      );
                    }
                    if (rank === 2) {
                      return (
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 text-white font-bold text-sm shadow-sm">
                          2
                        </div>
                      );
                    }
                    if (rank === 3) {
                      return (
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold text-sm shadow-sm">
                          3
                        </div>
                      );
                    }
                    return (
                      <span className="text-muted-foreground font-medium">
                        {rank}
                      </span>
                    );
                  };

                  return (
                    <tr
                      key={row.id}
                      className="border-b hover:bg-accent/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-start">
                          {getRankDisplay(row.rank)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {row.profile?.name ?? "Аноним"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant="secondary" className="font-semibold">
                          {row.score}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="mt-4 flex justify-center">
              {totalCount === null ||
              resultsTable.length < (totalCount ?? 0) ? (
                <Button onClick={handleLoadMore} disabled={loading}>
                  {loading ? "Загрузка..." : "Показать ещё"}
                </Button>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Больше нет результатов
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            Нет доступных результатов
          </p>
        )}
      </CardContent>
    </Card>
  );
};
