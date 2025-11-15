/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
// Modernized quiz creation interface with card-based design system

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { QuizFormData, quizSchema } from "../types/quiz";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trash2,
  Settings2,
  ListChecks,
  Check,
  ChevronUp,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { useEffect } from "react";

type Props = {
  onFormValuesChange: (data: QuizFormData) => void;
  onFormValidChange: (valid: boolean) => void;
  defaultQuizFormValues?: QuizFormData | null;
};

export default function QuizForm({
  onFormValuesChange,
  onFormValidChange,
  defaultQuizFormValues,
}: Props) {
  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: defaultQuizFormValues || {
      title: "",
      description: "",
      settings: {
        anonymous: false,
        allowPause: false,
        oneAttemptPerUser: false,
        showCorrectAnswers: false,
        hasTimer: false,
        timerMinutes: null,
        visibility: "owner",
      },
      questions: [],
    },
  });

  const {
    control,
    watch,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (defaultQuizFormValues) {
      reset(defaultQuizFormValues);
      form.trigger();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultQuizFormValues, reset]);

  const questionsField = useFieldArray({ control, name: "questions" });
  const hasTimer = watch("settings.hasTimer");
  const visibility = watch("settings.visibility");

  const moveQuestionUp = (index: number) => {
    if (index === 0) return;
    questionsField.swap(index, index - 1);
  };

  const moveQuestionDown = (index: number) => {
    if (index === questionsField.fields.length - 1) return;
    questionsField.swap(index, index + 1);
  };

  useEffect(() => {
    const subscription = form.watch((values) => {
      onFormValuesChange(values as QuizFormData);
      onFormValidChange(form.formState.isValid);
    });
    return () => subscription.unsubscribe();
  }, [form, onFormValuesChange, onFormValidChange]);

  return (
    <div className="space-y-4">
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="p-4">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">Настройки теста</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                ПАРАМЕТРЫ ПРОХОЖДЕНИЯ
              </h4>
              <Controller
                control={control}
                name="settings.allowPause"
                render={({ field }) => (
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div>
                      <Label
                        htmlFor="allowPause"
                        className="font-medium cursor-pointer"
                      >
                        Тест на паузе
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Пользователи не могу проходить тест
                      </p>
                    </div>
                    <Switch
                      id="allowPause"
                      disabled={field.disabled}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="settings.oneAttemptPerUser"
                render={({ field }) => (
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div>
                      <Label
                        htmlFor="oneAttempt"
                        className="font-medium cursor-pointer"
                      >
                        Одна попытка
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Каждый человек может пройти тест только один раз
                      </p>
                    </div>
                    <Switch
                      id="oneAttempt"
                      disabled={field.disabled}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="settings.showCorrectAnswers"
                render={({ field }) => (
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div>
                      <Label
                        htmlFor="showAnswers"
                        className="font-medium cursor-pointer"
                      >
                        Показывать правильные ответы
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        После завершения будут показаны верные ответы на все вопросы
                      </p>
                    </div>
                    <Switch
                      id="showAnswers"
                      disabled={field.disabled}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                ВРЕМЯ И ВИДИМОСТЬ
              </h4>

              <div className="space-y-3 p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="hasTimer"
                    className="font-medium cursor-pointer"
                  >
                    Ограничение по времени
                  </Label>
                  <Controller
                    control={control}
                    name="settings.hasTimer"
                    render={({ field }) => (
                      <Switch
                        id="hasTimer"
                        disabled={field.disabled}
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (!checked) {
                            form.setValue("settings.timerMinutes", null);
                          }
                        }}
                      />
                    )}
                  />
                </div>
                {hasTimer && (
                  <div>
                    <Controller
                      control={control}
                      name="settings.timerMinutes"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="timerMinutes"
                          type="number"
                          min="1"
                          placeholder="Введите количество минут"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val ? parseInt(val, 10) : null);
                          }}
                        />
                      )}
                    />
                    {errors.settings?.timerMinutes && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.settings.timerMinutes.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3 p-3 rounded-lg border bg-card">
                <Label className="font-medium">Видимость результатов</Label>
                <Controller
                  control={control}
                  name="settings.visibility"
                  render={({ field }) => (
                    <div className="space-y-2">
                      {[
                        {
                          value: "owner",
                          label: "Только владелец",
                          desc: "Результаты видны только вам",
                        },
                        {
                          value: "partners",
                          label: "Владелец и партнёры",
                          desc: "Результаты доступны вам и партнёрам",
                        },
                        {
                          value: "public",
                          label: "Все пользователи",
                          desc: "Результаты публично доступны всем",
                        },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          disabled={field.disabled}
                          className={`w-full flex items-center justify-between p-2 rounded border transition-all ${
                            visibility === option.value
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                              : "border-border hover:border-accent-foreground/20"
                          }`}
                        >
                          <div className="text-left">
                            <div className="font-medium text-sm">
                              {option.label}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {option.desc}
                            </div>
                          </div>
                          {visibility === option.value && (
                            <Check className="h-4 w-4 text-blue-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Вопросы теста</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Добавьте минимум один вопрос с вариантами ответов
              </p>
            </div>
            <Button
              type="button"
              onClick={() =>
                questionsField.append({
                  text: "",
                  explanation: "",
                  answers: [],
                })
              }
              size="sm"
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Добавить
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          {questionsField.fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
              <ListChecks className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                Вопросы ещё не добавлены
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  questionsField.append({
                    text: "",
                    explanation: "",
                    answers: [],
                  })
                }
                className="gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Добавить первый вопрос
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {questionsField.fields.map((q, index) => (
                <div
                  key={q.id}
                  className="p-3 rounded-lg border bg-card space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      Вопрос {index + 1}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        type="button"
                        onClick={() => moveQuestionUp(index)}
                        disabled={index === 0}
                        className="h-6 w-6 p-0"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        type="button"
                        onClick={() => moveQuestionDown(index)}
                        disabled={index === questionsField.fields.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Удалить</AlertDialogTitle>
                            <AlertDialogDescription>
                              Вы уверены, что хотите удалить?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => questionsField.remove(index)}
                            >
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <Controller
                    control={control}
                    name={`questions.${index}.text`}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Введите текст вопроса"
                        className="text-sm"
                      />
                    )}
                  />

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">
                      Варианты ответов
                    </Label>
                    <AnswersField control={control} qIndex={index} />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      <Label className="text-xs font-medium">
                        Пояснение к ответу (по желанию)
                      </Label>
                    </div>
                    <Controller
                      control={control}
                      name={`questions.${index}.explanation`}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          placeholder="Объясните, почему этот ответ правильный..."
                          rows={2}
                          className="resize-none text-sm"
                        />
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AnswersField({ control, qIndex }: { control: any; qIndex: number }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${qIndex}.answers`,
  });

  return (
    <div className="space-y-3">
      {fields.map((field, aIndex) => (
        <div key={field.id} className="flex items-center gap-3">
          <Controller
            control={control}
            name={`questions.${qIndex}.answers.${aIndex}.correct`}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={field.disabled}
                className="mt-2 flex-shrink-0"
              />
            )}
          />
          <Controller
            control={control}
            name={`questions.${qIndex}.answers.${aIndex}.text`}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={`Вариант ${aIndex + 1}`}
                className="flex-1"
              />
            )}
          />
          {fields.length > 2 && (
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => remove(aIndex)}
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ text: "", correct: false })}
        className="w-full gap-2 mt-2"
      >
        <Plus className="h-4 w-4" />
        Добавить вариант ответа
      </Button>
    </div>
  );
}
