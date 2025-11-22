// Demo tab showcasing date selection components and education section testing
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DaySelector } from "@/components/shared/DaySelector";
import { MonthSelector } from "@/components/shared/MonthSelector";
import { YearSelector } from "@/components/shared/YearSelector";
import { DateSelector, DateValue } from "@/components/shared/DateSelector";
import { PeriodSelector, PeriodData } from "@/components/shared/PeriodSelector";
import { formatPeriod, getMonthLabel, calculateAge } from "@/lib/date-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GraduationCap, Edit, Trash2 } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { SortableListControls } from "@/components/shared/SortableListControls";
import { InlineEditActions } from "@/components/shared/InlineEditActions";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { DatabaseDropdown } from "@/components/shared/DatabaseDropdown";
import { UniversalReferenceSelector } from "@/components/shared/UniversalReferenceSelector";
import { CharacterCounter } from "@/components/shared/CharacterCounter";

interface ProfileEducation {
  id: number;
  degree: Option | null;
  degree_id: number;
  university: Option | null;
  university_id: number;
  period: string;
  start_month?: string;
  start_year?: string;
  end_month?: string;
  end_year?: string;
  is_current?: boolean;
  description: string;
}

type Option = {
  id: number;
  name: string;
};

const defaultEducationValue: Omit<ProfileEducation, "id"> = {
  degree_id: 0,
  degree: null,
  university_id: 0,
  university: null,
  period: "",
  start_month: "not-set",
  start_year: "not-set",
  end_month: "not-set",
  end_year: "not-set",
  is_current: false,
  description: "",
};

export function DateSelectorsDemo() {
  const [day, setDay] = useState<string>("not-set");
  const [month, setMonth] = useState<string>("not-set");
  const [year, setYear] = useState<string>("not-set");

  const [fullDate, setFullDate] = useState<DateValue>({
    day: "15",
    month: "06",
    year: "1990",
  });

  const [period, setPeriod] = useState<PeriodData>({
    start_month: "01",
    start_year: "2020",
    end_month: "12",
    end_year: "2023",
    is_current: false,
  });

  const [currentPeriod, setCurrentPeriod] = useState<PeriodData>({
    start_month: "03",
    start_year: "2024",
    end_month: "not-set",
    end_year: "not-set",
    is_current: true,
  });

  const [education, setEducation] = useState<ProfileEducation[]>([]);
  const [editingEducation, setEditingEducation] = useState<number | null>(null);
  const [showAddEducationForm, setShowAddEducationForm] = useState(false);
  const [newEducation, setNewEducation] = useState(defaultEducationValue);
  const [editForm, setEditForm] = useState(defaultEducationValue);
  const [isEditingEducation, setIsEditingEducation] = useState(false);

  const DESCRIPTION_MAX_LENGTH = 400;

  const formatDateValue = (date: DateValue): string => {
    const parts = [];
    if (date.day !== "not-set") parts.push(date.day);
    if (date.month !== "not-set")
      parts.push(getMonthLabel(date.month) || date.month);
    if (date.year !== "not-set") parts.push(date.year);
    return parts.length > 0 ? parts.join(" ") : "Not set";
  };

  const getAge = (): string | null => {
    if (
      fullDate.day === "not-set" ||
      fullDate.month === "not-set" ||
      fullDate.year === "not-set"
    ) {
      return null;
    }
    const birthDate = `${fullDate.year}-${fullDate.month}-${fullDate.day}`;
    const age = calculateAge(birthDate);
    return age !== null ? `${age} years old` : null;
  };

  const formatPeriodData = (edu: ProfileEducation) => {
    return (
      formatPeriod({
        startMonth: edu.start_month,
        startYear: edu.start_year,
        endMonth: edu.end_month,
        endYear: edu.end_year,
        isCurrent: edu.is_current,
      }) ||
      edu.period ||
      ""
    );
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newEducation = [...education];
    [newEducation[index - 1], newEducation[index]] = [
      newEducation[index],
      newEducation[index - 1],
    ];
    setEducation(newEducation);
  };

  const moveDown = (index: number) => {
    if (index === education.length - 1) return;
    const newEducation = [...education];
    [newEducation[index], newEducation[index + 1]] = [
      newEducation[index + 1],
      newEducation[index],
    ];
    setEducation(newEducation);
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.university) {
      const addedEducation = {
        id: Date.now(),
        ...newEducation,
      };
      const updatedEducations = [...education, addedEducation];
      setEducation(updatedEducations);
      setNewEducation(defaultEducationValue);
      setShowAddEducationForm(false);
    }
  };

  const removeEducation = (id: number) => {
    const newEducations = [...education].filter((edu) => edu.id !== id);
    setEducation(newEducations);
  };

  const startEditing = (edu: ProfileEducation) => {
    setEditingEducation(edu.id);
    setEditForm({
      degree: edu.degree,
      degree_id: edu.degree_id,
      university: edu.university,
      university_id: edu.university_id,
      period: edu.period,
      start_month: edu.start_month,
      start_year: edu.start_year,
      end_month: edu.end_month,
      end_year: edu.end_year,
      is_current: edu.is_current,
      description: edu.description,
    });
  };

  const saveEdit = (id: number) => {
    const originalEducation = education.filter((edu) => edu.id === id)[0];

    const editedEduction = {
      ...originalEducation,
      ...editForm,
    };
    const updatedEducations = [
      ...education.filter((edu) => edu.id !== id),
      editedEduction,
    ];
    setEducation(updatedEducations);

    setEditingEducation(null);
  };

  const cancelEdit = () => {
    setEditingEducation(null);
    setEditForm(defaultEducationValue);
  };

  const handlePeriodChange = (period: PeriodData, isNew: boolean) => {
    if (isNew) {
      setNewEducation((prev) => ({ ...prev, ...period }));
    } else {
      setEditForm((prev) => ({ ...prev, ...period }));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Date Selectors Demo</CardTitle>
          <p className="text-sm text-muted-foreground">
            Test and explore all date selection components
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Individual Selectors</h3>
            <p className="text-sm text-muted-foreground">
              Use these components separately when you need only specific date
              parts
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base">Day Selector</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DaySelector
                    value={day}
                    onChange={setDay}
                    month={month}
                    year={year}
                    label="Select Day"
                  />
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-1">
                      Selected:
                    </p>
                    <Badge variant="secondary">
                      {day === "not-set" ? "Not set" : `Day ${day}`}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base">Month Selector</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <MonthSelector
                    value={month}
                    onChange={setMonth}
                    label="Select Month"
                  />
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-1">
                      Selected:
                    </p>
                    <Badge variant="secondary">
                      {month === "not-set"
                        ? "Not set"
                        : getMonthLabel(month) || month}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base">Year Selector</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <YearSelector
                    value={year}
                    onChange={setYear}
                    label="Select Year"
                  />
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-1">
                      Selected:
                    </p>
                    <Badge variant="secondary">
                      {year === "not-set" ? "Not set" : year}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <p className="text-sm">
                  <span className="font-medium">Combined Display: </span>
                  <Badge className="ml-2">
                    {day === "not-set" && month === "not-set" && year === "not-set"
                      ? "No date selected"
                      : `${day !== "not-set" ? day + " " : ""}${
                          month !== "not-set" ? getMonthLabel(month) + " " : ""
                        }${year !== "not-set" ? year : ""}`}
                  </Badge>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Note: Day selector automatically adjusts available days based
                  on selected month and year (handles leap years and month
                  lengths)
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Combined Date Selector</h3>
            <p className="text-sm text-muted-foreground">
              Use this component when you need a complete date (e.g., birthday,
              event date)
            </p>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base">
                  Full Date Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DateSelector
                  value={fullDate}
                  onChange={setFullDate}
                  label="Birthday"
                  optional={true}
                />
                <div className="pt-2 space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Formatted Date:
                    </p>
                    <Badge variant="secondary" className="text-sm">
                      {formatDateValue(fullDate)}
                    </Badge>
                  </div>
                  {getAge() && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Age:</p>
                      <Badge className="text-sm">{getAge()}</Badge>
                    </div>
                  )}
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground">
                      Value object:{" "}
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {JSON.stringify(fullDate)}
                      </code>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Period Selector</h3>
            <p className="text-sm text-muted-foreground">
              Use this component for date ranges (e.g., work experience,
              education periods)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base">
                    Completed Period
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <PeriodSelector
                    value={period}
                    onChange={setPeriod}
                    currentLabel="Currently ongoing"
                  />
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-1">
                      Formatted Period:
                    </p>
                    <Badge variant="secondary" className="text-sm">
                      {formatPeriod({
                        startMonth: period.start_month,
                        startYear: period.start_year,
                        endMonth: period.end_month,
                        endYear: period.end_year,
                        isCurrent: period.is_current,
                      }) || "Not set"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base">Current Period</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <PeriodSelector
                    value={currentPeriod}
                    onChange={setCurrentPeriod}
                    currentLabel="Currently working here"
                  />
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-1">
                      Formatted Period:
                    </p>
                    <Badge variant="secondary" className="text-sm">
                      {formatPeriod({
                        startMonth: currentPeriod.start_month,
                        startYear: currentPeriod.start_year,
                        endMonth: currentPeriod.end_month,
                        endYear: currentPeriod.end_year,
                        isCurrent: currentPeriod.is_current,
                      }) || "Not set"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    When "Currently working here" is checked, end date fields
                    are disabled
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Education Section Test</h3>
                <p className="text-sm text-muted-foreground">
                  Test the complete education section functionality
                </p>
              </div>
              <Button
                variant={isEditingEducation ? "default" : "outline"}
                onClick={() => setIsEditingEducation(!isEditingEducation)}
              >
                {isEditingEducation ? "Done Editing" : "Enable Edit Mode"}
              </Button>
            </div>

            <SectionCard
              title="Образование и сертификации"
              icon={GraduationCap}
              isEditing={isEditingEducation}
              onAddClick={() => setShowAddEducationForm(true)}
              showAddButton={!showAddEducationForm}
            >
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={edu.id} className="border-l-2 border-primary/20 pl-4">
                    {editingEducation === edu.id ? (
                      <div className="space-y-4 border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <SortableListControls
                            index={index}
                            totalItems={education.length}
                            onMoveUp={() => moveUp(index)}
                            onMoveDown={() => moveDown(index)}
                          />
                          <InlineEditActions
                            onSave={() => saveEdit(edu.id)}
                            onCancel={cancelEdit}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <DatabaseDropdown
                            table="list_study_field"
                            valueColumn="id"
                            labelColumn="name"
                            value={editForm.degree_id}
                            onChange={(value, label) =>
                              setEditForm((prev) => ({
                                ...prev,
                                degree: { id: Number(value), name: label },
                                degree_id: Number(value),
                              }))
                            }
                            label="Степень"
                            placeholder="Выбрать..."
                            searchPlaceholder="Поиск..."
                            orderBy="name"
                          />

                          <UniversalReferenceSelector
                            type="university"
                            value={editForm.university_id}
                            onChange={(value, label) =>
                              setEditForm((prev) => ({
                                ...prev,
                                university: { id: Number(value), name: label },
                                university_id: Number(value),
                              }))
                            }
                            label="ВУЗы"
                            placeholder="Выбрать..."
                            searchPlaceholder="Введите название..."
                            minSearchLength={3}
                          />
                        </div>

                        <PeriodSelector
                          value={{
                            start_month: editForm.start_month || "",
                            start_year: editForm.start_year || "",
                            end_month: editForm.end_month || "",
                            end_year: editForm.end_year || "",
                            is_current: Boolean(editForm.is_current),
                          }}
                          onChange={(period) => handlePeriodChange(period, false)}
                          currentLabel="По настоящее время"
                        />

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label htmlFor="edit-edu-description">Описание</Label>
                            <CharacterCounter
                              current={editForm.description?.length || 0}
                              max={DESCRIPTION_MAX_LENGTH}
                            />
                          </div>
                          <Textarea
                            id="edit-edu-description"
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            placeholder="Дополнительная информация..."
                            rows={2}
                            maxLength={DESCRIPTION_MAX_LENGTH}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <h3 className="font-semibold text-lg">{edu.degree?.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {formatPeriodData(edu)}
                            </span>
                            {isEditingEducation && (
                              <div className="flex gap-1">
                                <SortableListControls
                                  index={index}
                                  totalItems={education.length}
                                  onMoveUp={() => moveUp(index)}
                                  onMoveDown={() => moveDown(index)}
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => startEditing(edu)}
                                  className="h-7 w-7 p-0"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <DeleteConfirmationDialog
                                  title="Удалить"
                                  description="Вы уверены, что хотите удалить?"
                                  onConfirm={() => removeEducation(edu.id)}
                                  triggerButton={
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 w-7 p-0"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  }
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-primary font-medium mb-2">
                          {edu.university?.name}
                        </p>
                        <p className="text-muted-foreground break-words">
                          {edu.description}
                        </p>
                      </>
                    )}
                  </div>
                ))}

                {isEditingEducation && showAddEducationForm && (
                  <div className="border-l-2 border-dashed border-primary/20 pl-4 space-y-4">
                    <h3 className="font-semibold text-lg">Добавить</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DatabaseDropdown
                        table="list_study_field"
                        valueColumn="id"
                        labelColumn="name"
                        value={newEducation.degree_id}
                        onChange={(value, label) =>
                          setNewEducation((prev) => ({
                            ...prev,
                            degree: { id: Number(value), name: label },
                            degree_id: Number(value),
                          }))
                        }
                        label="Факультет (направление)"
                        placeholder="Выбрать..."
                        searchPlaceholder="Поиск..."
                        orderBy="name"
                      />

                      <UniversalReferenceSelector
                        type="university"
                        value={newEducation.university_id}
                        onChange={(value, label) =>
                          setNewEducation((prev) => ({
                            ...prev,
                            university: { id: Number(value), name: label },
                            university_id: Number(value),
                          }))
                        }
                        label="ВУЗы"
                        placeholder="Выбрать..."
                        searchPlaceholder="Введите название..."
                        minSearchLength={3}
                      />
                    </div>

                    <PeriodSelector
                      value={{
                        start_month: newEducation.start_month || "",
                        start_year: newEducation.start_year || "",
                        end_month: newEducation.end_month || "",
                        end_year: newEducation.end_year || "",
                        is_current: Boolean(newEducation.is_current),
                      }}
                      onChange={(period) => handlePeriodChange(period, true)}
                      currentLabel="По настоящее время"
                    />

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="edu-description">Описание</Label>
                        <CharacterCounter
                          current={newEducation.description?.length || 0}
                          max={DESCRIPTION_MAX_LENGTH}
                        />
                      </div>
                      <Textarea
                        id="edu-description"
                        value={newEducation.description}
                        onChange={(e) =>
                          setNewEducation((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Дополнительная информация..."
                        rows={2}
                        maxLength={DESCRIPTION_MAX_LENGTH}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={addEducation}>Добавить</Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddEducationForm(false)}
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Usage Notes</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">
                  Component Scope:
                </span>{" "}
                All date selector components are located in{" "}
                <code className="bg-muted px-1 py-0.5 rounded">
                  src/components/shared/
                </code>
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Utility Functions:
                </span>{" "}
                Date utilities are in{" "}
                <code className="bg-muted px-1 py-0.5 rounded">
                  src/lib/date-utils.ts
                </code>
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Optional Fields:
                </span>{" "}
                All selectors support optional fields with "not-set" value
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Validation:
                </span>{" "}
                Day selector automatically adjusts for month length and leap
                years
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Used In:
                </span>{" "}
                Birthday section, Experience section, Education section
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
