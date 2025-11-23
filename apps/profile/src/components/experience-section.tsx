// Experience section component with reusable month/year selectors
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
import { CharacterCounter } from "@/components/shared/CharacterCounter";
import { PeriodSelector, PeriodData } from "@/components/shared/PeriodSelector";
import { formatPeriod } from "@/lib/date-utils";
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

  const TITLE_MAX_LENGTH = 50;
  const COMPANY_MAX_LENGTH = 50;
  const DESCRIPTION_MAX_LENGTH = 400;

  useEffect(() => {
    if (additionalInfo?.experience) setExperiences(additionalInfo?.experience);
  }, [additionalInfo?.experience]);

  const formatExperiencePeriod = (exp: ProfileExperience) => {
    return (
      formatPeriod({
        startMonth: exp.start_month,
        startYear: exp.start_year,
        endMonth: exp.end_month,
        endYear: exp.end_year,
        isCurrent: exp.is_current,
      }) ||
      exp.period ||
      ""
    );
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
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="edit-exp-title">Должность</Label>
                        <CharacterCounter
                          current={editForm.title?.length || 0}
                          max={TITLE_MAX_LENGTH}
                        />
                      </div>
                      <Input
                        id="edit-exp-title"
                        value={editForm.title}
                        onChange={(e) => {
                          if (e.target.value.length <= 64) {
                            setEditForm((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }));
                          }
                        }}
                        placeholder="Senior Developer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="edit-exp-company">Организация</Label>
                        <CharacterCounter
                          current={editForm.company?.length || 0}
                          max={COMPANY_MAX_LENGTH}
                        />
                      </div>
                      <Input
                        id="edit-exp-company"
                        value={editForm.company}
                        onChange={(e) => {
                          if (e.target.value.length <= 64) {
                            setEditForm((prev) => ({
                              ...prev,
                              company: e.target.value,
                            }));
                          }
                        }}
                        placeholder="Company Name"
                        maxLength={COMPANY_MAX_LENGTH}
                      />
                    </div>
                  </div>
                  <PeriodSelector
                    value={{
                      start_month: editForm.start_month,
                      start_year: editForm.start_year,
                      end_month: editForm.end_month,
                      end_year: editForm.end_year,
                      is_current: editForm.is_current,
                    }}
                    onChange={(period: PeriodData) =>
                      setEditForm((prev) => ({
                        ...prev,
                        start_month: period.start_month,
                        start_year: period.start_year,
                        end_month: period.end_month,
                        end_year: period.end_year,
                        is_current: period.is_current,
                      }))
                    }
                    currentLabel="По настоящее время"
                  />
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="edit-exp-description">Описание</Label>
                      <CharacterCounter
                        current={editForm.description?.length || 0}
                        max={DESCRIPTION_MAX_LENGTH}
                      />
                    </div>
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
                      maxLength={DESCRIPTION_MAX_LENGTH}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className="font-semibold text-lg">{exp.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {formatExperiencePeriod(exp)}
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
                                <AlertDialogTitle>Удалить</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Вы уверены, что хотите удалить?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => removeExperience(exp.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
                  <p className="text-muted-foreground mb-3 break-words">
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
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="exp-title">Должность</Label>
                    <CharacterCounter
                      current={newExperience.title?.length || 0}
                      max={TITLE_MAX_LENGTH}
                    />
                  </div>
                  <Input
                    id="exp-title"
                    value={newExperience.title}
                    onChange={(e) => {
                      if (e.target.value.length <= 64) {
                        setNewExperience((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }));
                      }
                    }}
                    placeholder="Senior Developer"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="exp-company">Организация</Label>
                    <CharacterCounter
                      current={newExperience.company?.length || 0}
                      max={COMPANY_MAX_LENGTH}
                    />
                  </div>
                  <Input
                    id="exp-company"
                    value={newExperience.company}
                    onChange={(e) => {
                      if (e.target.value.length <= 64) {
                        setNewExperience((prev) => ({
                          ...prev,
                          company: e.target.value,
                        }));
                      }
                    }}
                    placeholder="Company Name"
                  />
                </div>
              </div>
              <PeriodSelector
                value={{
                  start_month: newExperience.start_month,
                  start_year: newExperience.start_year,
                  end_month: newExperience.end_month,
                  end_year: newExperience.end_year,
                  is_current: newExperience.is_current,
                }}
                onChange={(period: PeriodData) =>
                  setNewExperience((prev) => ({
                    ...prev,
                    start_month: period.start_month,
                    start_year: period.start_year,
                    end_month: period.end_month,
                    end_year: period.end_year,
                    is_current: period.is_current,
                  }))
                }
                currentLabel="По настоящее время"
              />
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="exp-description">Описание</Label>
                  <CharacterCounter
                    current={newExperience.description?.length || 0}
                    max={DESCRIPTION_MAX_LENGTH}
                  />
                </div>
                <Textarea
                  id="exp-description"
                  value={newExperience.description}
                  onChange={(e) =>
                    setNewExperience((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Расскажите о своей роли и задачах..."
                  rows={3}
                  maxLength={DESCRIPTION_MAX_LENGTH}
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
