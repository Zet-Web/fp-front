// Main Quiz 2 tab component - Alternative design showcase

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, FileEdit, Trophy, Clock, ListChecks, Eye, ArrowLeft } from 'lucide-react';
import { QuizCreate2 } from './QuizCreate2';
import { QuizTake2 } from './QuizTake2';
import { QuizResults2 } from './QuizResults2';
import { mockQuiz2, mockQuiz2Attempts } from './quiz2-mock-data';
import { Quiz2, Quiz2Result } from './quiz2-types';

type Quiz2View = 'overview' | 'create' | 'take' | 'results';

export function Quiz2Tab() {
  const [view, setView] = useState<Quiz2View>('overview');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz2 | null>(null);
  const [quizResult, setQuizResult] = useState<Quiz2Result | null>(null);

  const handleCreateQuiz = (quiz: Quiz2) => {
    setCurrentQuiz(quiz);
    setView('overview');
  };

  const handleStartQuiz = (quiz: Quiz2) => {
    setCurrentQuiz(quiz);
    setView('take');
  };

  const handleQuizComplete = (result: Quiz2Result) => {
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
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setView('overview')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h2 className="text-xl font-bold">Create New Quiz</h2>
            <p className="text-sm text-muted-foreground">Alternative wizard-style interface</p>
          </div>
        </div>
        <QuizCreate2 onSubmit={handleCreateQuiz} />
      </div>
    );
  }

  if (view === 'take' && currentQuiz) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{currentQuiz.title}</h2>
            <p className="text-muted-foreground">{currentQuiz.description}</p>
          </div>
          <Button variant="outline" onClick={resetView} size="sm">
            Exit
          </Button>
        </div>
        <QuizTake2 quiz={currentQuiz} onComplete={handleQuizComplete} />
      </div>
    );
  }

  if (view === 'results' && currentQuiz && quizResult) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={resetView} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Overview
        </Button>
        <QuizResults2 quiz={currentQuiz} result={quizResult} attempts={mockQuiz2Attempts} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="shadow-md border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Trophy className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">Quiz 2 - Alternative Design</CardTitle>
              <CardDescription className="mt-2">
                Experience a different approach with wizard-style creation, sidebar navigation, and enhanced visualizations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Features Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Design Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                <span>Wizard-style creation with step-by-step tabs</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                <span>Sidebar navigation showing all questions</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                <span>Circular progress visualization in results</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                <span>Switch toggles instead of checkboxes for settings</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                <span>Compact question list with status indicators</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Key Differences</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                <span>All questions visible in sidebar during quiz</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                <span>Grade system (A-F) in results display</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                <span>Enhanced stats grid with colored cards</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                <span>Radio button style for single-select options</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                <span>More compact, space-efficient layout</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Action Tabs */}
      <Tabs defaultValue="demo">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="demo" className="gap-2">
            <Play className="h-4 w-4" />
            Try Demo
          </TabsTrigger>
          <TabsTrigger value="create" className="gap-2">
            <FileEdit className="h-4 w-4" />
            Create Quiz
          </TabsTrigger>
        </TabsList>

        <TabsContent value="demo" className="space-y-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl">{mockQuiz2.title}</CardTitle>
                  <CardDescription className="mt-2">{mockQuiz2.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-sm">
                  <ListChecks className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{mockQuiz2.questions.length}</span>
                  <span className="text-muted-foreground">Questions</span>
                </div>

                {mockQuiz2.settings.hasTimer && mockQuiz2.settings.timerMinutes && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-sm">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{mockQuiz2.settings.timerMinutes}</span>
                    <span className="text-muted-foreground">Minutes</span>
                  </div>
                )}

                {mockQuiz2.settings.showCorrectAnswers && (
                  <Badge variant="secondary" className="gap-2">
                    <Eye className="h-3 w-3" />
                    Answer Review
                  </Badge>
                )}

                <Badge variant="outline" className="capitalize">
                  {mockQuiz2.settings.visibility}
                </Badge>
              </div>

              <Button onClick={() => handleStartQuiz(mockQuiz2)} className="w-full gap-2" size="lg">
                <Play className="h-4 w-4" />
                Start TypeScript Quiz
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card className="shadow-sm">
            <CardContent className="py-12 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <FileEdit className="h-8 w-8 text-blue-500" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-2">Create Custom Quiz</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Use the step-by-step wizard to build your quiz with custom questions and settings
                </p>
              </div>
              <Button onClick={() => setView('create')} className="gap-2">
                <FileEdit className="h-4 w-4" />
                Open Quiz Creator
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
