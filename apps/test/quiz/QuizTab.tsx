// Main Quiz tab component showcasing modernized quiz functionality

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileEdit, Play, Trophy, ListChecks, Clock, Eye } from 'lucide-react';
import { QuizCreate } from './QuizCreate';
import { QuizTake } from './QuizTake';
import { QuizResults } from './QuizResults';
import { mockQuiz, mockQuizAttempts } from './quiz-mock-data';
import { Quiz, QuizResult } from './quiz-types';

type QuizView = 'overview' | 'create' | 'take' | 'results';

export function QuizTab() {
  const [view, setView] = useState<QuizView>('overview');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const handleCreateQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setView('overview');
  };

  const handleStartQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setView('take');
  };

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result);
    setView('results');
  };

  const resetView = () => {
    setView('overview');
    setCurrentQuiz(null);
    setQuizResult(null);
  };

  if (view === 'create') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Создать тест</h2>
            <p className="text-muted-foreground">
              Спроектируйте тформат и детали тестирования
            </p>
          </div>
          <Button variant="outline" onClick={() => setView('overview')}>
            Отмена
          </Button>
        </div>
        <QuizCreate onSubmit={handleCreateQuiz} />
      </div>
    );
  }

  if (view === 'take' && currentQuiz) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={resetView}>
          Exit Quiz
        </Button>
        <QuizTake quiz={currentQuiz} onComplete={handleQuizComplete} />
      </div>
    );
  }

  if (view === 'results' && currentQuiz && quizResult) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={resetView}>
          Back to Overview
        </Button>
        <QuizResults
          quiz={currentQuiz}
          result={quizResult}
          attempts={mockQuizAttempts}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
              <Trophy className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Quiz System Demo</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Test the modernized quiz interface with our card-based design system.
                Create custom quizzes, take interactive assessments, and view detailed results.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="demo" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="demo" className="gap-2">
            <Play className="h-4 w-4" />
            Try Demo Quiz
          </TabsTrigger>
          <TabsTrigger value="create" className="gap-2">
            <FileEdit className="h-4 w-4" />
            Create Quiz
          </TabsTrigger>
        </TabsList>

        <TabsContent value="demo" className="space-y-4">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{mockQuiz.title}</h3>
                  <p className="text-muted-foreground">{mockQuiz.description}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/20 text-sm">
                    <ListChecks className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{mockQuiz.questions.length}</span>
                    <span className="text-muted-foreground">Questions</span>
                  </div>

                  {mockQuiz.settings.hasTimer && mockQuiz.settings.timerMinutes && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/20 text-sm">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{mockQuiz.settings.timerMinutes}</span>
                      <span className="text-muted-foreground">Minutes</span>
                    </div>
                  )}

                  {mockQuiz.settings.showCorrectAnswers && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/20 text-sm">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Answer Review</span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleStartQuiz(mockQuiz)}
                  className="w-full gap-2"
                  size="lg"
                >
                  <Play className="h-4 w-4" />
                  Start Quiz
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3">Features Demonstrated:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Card-based design system with theme-aware styling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Interactive question navigation with progress tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Timer functionality with visual countdown</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Detailed results with answer review</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Public leaderboard with user rankings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Smooth transitions and hover effects</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card className="shadow-md">
            <CardContent className="pt-6 text-center space-y-4">
              <FileEdit className="h-12 w-12 mx-auto text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Create Your Own Quiz</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Design a custom quiz with your own questions, settings, and timer options
                </p>
              </div>
              <Button onClick={() => setView('create')} className="gap-2">
                <FileEdit className="h-4 w-4" />
                Start Creating
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
