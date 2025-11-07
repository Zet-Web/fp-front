// Alternative quiz creation with compact, step-by-step wizard approach

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Check, Settings, ListOrdered, Info } from 'lucide-react';
import { Quiz2, Quiz2Question } from './quiz2-types';

interface QuizCreate2Props {
  onSubmit: (quiz: Quiz2) => void;
}

export function QuizCreate2({ onSubmit }: QuizCreate2Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [allowPause, setAllowPause] = useState(false);
  const [oneAttempt, setOneAttempt] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [hasTimer, setHasTimer] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [visibility, setVisibility] = useState<'owner' | 'partners' | 'public'>('owner');
  const [questions, setQuestions] = useState<Quiz2Question[]>([]);
  const [activeTab, setActiveTab] = useState('info');

  const addQuestion = () => {
    const newQuestion: Quiz2Question = {
      id: `q${Date.now()}`,
      text: '',
      answers: [
        { id: `a${Date.now()}_1`, text: '', correct: false },
        { id: `a${Date.now()}_2`, text: '', correct: false },
      ],
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const updateQuestion = (questionId: string, text: string) => {
    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, text } : q)));
  };

  const addAnswer = (questionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: [...q.answers, { id: `a${Date.now()}`, text: '', correct: false }],
          };
        }
        return q;
      })
    );
  };

  const removeAnswer = (questionId: string, answerId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return { ...q, answers: q.answers.filter((a) => a.id !== answerId) };
        }
        return q;
      })
    );
  };

  const updateAnswer = (questionId: string, answerId: string, text: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.map((a) => (a.id === answerId ? { ...a, text } : a)),
          };
        }
        return q;
      })
    );
  };

  const toggleCorrect = (questionId: string, answerId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.map((a) => (a.id === answerId ? { ...a, correct: !a.correct } : a)),
          };
        }
        return q;
      })
    );
  };

  const handleSubmit = () => {
    const quiz: Quiz2 = {
      id: `quiz_${Date.now()}`,
      title,
      description,
      settings: {
        anonymous,
        allowPause,
        oneAttemptPerUser: oneAttempt,
        showCorrectAnswers: showAnswers,
        hasTimer,
        timerMinutes,
        visibility,
      },
      questions,
    };
    onSubmit(quiz);
  };

  const isValid =
    title.trim() &&
    questions.length > 0 &&
    questions.every((q) => q.text.trim() && q.answers.length >= 2 && q.answers.every((a) => a.text.trim()));

  const canProceedToSettings = title.trim() && description.trim();
  const canProceedToQuestions = canProceedToSettings;

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-accent/30">
          <CardTitle className="text-2xl">Create Quiz - Wizard Mode</CardTitle>
          <CardDescription>Follow the steps to build your quiz</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b bg-muted/30">
              <TabsList className="w-full justify-start h-auto p-0 bg-transparent rounded-none">
                <TabsTrigger value="info" className="gap-2 rounded-none data-[state=active]:bg-background">
                  <Info className="h-4 w-4" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  disabled={!canProceedToSettings}
                  className="gap-2 rounded-none data-[state=active]:bg-background"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
                <TabsTrigger
                  value="questions"
                  disabled={!canProceedToQuestions}
                  className="gap-2 rounded-none data-[state=active]:bg-background"
                >
                  <ListOrdered className="h-4 w-4" />
                  Questions
                  {questions.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {questions.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="info" className="mt-0 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title2" className="text-base font-semibold">
                      Quiz Title
                    </Label>
                    <Input
                      id="title2"
                      placeholder="e.g., JavaScript Fundamentals"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description2" className="text-base font-semibold">
                      Description
                    </Label>
                    <Textarea
                      id="description2"
                      placeholder="Describe what this quiz covers..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => setActiveTab('settings')} disabled={!canProceedToSettings}>
                    Next: Settings
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-0 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Access Control</h3>

                    <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <div>
                        <Label htmlFor="anon2" className="font-medium cursor-pointer">
                          Anonymous Access
                        </Label>
                        <p className="text-xs text-muted-foreground">Allow guests</p>
                      </div>
                      <Switch id="anon2" checked={anonymous} onCheckedChange={setAnonymous} />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <div>
                        <Label htmlFor="pause2" className="font-medium cursor-pointer">
                          Pause Quiz
                        </Label>
                        <p className="text-xs text-muted-foreground">Disable temporarily</p>
                      </div>
                      <Switch id="pause2" checked={allowPause} onCheckedChange={setAllowPause} />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <div>
                        <Label htmlFor="attempt2" className="font-medium cursor-pointer">
                          One Attempt
                        </Label>
                        <p className="text-xs text-muted-foreground">Single try per user</p>
                      </div>
                      <Switch id="attempt2" checked={oneAttempt} onCheckedChange={setOneAttempt} />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <div>
                        <Label htmlFor="showAns2" className="font-medium cursor-pointer">
                          Show Answers
                        </Label>
                        <p className="text-xs text-muted-foreground">Display after completion</p>
                      </div>
                      <Switch id="showAns2" checked={showAnswers} onCheckedChange={setShowAnswers} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Time & Visibility</h3>

                    <div className="space-y-3 p-3 rounded-lg border bg-card">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="timer2" className="font-medium cursor-pointer">
                          Time Limit
                        </Label>
                        <Switch
                          id="timer2"
                          checked={hasTimer}
                          onCheckedChange={(checked) => {
                            setHasTimer(checked);
                            if (!checked) setTimerMinutes(null);
                          }}
                        />
                      </div>
                      {hasTimer && (
                        <Input
                          type="number"
                          min="1"
                          placeholder="Minutes"
                          value={timerMinutes ?? ''}
                          onChange={(e) => setTimerMinutes(e.target.value ? parseInt(e.target.value) : null)}
                        />
                      )}
                    </div>

                    <div className="space-y-3 p-3 rounded-lg border bg-card">
                      <Label className="font-medium">Results Visibility</Label>
                      <div className="space-y-2">
                        {[
                          { value: 'owner', label: 'Owner Only', desc: 'Private' },
                          { value: 'partners', label: 'Partners', desc: 'Limited' },
                          { value: 'public', label: 'Public', desc: 'Everyone' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setVisibility(option.value as any)}
                            className={`w-full flex items-center justify-between p-2 rounded border transition-all ${
                              visibility === option.value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                                : 'border-border hover:border-accent-foreground/20'
                            }`}
                          >
                            <div className="text-left">
                              <div className="font-medium text-sm">{option.label}</div>
                              <div className="text-xs text-muted-foreground">{option.desc}</div>
                            </div>
                            {visibility === option.value && <Check className="h-4 w-4 text-blue-500" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => setActiveTab('info')}>
                    Back
                  </Button>
                  <Button onClick={() => setActiveTab('questions')}>Next: Questions</Button>
                </div>
              </TabsContent>

              <TabsContent value="questions" className="mt-0 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Quiz Questions</h3>
                    <p className="text-sm text-muted-foreground">Add at least one question</p>
                  </div>
                  <Button onClick={addQuestion} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>

                {questions.length === 0 ? (
                  <div className="border-2 border-dashed rounded-lg p-12 text-center">
                    <ListOrdered className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">No questions added yet</p>
                    <Button onClick={addQuestion} variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create First Question
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {questions.map((question, qIndex) => (
                      <div key={question.id} className="border rounded-lg p-4 bg-card space-y-3">
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="mt-1">
                            Q{qIndex + 1}
                          </Badge>
                          <Input
                            placeholder="Question text"
                            value={question.text}
                            onChange={(e) => updateQuestion(question.id, e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(question.id)}
                            className="text-destructive shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="ml-8 space-y-2">
                          {question.answers.map((answer, aIndex) => (
                            <div key={answer.id} className="flex items-center gap-2">
                              <Checkbox
                                checked={answer.correct}
                                onCheckedChange={() => toggleCorrect(question.id, answer.id)}
                              />
                              <Input
                                placeholder={`Option ${aIndex + 1}`}
                                value={answer.text}
                                onChange={(e) => updateAnswer(question.id, answer.id, e.target.value)}
                                className="flex-1"
                              />
                              {question.answers.length > 2 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeAnswer(question.id, answer.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addAnswer(question.id)}
                            className="w-full mt-2"
                          >
                            + Add Option
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => setActiveTab('settings')}>
                    Back
                  </Button>
                  <Button onClick={handleSubmit} disabled={!isValid} className="gap-2">
                    <Check className="h-4 w-4" />
                    Create Quiz
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
