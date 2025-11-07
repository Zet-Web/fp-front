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
import { QuizFormData, quizSchema } from "../types/quiz";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, FileText, Settings2, ListChecks, GripVertical, Check } from "lucide-react";

type Props = {
  onSubmit: (data: QuizFormData) => void;
  isQuizFormDisabled?: boolean;
};

export default function QuizForm({ onSubmit, isQuizFormDisabled }: Props) {
  const form = useForm<QuizFormData>({
    disabled: Boolean(isQuizFormDisabled),
    resolver: zodResolver(quizSchema),
    defaultValues: {
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
    handleSubmit,
    watch,
    formState: { isValid, errors },
  } = form;

  const questionsField = useFieldArray({ control, name: "questions" });
  const hasTimer = watch("settings.hasTimer");
  const visibility = watch("settings.visibility");

  const onFormSubmit = handleSubmit(onSubmit);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <CardTitle>Основная информация</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Название теста *</Label>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <Input
                  {...field}
                  id="title"
                  placeholder="Введите название теста"
                  className="mt-1.5"
                />
              )}
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Описание (необязательно)</Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="description"
                  placeholder="Добавьте описание теста"
                  className="mt-1.5"
                  rows={3}
                />
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-blue-500" />
            <CardTitle>Настройки теста</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                ПАРАМЕТРЫ ПРОХОЖДЕНИЯ
              </h4>

              <Controller
                control={control}
                name="settings.anonymous"
                render={({ field }) => (
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div>
                      <Label htmlFor="anonymous" className="font-medium cursor-pointer">
                        Анонимное прохождение
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Тест могут проходить неавторизованные пользователи
                      </p>
                    </div>
                    <Switch
                      id="anonymous"
                      disabled={field.disabled}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="settings.allowPause"
                render={({ field }) => (
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div>
                      <Label htmlFor="allowPause" className="font-medium cursor-pointer">
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
                      <Label htmlFor="oneAttempt" className="font-medium cursor-pointer">
                        Одна попытка на пользователя
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Каждый может пройти тест только один раз
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
                      <Label htmlFor="showAnswers" className="font-medium cursor-pointer">
                        Показывать правильные ответы
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        После завершения будут показаны верные ответы
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
                  <Label htmlFor="hasTimer" className="font-medium cursor-pointer">
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
                        { value: 'owner', label: 'Только владелец', desc: 'Результаты видны только вам' },
                        { value: 'partners', label: 'Владелец и партнёры', desc: 'Результаты доступны вам и партнёрам' },
                        { value: 'public', label: 'Все пользователи', desc: 'Результаты публично доступны всем' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          disabled={field.disabled}
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
                  )}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Вопросы теста</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Добавьте минимум один вопрос с вариантами ответов
            </p>
          </div>
          <Button
            type="button"
            disabled={isQuizFormDisabled}
            onClick={() => questionsField.append({ text: "", answers: [] })}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Добавить вопрос
          </Button>
        </div>

        {questionsField.fields.length === 0 ? (
          <Card className="shadow-sm border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ListChecks className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Вопросы ещё не добавлены
              </p>
              <Button
                type="button"
                variant="outline"
                disabled={isQuizFormDisabled}
                onClick={() =>
                  questionsField.append({ text: "", answers: [] })
                }
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Добавить первый вопрос
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {questionsField.fields.map((q, index) => (
              <Card key={q.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground mt-3 cursor-move flex-shrink-0" />
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">Вопрос {index + 1}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          disabled={isQuizFormDisabled}
                          onClick={() => questionsField.remove(index)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <Controller
                        control={control}
                        name={`questions.${index}.text`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Введите текст вопроса"
                            className="text-base"
                          />
                        )}
                      />

                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">Варианты ответов</Label>
                        <AnswersField
                          control={control}
                          qIndex={index}
                          isQuizFormDisabled={isQuizFormDisabled}
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
          onClick={onFormSubmit}
          disabled={!isValid || isQuizFormDisabled}
          size="lg"
          className="min-w-[200px]"
        >
          {isQuizFormDisabled ? "Сохранение..." : "Сохранить тест"}
        </Button>
      </div>
    </div>
  );
}

function AnswersField({
  control,
  qIndex,
  isQuizFormDisabled,
}: {
  control: any;
  qIndex: number;
  isQuizFormDisabled?: boolean;
}) {
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
              disabled={isQuizFormDisabled}
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
        disabled={isQuizFormDisabled}
        className="w-full gap-2 mt-2"
      >
        <Plus className="h-4 w-4" />
        Добавить вариант ответа
      </Button>
    </div>
  );
}
