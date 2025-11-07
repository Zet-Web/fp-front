/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { useForm, useFieldArray, Controller } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QuizFormData, quizSchema } from "../types/quiz";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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

  const onFormSubmit = handleSubmit(onSubmit);

  return (
    <div className="max-w-4xl mx-auto pt-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Создать тест</h2>
        <p className="text-muted-foreground mt-1">
          Заполните информацию о тесте и добавьте вопросы
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
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

        <Card>
          <CardHeader>
            <CardTitle>Настройки теста</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">
                  ПАРАМЕТРЫ ПРОХОЖДЕНИЯ
                </h4>

                <Controller
                  control={control}
                  name="settings.anonymous"
                  render={({ field }) => (
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="anonymous"
                        disabled={field.disabled}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5"
                      />
                      <div className="grid gap-1.5">
                        <Label
                          htmlFor="anonymous"
                          className="font-normal cursor-pointer"
                        >
                          Анонимное прохождение
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Тест могут проходить неавторизованные пользователи
                        </p>
                      </div>
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name="settings.allowPause"
                  render={({ field }) => (
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="allowPause"
                        disabled={field.disabled}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5"
                      />
                      <div className="grid gap-1.5">
                        <Label
                          htmlFor="allowPause"
                          className="font-normal cursor-pointer"
                        >
                          Тест на паузе
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Пользователи не могу проходить тест
                        </p>
                      </div>
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name="settings.oneAttemptPerUser"
                  render={({ field }) => (
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="oneAttempt"
                        disabled={field.disabled}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5"
                      />
                      <div className="grid gap-1.5">
                        <Label
                          htmlFor="oneAttempt"
                          className="font-normal cursor-pointer"
                        >
                          Одна попытка на пользователя
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Каждый может пройти тест только один раз
                        </p>
                      </div>
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name="settings.showCorrectAnswers"
                  render={({ field }) => (
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="showAnswers"
                        disabled={field.disabled}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5"
                      />
                      <div className="grid gap-1.5">
                        <Label
                          htmlFor="showAnswers"
                          className="font-normal cursor-pointer"
                        >
                          Показывать правильные ответы
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          После завершения будут показаны верные ответы
                        </p>
                      </div>
                    </div>
                  )}
                />

                <Separator />

                <Controller
                  control={control}
                  name="settings.hasTimer"
                  render={({ field }) => (
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="hasTimer"
                        disabled={field.disabled}
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (!checked) {
                            form.setValue("settings.timerMinutes", null);
                          }
                        }}
                        className="mt-0.5"
                      />
                      <div className="grid gap-1.5 flex-1">
                        <Label
                          htmlFor="hasTimer"
                          className="font-normal cursor-pointer"
                        >
                          Ограничение по времени
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Установить таймер для прохождения теста
                        </p>
                      </div>
                    </div>
                  )}
                />

                {hasTimer && (
                  <div className="ml-8 mt-2">
                    <Label htmlFor="timerMinutes" className="text-sm">
                      Количество минут *
                    </Label>
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
                          className="mt-1.5"
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

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">
                  ВИДИМОСТЬ РЕЗУЛЬТАТОВ
                </h4>

                <Controller
                  control={control}
                  name="settings.visibility"
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={field.disabled}
                      className="space-y-3"
                    >
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem
                          value="owner"
                          id="owner"
                          className="mt-0.5"
                        />
                        <div className="grid gap-1.5">
                          <Label
                            htmlFor="owner"
                            className="font-normal cursor-pointer"
                          >
                            Только владелец
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Результаты видны только вам
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <RadioGroupItem
                          value="partners"
                          id="partners"
                          className="mt-0.5"
                        />
                        <div className="grid gap-1.5">
                          <Label
                            htmlFor="partners"
                            className="font-normal cursor-pointer"
                          >
                            Владелец и партнёры
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Результаты доступны вам и партнёрам
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <RadioGroupItem
                          value="public"
                          id="public"
                          className="mt-0.5"
                        />
                        <div className="grid gap-1.5">
                          <Label
                            htmlFor="public"
                            className="font-normal cursor-pointer"
                          >
                            Все пользователи
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Результаты публично доступны всем
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  )}
                />
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
              variant="outline"
              disabled={isQuizFormDisabled}
              onClick={() => questionsField.append({ text: "", answers: [] })}
            >
              + Добавить вопрос
            </Button>
          </div>

          {questionsField.fields.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
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
                >
                  Добавить первый вопрос
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {questionsField.fields.map((q, index) => (
                <Card key={q.id}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Вопрос {index + 1}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        disabled={isQuizFormDisabled}
                        onClick={() => questionsField.remove(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        Удалить
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Текст вопроса *</Label>
                      <Controller
                        control={control}
                        name={`questions.${index}.text`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Введите текст вопроса"
                            className="mt-1.5"
                          />
                        )}
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">
                        Варианты ответов (минимум 2)
                      </Label>
                      <AnswersField
                        control={control}
                        qIndex={index}
                        isQuizFormDisabled={isQuizFormDisabled}
                      />
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
        <div key={field.id} className="flex items-center gap-2">
          <div className="flex-1">
            <Controller
              control={control}
              name={`questions.${qIndex}.answers.${aIndex}.text`}
              render={({ field }) => (
                <Input {...field} placeholder={`Вариант ${aIndex + 1}`} />
              )}
            />
          </div>

          <Controller
            control={control}
            name={`questions.${qIndex}.answers.${aIndex}.correct`}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`correct-${qIndex}-${aIndex}`}
                  disabled={field.disabled}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label
                  htmlFor={`correct-${qIndex}-${aIndex}`}
                  className="text-sm text-muted-foreground cursor-pointer whitespace-nowrap"
                >
                  Верный
                </Label>
              </div>
            )}
          />

          <Button
            disabled={isQuizFormDisabled}
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => remove(aIndex)}
            className="shrink-0"
          >
            ✕
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ text: "", correct: false })}
        disabled={isQuizFormDisabled}
        className="w-full"
      >
        + Добавить вариант ответа
      </Button>
    </div>
  );
}
