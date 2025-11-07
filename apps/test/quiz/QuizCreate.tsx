// Modernized quiz creation interface with card-based design system

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, FileText, Settings2, ListChecks, GripVertical, HelpCircle, Check } from 'lucide-react';
import { Quiz, QuizQuestion } from './quiz-types';

interface QuizCreateProps {
  onSubmit: (quiz: Quiz) => void;
}

export function QuizCreate({ onSubmit }: QuizCreateProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [allowPause, setAllowPause] = useState(false);
  const [oneAttempt, setOneAttempt] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [hasTimer, setHasTimer] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [visibility, setVisibility] = useState<'owner' | 'partners' | 'public'>('owner');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
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
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, text } : q))
    );
  };

  const addAnswer = (questionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: [
              ...q.answers,
              { id: `a${Date.now()}`, text: '', correct: false },
            ],
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
          return {
            ...q,
            answers: q.answers.filter((a) => a.id !== answerId),
          };
        }
        return q;
      })
    );
  };

  const updateAnswer = (
    questionId: string,
    answerId: string,
    text: string
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.map((a) =>
              a.id === answerId ? { ...a, text } : a
            ),
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
            answers: q.answers.map((a) =>
              a.id === answerId ? { ...a, correct: !a.correct } : a
            ),
          };
        }
        return q;
      })
    );
  };

  const handleSubmit = () => {
    const quiz: Quiz = {
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

  const isValid = title.trim() && questions.length > 0 && questions.every(
    (q) => q.text.trim() && q.answers.length >= 2 && q.answers.every((a) => a.text.trim())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <CardTitle>Basic Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              placeholder="Enter quiz title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add a description for your quiz"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-blue-500" />
            <CardTitle>Quiz Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">ACCESS & ATTEMPTS</h4>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div>
                  <Label htmlFor="anon" className="font-medium cursor-pointer">
                    Anonymous Access
                  </Label>
                  <p className="text-xs text-muted-foreground">Allow guests</p>
                </div>
                <Switch id="anon" checked={anonymous} onCheckedChange={setAnonymous} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div>
                  <Label htmlFor="pause" className="font-medium cursor-pointer">
                    Pause Quiz
                  </Label>
                  <p className="text-xs text-muted-foreground">Disable temporarily</p>
                </div>
                <Switch id="pause" checked={allowPause} onCheckedChange={setAllowPause} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div>
                  <Label htmlFor="attempt" className="font-medium cursor-pointer">
                    One Attempt
                  </Label>
                  <p className="text-xs text-muted-foreground">Single try per user</p>
                </div>
                <Switch id="attempt" checked={oneAttempt} onCheckedChange={setOneAttempt} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div>
                  <Label htmlFor="showAns" className="font-medium cursor-pointer">
                    Show Answers
                  </Label>
                  <p className="text-xs text-muted-foreground">Display after completion</p>
                </div>
                <Switch id="showAns" checked={showAnswers} onCheckedChange={setShowAnswers} />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">TIME & VISIBILITY</h4>

              <div className="space-y-3 p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-between">
                  <Label htmlFor="timer" className="font-medium cursor-pointer">
                    Time Limit
                  </Label>
                  <Switch
                    id="timer"
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
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Questions</h3>
            <p className="text-sm text-muted-foreground mt-1">Add questions with multiple choice answers</p>
          </div>
          <Button onClick={addQuestion} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </div>

        {questions.length === 0 ? (
          <Card className="shadow-sm border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ListChecks className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No questions yet</p>
              <Button onClick={addQuestion} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Add First Question
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((question, qIndex) => (
              <Card key={question.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground mt-3 cursor-move flex-shrink-0" />
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">Question {qIndex + 1}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(question.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <Input
                        placeholder="Enter question text"
                        value={question.text}
                        onChange={(e) => updateQuestion(question.id, e.target.value)}
                        className="text-base"
                      />

                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">Answers</Label>
                        {question.answers.map((answer, aIndex) => (
                          <div key={answer.id} className="flex items-center gap-3">
                            <Checkbox
                              checked={answer.correct}
                              onCheckedChange={() => toggleCorrect(question.id, answer.id)}
                              className="mt-2 flex-shrink-0"
                            />
                            <Input
                              placeholder={`Answer ${aIndex + 1}`}
                              value={answer.text}
                              onChange={(e) => updateAnswer(question.id, answer.id, e.target.value)}
                              className="flex-1"
                            />
                            {question.answers.length > 2 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAnswer(question.id, answer.id)}
                                className="shrink-0"
                              >
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addAnswer(question.id)}
                          className="w-full gap-2 mt-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Answer
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm font-medium">Explanation (Optional)</Label>
                        </div>
                        <Textarea
                          placeholder="Explain why this answer is correct..."
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          size="lg"
          className="min-w-[200px]"
        >
          Create Quiz
        </Button>
      </div>
    </div>
  );
}
