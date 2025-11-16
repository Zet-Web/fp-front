import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { QuizResponse } from "../types/quiz";
import { QuizResults } from "./QuizResults";

type Props = {
  quizId: number;
  visibility: QuizResponse["visibility"];
  quizAuthorId?: string;
};

export function AlreadyAttemptedQuizView({
  quizId,
  visibility,
  quizAuthorId,
}: Props) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="pt-6 text-center space-y-6">
          <CheckCircle2 className="w-20 h-20 text-blue-500 mx-auto" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Тест уже пройден</h2>
            <p className="text-muted-foreground text-lg">
              Вы уже проходили этот тест ранее
            </p>
          </div>
        </CardContent>
      </Card>

      <QuizResults
        quizId={quizId}
        visibility={visibility}
        quizAuthorId={quizAuthorId}
      />
    </div>
  );
}
