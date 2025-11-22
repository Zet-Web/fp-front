import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GraduationCap, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionCard } from "@/components/shared/SectionCard";
import { SortableListControls } from "@/components/shared/SortableListControls";
import { InlineEditActions } from "@/components/shared/InlineEditActions";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { PeriodSelector, PeriodData } from "@/components/shared/PeriodSelector";
import { UniversalReferenceSelector } from "@/components/shared/UniversalReferenceSelector";
import { formatPeriod } from "@/lib/date-utils";
import { defaultEducationValue } from "../utils/education-utils";
import { ProfileEducation } from "../types/education";
import { UserAdditionalInfo } from "../types/profile";
import { CharacterCounter } from "@/components/shared/CharacterCounter";

interface EducationSectionProps {
  isEditing: boolean;
  additionalInfo: UserAdditionalInfo | null;
  onUpdateAdditionalInfo: (updates: Partial<UserAdditionalInfo>) => void;
}

export function EducationSection({
  isEditing,
  additionalInfo,
  onUpdateAdditionalInfo,
}: EducationSectionProps) {
  const [education, setEducation] = useState<ProfileEducation[]>([]);
  const [editingEducation, setEditingEducation] = useState<number | null>(null);
  const [showAddEducationForm, setShowAddEducationForm] = useState(false);
  const [newEducation, setNewEducation] = useState(defaultEducationValue);
  const [editForm, setEditForm] = useState(defaultEducationValue);

  const DESCRIPTION_MAX_LENGTH = 400;

  useEffect(() => {
    if (additionalInfo?.education) setEducation(additionalInfo?.education);
  }, [additionalInfo?.education]);

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
      onUpdateAdditionalInfo({ education: updatedEducations });
      setNewEducation(defaultEducationValue);
      setShowAddEducationForm(false);
    }
  };

  const removeEducation = (id: number) => {
    const newEducations = [...education].filter((edu) => edu.id !== id);
    setEducation(newEducations);
    onUpdateAdditionalInfo({ education: newEducations });
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
    onUpdateAdditionalInfo({ education: updatedEducations });

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
    <SectionCard
      title="Образование и сертификации"
      icon={GraduationCap}
      isEditing={isEditing}
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
                  <UniversalReferenceSelector
                    type="study_field"
                    value={editForm.degree_id || 0}
                    onChange={(value, label) =>
                      setEditForm((prev) => ({
                        ...prev,
                        degree: { id: Number(value), name: label },
                        degree_id: Number(value),
                      }))
                    }
                    label="Факультет (направление)"
                    placeholder="Выбрать..."
                    searchPlaceholder="Поиск направления..."
                    minSearchLength={0}
                    showIcon={true}
                    limit={100}
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
                    {isEditing && (
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

        {isEditing && showAddEducationForm && (
          <div className="border-l-2 border-dashed border-primary/20 pl-4 space-y-4">
            <h3 className="font-semibold text-lg">Добавить</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UniversalReferenceSelector
                type="study_field"
                value={newEducation.degree_id || 0}
                onChange={(value, label) =>
                  setNewEducation((prev) => ({
                    ...prev,
                    degree: { id: Number(value), name: label },
                    degree_id: Number(value),
                  }))
                }
                label="Факультет (направление)"
                placeholder="Выбрать..."
                searchPlaceholder="Поиск направления..."
                minSearchLength={0}
                showIcon={true}
                limit={100}
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
  );
}
