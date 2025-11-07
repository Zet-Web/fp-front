// Modernized quiz taking interface with card-based design and theme support

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, ChevronRight, ChevronLeft, Trophy, CheckCircle2 } from 'lucide-react';
import { Quiz, QuizResult } from './quiz-types';

interface QuizTakeProps {
  quiz: Quiz;
  onComplete: (result: QuizResult) => void;
}

export function QuizTake({ quiz, onComplete }: QuizTakeProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(
    quiz.settings.hasTimer && quiz.settings.timerMinutes
      ? quiz.settings.timerMinutes * 60
      : null
  );
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (timeLeft === null || isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const hasAnswered = answers[currentQuestion?.id]?.length > 0;

  const toggleAnswer = (answerId: string) => {
    const questionId = currentQuestion.id;
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      const exists = current.includes(answerId);
      return {
        ...prev,
        [questionId]: exists
          ? current.filter((id) => id !== answerId)
          : [...current, answerId],
      };
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleFinish();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  const handleFinish = () => {
    if (isFinished) return;
    setIsFinished(true);

    let score = 0;
    quiz.questions.forEach((question) => {
      const userAnswers = answers[question.id] || [];
      const correctAnswers = question.answers
        .filter((a) => a.correct)
        .map((a) => a.id);

      const allCorrect =
        userAnswers.length === correctAnswers.length &&
        userAnswers.every((id) => correctAnswers.includes(id));

      if (allCorrect) {
        score++;
      }
    });

    const result: QuizResult = {
      id: `result_${Date.now()}`,
      quizId: quiz.id,
      score,
      total: quiz.questions.length,
      userAnswers: answers,
      completedAt: new Date().toISOString(),
    };

    onComplete(result);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </Badge>

            {quiz.settings.hasTimer && timeLeft !== null && (
              <Badge
                variant={timeLeft < 60 ? 'destructive' : 'secondary'}
                className="gap-2 text-sm"
              >
                <Clock className="h-4 w-4" />
                {formatTime(timeLeft)}
              </Badge>
            )}
          </div>

          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{currentQuestion.text}</h2>

            <div className="space-y-3">
              {currentQuestion.answers.map((answer) => {
                const isSelected = answers[currentQuestion.id]?.includes(answer.id);

                return (
                  <label
                    key={answer.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                        : 'border-border hover:border-accent-foreground/20 hover:bg-accent/50'
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleAnswer(answer.id)}
                      className="mt-0.5"
                    />
                    <span className="flex-1 text-base">{answer.text}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button onClick={handleNext} disabled={!hasAnswered} className="gap-2">
              {isLastQuestion ? (
                <>
                  <Trophy className="h-4 w-4" />
                  Finish Quiz
                </>
              ) : (
                <>
                  Next
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
              {Object.keys(answers).length} of {totalQuestions} questions answered
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
