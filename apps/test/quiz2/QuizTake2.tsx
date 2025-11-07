// Alternative quiz taking with sidebar navigation showing all questions at once

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Send, ChevronRight, Check } from 'lucide-react';
import { Quiz2, Quiz2Result } from './quiz2-types';

interface QuizTake2Props {
  quiz: Quiz2;
  onComplete: (result: Quiz2Result) => void;
}

export function QuizTake2({ quiz, onComplete }: QuizTake2Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(
    quiz.settings.hasTimer && quiz.settings.timerMinutes ? quiz.settings.timerMinutes * 60 : null
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
  const answeredCount = Object.keys(answers).filter((k) => answers[k]?.length > 0).length;

  const toggleAnswer = (answerId: string) => {
    const questionId = currentQuestion.id;
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      const exists = current.includes(answerId);
      return {
        ...prev,
        [questionId]: exists ? current.filter((id) => id !== answerId) : [...current, answerId],
      };
    });
  };

  const handleFinish = () => {
    if (isFinished) return;
    setIsFinished(true);

    let score = 0;
    quiz.questions.forEach((question) => {
      const userAnswers = answers[question.id] || [];
      const correctAnswers = question.answers.filter((a) => a.correct).map((a) => a.id);

      const allCorrect =
        userAnswers.length === correctAnswers.length && userAnswers.every((id) => correctAnswers.includes(id));

      if (allCorrect) {
        score++;
      }
    });

    const result: Quiz2Result = {
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

  const getQuestionStatus = (questionId: string) => {
    return answers[questionId]?.length > 0 ? 'answered' : 'unanswered';
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)] max-h-[800px]">
      {/* Sidebar */}
      <Card className="w-64 shadow-md flex flex-col">
        <CardContent className="p-4 flex flex-col h-full">
          <div className="space-y-4 flex-1">
            <div>
              <h3 className="font-semibold text-sm mb-2">Quiz Progress</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Answered</span>
                <Badge variant="secondary">
                  {answeredCount}/{quiz.questions.length}
                </Badge>
              </div>
            </div>

            {quiz.settings.hasTimer && timeLeft !== null && (
              <div className="p-3 rounded-lg bg-accent/50 border">
                <div className="flex items-center gap-2 text-sm font-medium mb-1">
                  <Clock className="h-4 w-4" />
                  Time Remaining
                </div>
                <div className={`text-2xl font-bold ${timeLeft < 60 ? 'text-destructive' : ''}`}>
                  {formatTime(timeLeft)}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-sm mb-2">Questions</h4>
              <ScrollArea className="h-[300px] pr-3">
                <div className="space-y-1">
                  {quiz.questions.map((question, index) => {
                    const status = getQuestionStatus(question.id);
                    const isActive = index === currentQuestionIndex;

                    return (
                      <button
                        key={question.id}
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all ${
                          isActive
                            ? 'bg-blue-500 text-white'
                            : status === 'answered'
                            ? 'bg-green-100 dark:bg-green-950/30 border border-green-300 dark:border-green-800'
                            : 'bg-accent hover:bg-accent/80'
                        }`}
                      >
                        <div
                          className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                            isActive ? 'bg-white/20' : status === 'answered' ? 'bg-green-200 dark:bg-green-900' : 'bg-background'
                          }`}
                        >
                          {status === 'answered' && !isActive ? (
                            <Check className="h-3 w-3 text-green-700 dark:text-green-400" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span className="text-sm truncate flex-1">Q{index + 1}</span>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          <Button onClick={handleFinish} className="w-full mt-4 gap-2" size="lg">
            <Send className="h-4 w-4" />
            Submit Quiz
          </Button>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex-1 space-y-4">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Question {currentQuestionIndex + 1}</Badge>
                    <span className="text-sm text-muted-foreground">of {quiz.questions.length}</span>
                  </div>
                  <h2 className="text-2xl font-semibold">{currentQuestion.text}</h2>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                {currentQuestion.answers.map((answer) => {
                  const isSelected = answers[currentQuestion.id]?.includes(answer.id);

                  return (
                    <button
                      key={answer.id}
                      onClick={() => toggleAnswer(answer.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-sm'
                          : 'border-border hover:border-blue-200 dark:hover:border-blue-900 hover:bg-accent/50'
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-muted-foreground/30'
                        }`}
                      >
                        {isSelected && <Check className="h-4 w-4 text-white" />}
                      </div>
                      <span className="flex-1 text-base">{answer.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            Select your answer{currentQuestion.answers.filter((a) => a.correct).length > 1 ? 's' : ''} above
          </div>

          <Button
            onClick={() => setCurrentQuestionIndex((prev) => Math.min(quiz.questions.length - 1, prev + 1))}
            disabled={currentQuestionIndex === quiz.questions.length - 1}
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
