// Modernized quiz results display with card-based design and theme support

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, CheckCircle2, XCircle, BarChart3 } from 'lucide-react';
import { Quiz, QuizResult, QuizAttempt } from './quiz-types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface QuizResultsProps {
  quiz: Quiz;
  result: QuizResult;
  attempts?: QuizAttempt[];
}

export function QuizResults({ quiz, result, attempts = [] }: QuizResultsProps) {
  const percentage = Math.round((result.score / result.total) * 100);

  const getPerformanceLevel = (percent: number) => {
    if (percent >= 90) return { label: 'Excellent', color: 'text-green-600' };
    if (percent >= 70) return { label: 'Good', color: 'text-blue-600' };
    if (percent >= 50) return { label: 'Average', color: 'text-yellow-600' };
    return { label: 'Needs Improvement', color: 'text-red-600' };
  };

  const performance = getPerformanceLevel(percentage);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent dark:from-blue-500/20 dark:via-blue-500/10 p-8 text-center border-b">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-blue-500" />
          <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
          <p className="text-muted-foreground">Great job finishing the quiz</p>
        </div>

        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="inline-block bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
                {result.score}/{result.total}
              </div>
              <div className="text-muted-foreground mt-2 text-lg font-medium">
                {percentage}% Correct
              </div>
              <Badge className={`mt-3 ${performance.color}`} variant="secondary">
                {performance.label}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="p-4 rounded-lg bg-accent/50">
                <div className="text-2xl font-bold text-foreground">{result.total}</div>
                <div className="text-xs text-muted-foreground">Total Questions</div>
              </div>
              <div className="p-4 rounded-lg bg-accent/50">
                <div className="text-2xl font-bold text-green-600">{result.score}</div>
                <div className="text-xs text-muted-foreground">Correct</div>
              </div>
              <div className="p-4 rounded-lg bg-accent/50">
                <div className="text-2xl font-bold text-red-600">
                  {result.total - result.score}
                </div>
                <div className="text-xs text-muted-foreground">Incorrect</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {quiz.settings.showCorrectAnswers && (
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-500" />
              <CardTitle>Answer Review</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {quiz.questions.map((question, index) => {
              const userAnswers = result.userAnswers[question.id] || [];
              const correctAnswers = question.answers
                .filter((a) => a.correct)
                .map((a) => a.id);

              const isCorrect =
                userAnswers.length === correctAnswers.length &&
                userAnswers.every((id) => correctAnswers.includes(id));

              return (
                <div key={question.id} className="space-y-3">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold">
                        {index + 1}. {question.text}
                      </div>
                    </div>
                  </div>

                  <div className="ml-8 space-y-2">
                    {question.answers.map((answer) => {
                      const userSelected = userAnswers.includes(answer.id);
                      const isCorrectAnswer = answer.correct;

                      let className = 'flex items-center gap-2 p-3 rounded-lg ';
                      if (isCorrectAnswer) {
                        className +=
                          'bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800';
                      } else if (userSelected) {
                        className +=
                          'bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800';
                      } else {
                        className += 'bg-accent/30';
                      }

                      return (
                        <div key={answer.id} className={className}>
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
                            {answer.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {quiz.settings.visibility === 'public' && attempts.length > 0 && (
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <CardTitle>Leaderboard</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Top performers on this quiz
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attempts
                  .sort((a, b) => b.score - a.score)
                  .map((attempt, index) => (
                    <TableRow key={attempt.id} className="hover:bg-accent/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center justify-center">
                          {index === 0 ? (
                            <Award className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <span className="text-muted-foreground">{index + 1}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={attempt.avatarUrl} alt={attempt.userName} />
                            <AvatarFallback>
                              {attempt.userName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{attempt.userName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="font-semibold">
                          {attempt.score}/{result.total}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
