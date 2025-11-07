// Modernized quiz creation interface with card-based design system

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, FileText, Settings2, ListChecks } from 'lucide-react';
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
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  ACCESS & ATTEMPTS
                </h4>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="anonymous"
                    checked={anonymous}
                    onCheckedChange={(checked) => setAnonymous(checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="anonymous" className="font-normal cursor-pointer">
                      Anonymous Access
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Allow unauthenticated users to take the quiz
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="allowPause"
                    checked={allowPause}
                    onCheckedChange={(checked) => setAllowPause(checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="allowPause" className="font-normal cursor-pointer">
                      Pause Quiz
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Temporarily disable quiz access
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="oneAttempt"
                    checked={oneAttempt}
                    onCheckedChange={(checked) => setOneAttempt(checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="oneAttempt" className="font-normal cursor-pointer">
                      One Attempt Per User
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Each user can only take the quiz once
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="showAnswers"
                    checked={showAnswers}
                    onCheckedChange={(checked) => setShowAnswers(checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="showAnswers" className="font-normal cursor-pointer">
                      Show Correct Answers
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Display correct answers after completion
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="hasTimer"
                    checked={hasTimer}
                    onCheckedChange={(checked) => {
                      setHasTimer(checked as boolean);
                      if (!checked) setTimerMinutes(null);
                    }}
                  />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="hasTimer" className="font-normal cursor-pointer">
                      Time Limit
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Set a timer for quiz completion
                    </p>
                  </div>
                </div>

                {hasTimer && (
                  <div className="ml-8">
                    <Label htmlFor="timerMinutes" className="text-sm">
                      Minutes
                    </Label>
                    <Input
                      id="timerMinutes"
                      type="number"
                      min="1"
                      placeholder="Enter minutes"
                      value={timerMinutes ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTimerMinutes(val ? parseInt(val, 10) : null);
                      }}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                RESULTS VISIBILITY
              </h4>

              <RadioGroup value={visibility} onValueChange={(value) => setVisibility(value as any)}>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="owner" id="owner" />
                  <div className="space-y-1">
                    <Label htmlFor="owner" className="font-normal cursor-pointer">
                      Owner Only
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Results visible only to you
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="partners" id="partners" />
                  <div className="space-y-1">
                    <Label htmlFor="partners" className="font-normal cursor-pointer">
                      Owner & Partners
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Results available to you and partners
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="public" id="public" />
                  <div className="space-y-1">
                    <Label htmlFor="public" className="font-normal cursor-pointer">
                      Public
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Results publicly accessible to all
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-blue-500" />
              <h3 className="text-xl font-semibold">Quiz Questions</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Add questions with multiple choice answers
            </p>
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
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Question {qIndex + 1}</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Question Text</Label>
                    <Input
                      placeholder="Enter your question"
                      value={question.text}
                      onChange={(e) => updateQuestion(question.id, e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Answer Options (check correct answers)</Label>
                    {question.answers.map((answer, aIndex) => (
                      <div key={answer.id} className="flex items-center gap-2">
                        <Input
                          placeholder={`Option ${aIndex + 1}`}
                          value={answer.text}
                          onChange={(e) =>
                            updateAnswer(question.id, answer.id, e.target.value)
                          }
                          className="flex-1"
                        />
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`correct-${answer.id}`}
                            checked={answer.correct}
                            onCheckedChange={() =>
                              toggleCorrect(question.id, answer.id)
                            }
                          />
                          <Label
                            htmlFor={`correct-${answer.id}`}
                            className="text-sm text-muted-foreground cursor-pointer whitespace-nowrap"
                          >
                            Correct
                          </Label>
                        </div>
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
                      className="w-full gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Answer Option
                    </Button>
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
