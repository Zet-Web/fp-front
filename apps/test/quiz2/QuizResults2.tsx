// Alternative quiz results with enhanced visualizations and circular progress

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trophy, TrendingUp, Target, Award, CheckCircle2, XCircle } from 'lucide-react';
import { Quiz2, Quiz2Result, Quiz2Attempt } from './quiz2-types';

interface QuizResults2Props {
  quiz: Quiz2;
  result: Quiz2Result;
  attempts?: Quiz2Attempt[];
}

export function QuizResults2({ quiz, result, attempts = [] }: QuizResults2Props) {
  const percentage = Math.round((result.score / result.total) * 100);
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getGrade = (percent: number) => {
    if (percent >= 90) return { grade: 'A', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-950/30' };
    if (percent >= 80) return { grade: 'B', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-950/30' };
    if (percent >= 70) return { grade: 'C', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-950/30' };
    if (percent >= 60) return { grade: 'D', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-950/30' };
    return { grade: 'F', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-950/30' };
  };

  const gradeInfo = getGrade(percentage);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero Card */}
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-blue-500/10 via-transparent to-transparent p-8 border-b">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-blue-500/20">
              <Trophy className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Quiz Complete!</h1>
              <p className="text-muted-foreground">Here's how you performed</p>
            </div>
          </div>
        </div>

        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Circular Progress */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted/20"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="text-blue-500 transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold">{percentage}%</div>
                  <div className={`text-4xl font-bold mt-1 ${gradeInfo.color}`}>{gradeInfo.grade}</div>
                </div>
              </div>
              <Badge className={`mt-4 ${gradeInfo.bgColor} ${gradeInfo.color} border-0`}>
                {result.score} of {result.total} correct
              </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="shadow-sm">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-3xl font-bold">{result.total}</div>
                  <div className="text-sm text-muted-foreground">Total Questions</div>
                </CardContent>
              </Card>

              <Card className="shadow-sm bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-3xl font-bold text-green-600">{result.score}</div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </CardContent>
              </Card>

              <Card className="shadow-sm bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                <CardContent className="p-4 text-center">
                  <XCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                  <div className="text-3xl font-bold text-red-600">{result.total - result.score}</div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </CardContent>
              </Card>

              <Card className="shadow-sm bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-3xl font-bold text-blue-600">{percentage}%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answer Review */}
      {quiz.settings.showCorrectAnswers && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-500" />
              Detailed Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {quiz.questions.map((question, index) => {
              const userAnswers = result.userAnswers[question.id] || [];
              const correctAnswers = question.answers.filter((a) => a.correct).map((a) => a.id);
              const isCorrect =
                userAnswers.length === correctAnswers.length && userAnswers.every((id) => correctAnswers.includes(id));

              return (
                <div key={question.id}>
                  {index > 0 && <Separator className="my-6" />}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 p-2 rounded-lg ${isCorrect ? 'bg-green-100 dark:bg-green-950/30' : 'bg-red-100 dark:bg-red-950/30'}`}>
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Question {index + 1}</Badge>
                          {isCorrect ? (
                            <Badge className="bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-0">
                              Correct
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-0">
                              Incorrect
                            </Badge>
                          )}
                        </div>
                        <div className="font-semibold text-lg">{question.text}</div>
                      </div>
                    </div>

                    <div className="ml-14 grid gap-2">
                      {question.answers.map((answer) => {
                        const userSelected = userAnswers.includes(answer.id);
                        const isCorrectAnswer = answer.correct;

                        let bgClass = 'bg-accent/30 border-border';
                        let iconElement = null;

                        if (isCorrectAnswer) {
                          bgClass = 'bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-800';
                          iconElement = <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />;
                        } else if (userSelected) {
                          bgClass = 'bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-800';
                          iconElement = <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
                        }

                        return (
                          <div key={answer.id} className={`flex items-center gap-3 p-3 rounded-lg border ${bgClass}`}>
                            {iconElement || <div className="w-5 h-5 flex-shrink-0" />}
                            <span className={isCorrectAnswer ? 'font-medium' : ''}>{answer.text}</span>
                            {isCorrectAnswer && (
                              <Badge variant="outline" className="ml-auto text-xs bg-white dark:bg-background">
                                Correct Answer
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      {quiz.settings.visibility === 'public' && attempts.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-500" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attempts
                .sort((a, b) => b.score - a.score)
                .slice(0, 10)
                .map((attempt, index) => {
                  const userPercentage = Math.round((attempt.score / result.total) * 100);
                  const isTopThree = index < 3;

                  return (
                    <div
                      key={attempt.id}
                      className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                        isTopThree
                          ? 'bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20 border border-blue-200 dark:border-blue-800'
                          : 'bg-accent/30 hover:bg-accent/50'
                      }`}
                    >
                      <div className="flex items-center justify-center w-8">
                        {index === 0 ? (
                          <Trophy className="h-6 w-6 text-yellow-500" />
                        ) : index === 1 ? (
                          <Trophy className="h-5 w-5 text-gray-400" />
                        ) : index === 2 ? (
                          <Trophy className="h-5 w-5 text-amber-600" />
                        ) : (
                          <span className="text-lg font-semibold text-muted-foreground">{index + 1}</span>
                        )}
                      </div>

                      <Avatar className="w-10 h-10">
                        <AvatarImage src={attempt.avatarUrl} alt={attempt.userName} />
                        <AvatarFallback>
                          {attempt.userName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{attempt.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {attempt.score}/{result.total} questions
                        </div>
                      </div>

                      <div className="text-right">
                        <Badge variant={isTopThree ? 'default' : 'secondary'} className="font-semibold">
                          {userPercentage}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
