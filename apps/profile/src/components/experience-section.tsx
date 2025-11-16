import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ProfileExperience } from "../types/experience";
import { defaultExperienceValue } from "../utils/experiences-utils";
import { UserAdditionalInfo } from "../types/profile";
interface ExperienceSectionProps {
  additionalInfo: UserAdditionalInfo | null;
  onUpdateAdditionalInfo: (updates: Partial<UserAdditionalInfo>) => void;
  isEditing: boolean;
}

export function ExperienceSection({
  isEditing,
  additionalInfo,
  onUpdateAdditionalInfo,
}: ExperienceSectionProps) {
  const [experiences, setExperiences] = useState<ProfileExperience[]>(
    additionalInfo?.experience || []
  );
  const [editingExperience, setEditingExperience] = useState<number | null>(
    null
  );
  const [showAddExperienceForm, setShowAddExperienceForm] = useState(false);
  const [newExperience, setNewExperience] = useState(defaultExperienceValue);
  const [editForm, setEditForm] = useState(defaultExperienceValue);

  useEffect(() => {
    if (additionalInfo?.experience) setExperiences(additionalInfo?.experience);
  }, [additionalInfo?.experience]);

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1930; year--) {
      years.push(year.toString());
    }
    return years;
  };

  const formatPeriod = (exp: ProfileExperience) => {
    if (exp.start_year && exp.start_year !== "not-set") {
      const startMonth =
        exp.start_month !== "not-set" && exp.start_month
          ? months.find((m) => m.value === exp.start_month)?.label
          : "";
      const startYear = exp.start_year;
      const start = startMonth ? `${startMonth} ${startYear}` : startYear;

      if (exp.is_current) {
        return `${start} - Present`;
      }

      if (exp.end_year && exp.end_year !== "not-set") {
        const endMonth =
          exp.end_month !== "not-set" && exp.end_month
            ? months.find((m) => m.value === exp.end_month)?.label
            : "";
        const endYear = exp.end_year;
        const end = endMonth ? `${endMonth} ${endYear}` : endYear;
        return `${start} - ${end}`;
      }

      return start;
    }

    return exp.period || "";
  };

  const moveUp = (index: number) => {
    if (index === 0) return;

    const newExperiences = [...experiences];
    const temp = newExperiences[index - 1];
    newExperiences[index - 1] = newExperiences[index];
    newExperiences[index] = temp;

    setExperiences(newExperiences);
  };

  const moveDown = (index: number) => {
    if (index === experiences.length - 1) return;

    const newExperiences = [...experiences];
    const temp = newExperiences[index + 1];
    newExperiences[index + 1] = newExperiences[index];
    newExperiences[index] = temp;

    setExperiences(newExperiences);
  };

  const addExperience = () => {
    if (newExperience.title && newExperience.company) {
      const addedExperience = {
        id: Date.now(),
        ...newExperience,
        achievements: newExperience.achievements.filter((a) => a.trim()),
      };
      const updatedExperiences = [...experiences, addedExperience];
      setExperiences(updatedExperiences);
      onUpdateAdditionalInfo({ experience: updatedExperiences });
      setNewExperience(defaultExperienceValue);
      setShowAddExperienceForm(false);
    }
  };

  const removeExperience = (id: number) => {
    const newExperiences = [...experiences].filter((exp) => exp.id !== id);
    setExperiences(newExperiences);
    onUpdateAdditionalInfo({ experience: newExperiences });
  };

  const startEditing = (exp: ProfileExperience) => {
    setEditingExperience(exp.id);
    setEditForm({
      title: exp.title,
      company: exp.company,
      period: exp.period,
      start_month: exp.start_month || "not-set",
      start_year: exp.start_year || "not-set",
      end_month: exp.end_month || "not-set",
      end_year: exp.end_year || "not-set",
      is_current: exp.is_current || false,
      description: exp.description,
      achievements: exp.achievements.length > 0 ? exp.achievements : [""],
    });
  };

  const saveEdit = (id: number) => {
    const originalExperience = experiences.filter((exp) => exp.id === id)[0];

    const editedExperience = {
      ...originalExperience,
      ...editForm,
      achievements: editForm.achievements.filter((a) => a.trim()),
    };
    const updatedExperiences = [
      ...experiences.filter((exp) => exp.id !== id),
      editedExperience,
    ];
    setExperiences(updatedExperiences);
    onUpdateAdditionalInfo({ experience: updatedExperiences });

    setEditingExperience(null);
  };

  const cancelEdit = () => {
    setEditingExperience(null);
    setEditForm({
      title: "",
      company: "",
      period: "",
      start_month: "not-set",
      start_year: "not-set",
      end_month: "not-set",
      end_year: "not-set",
      is_current: false,
      description: "",
      achievements: [""],
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Опыт работы
          </div>
          {isEditing && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddExperienceForm(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Добавить
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="border-l-2 border-primary/20 pl-4">
              {editingExperience === exp.id ? (
                <div className="space-y-4 border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="h-7 w-7 p-0"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveDown(index)}
                        disabled={index === experiences.length - 1}
                        className="h-7 w-7 p-0"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => saveEdit(exp.id)}
                        className="h-7 w-7 p-0 text-green-600 hover:text-green-700"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={cancelEdit}
                        className="h-7 w-7 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-exp-title">Должность</Label>
                      <Input
                        id="edit-exp-title"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Senior Developer"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-exp-company">Организация</Label>
                      <Input
                        id="edit-exp-company"
                        value={editForm.company}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            company: e.target.value,
                          }))
                        }
                        placeholder="Company Name"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Период (по желанию)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div>
                        <Label
                          htmlFor="edit-start-month"
                          className="text-xs text-muted-foreground"
                        >
                          Месяц начала
                        </Label>
                        <Select
                          value={editForm.start_month}
                          onValueChange={(value) =>
                            setEditForm((prev) => ({
                              ...prev,
                              start_month: value,
                            }))
                          }
                        >
                          <SelectTrigger id="edit-start-month">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-set">-</SelectItem>
                            {months.map((month) => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label
                          htmlFor="edit-start-year"
                          className="text-xs text-muted-foreground"
                        >
                          Год начала
                        </Label>
                        <Select
                          value={editForm.start_year}
                          onValueChange={(value) =>
                            setEditForm((prev) => ({
                              ...prev,
                              start_year: value,
                            }))
                          }
                        >
                          <SelectTrigger id="edit-start-year">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-set">-</SelectItem>
                            {generateYears().map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label
                          htmlFor="edit-end-month"
                          className="text-xs text-muted-foreground"
                        >
                          Месяц завершения
                        </Label>
                        <Select
                          value={editForm.end_month}
                          onValueChange={(value) =>
                            setEditForm((prev) => ({
                              ...prev,
                              end_month: value,
                            }))
                          }
                          disabled={editForm.is_current}
                        >
                          <SelectTrigger id="edit-end-month">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-set">-</SelectItem>
                            {months.map((month) => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label
                          htmlFor="edit-end-year"
                          className="text-xs text-muted-foreground"
                        >
                          Год завершения
                        </Label>
                        <Select
                          value={editForm.end_year}
                          onValueChange={(value) =>
                            setEditForm((prev) => ({
                              ...prev,
                              end_year: value,
                            }))
                          }
                          disabled={editForm.is_current}
                        >
                          <SelectTrigger id="edit-end-year">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-set">-</SelectItem>
                            {generateYears().map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="edit-is-current"
                        checked={editForm.is_current}
                        onCheckedChange={(checked) =>
                          setEditForm((prev) => ({
                            ...prev,
                            is_current: checked as boolean,
                          }))
                        }
                      />
                      <Label
                        htmlFor="edit-is-current"
                        className="text-sm font-normal cursor-pointer"
                      >
                        По настоящее время
                      </Label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-exp-description">Описание</Label>
                    <Textarea
                      id="edit-exp-description"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe your role and responsibilities..."
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className="font-semibold text-lg">{exp.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {formatPeriod(exp)}
                      </span>
                      {isEditing && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveUp(index)}
                            disabled={index === 0}
                            className="h-7 w-7 p-0"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveDown(index)}
                            disabled={index === experiences.length - 1}
                            className="h-7 w-7 p-0"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditing(exp)}
                            className="h-7 w-7 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Удалить
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Вы уверены, что хотите удалить?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => removeExperience(exp.id)}
                                >
                                  Удалить
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-primary font-medium mb-2">{exp.company}</p>
                  <p className="text-muted-foreground mb-3">
                    {exp.description}
                  </p>
                  {exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {exp.achievements.map((achievement, achievementIndex) => (
                        <li key={achievementIndex}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          ))}

          {isEditing && showAddExperienceForm && (
            <div className="border-l-2 border-dashed border-primary/20 pl-4 space-y-4">
              <h3 className="font-semibold text-lg">Добавить</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="exp-title">Должность</Label>
                  <Input
                    id="exp-title"
                    value={newExperience.title}
                    onChange={(e) =>
                      setNewExperience((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Senior Developer"
                  />
                </div>
                <div>
                  <Label htmlFor="exp-company">Организация</Label>
                  <Input
                    id="exp-company"
                    value={newExperience.company}
                    onChange={(e) =>
                      setNewExperience((prev) => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                    placeholder="Company Name"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label>Период (по желанию)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div>
                    <Label
                      htmlFor="new-start-month"
                      className="text-xs text-muted-foreground"
                    >
                      Месяц начала
                    </Label>
                    <Select
                      value={newExperience.start_month}
                      onValueChange={(value) =>
                        setNewExperience((prev) => ({
                          ...prev,
                          start_month: value,
                        }))
                      }
                    >
                      <SelectTrigger id="new-start-month">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-set">-</SelectItem>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="new-start-year"
                      className="text-xs text-muted-foreground"
                    >
                      Год начала
                    </Label>
                    <Select
                      value={newExperience.start_year}
                      onValueChange={(value) =>
                        setNewExperience((prev) => ({
                          ...prev,
                          start_year: value,
                        }))
                      }
                    >
                      <SelectTrigger id="new-start-year">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-set">-</SelectItem>
                        {generateYears().map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="new-end-month"
                      className="text-xs text-muted-foreground"
                    >
                      Месяц завершения
                    </Label>
                    <Select
                      value={newExperience.end_month}
                      onValueChange={(value) =>
                        setNewExperience((prev) => ({
                          ...prev,
                          end_month: value,
                        }))
                      }
                      disabled={newExperience.is_current}
                    >
                      <SelectTrigger id="new-end-month">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-set">-</SelectItem>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="new-end-year"
                      className="text-xs text-muted-foreground"
                    >
                      Год завершения
                    </Label>
                    <Select
                      value={newExperience.end_year}
                      onValueChange={(value) =>
                        setNewExperience((prev) => ({
                          ...prev,
                          end_year: value,
                        }))
                      }
                      disabled={newExperience.is_current}
                    >
                      <SelectTrigger id="new-end-year">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-set">-</SelectItem>
                        {generateYears().map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="new-is-current"
                    checked={newExperience.is_current}
                    onCheckedChange={(checked) =>
                      setNewExperience((prev) => ({
                        ...prev,
                        is_current: checked as boolean,
                      }))
                    }
                  />
                  <Label
                    htmlFor="new-is-current"
                    className="text-sm font-normal cursor-pointer"
                  >
                    По настоящее время
                  </Label>
                </div>
              </div>
              <div>
                <Label htmlFor="exp-description">Описание</Label>
                <Textarea
                  id="exp-description"
                  value={newExperience.description}
                  onChange={(e) =>
                    setNewExperience((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe your role and responsibilities..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addExperience}>Добавить</Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddExperienceForm(false)}
                >
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
