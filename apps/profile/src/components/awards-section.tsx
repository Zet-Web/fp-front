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
  Award,
  Plus,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ProfileAward } from "../types/awards";
import { defaultAwardValue } from "../utils/award-utils";
import { UserAdditionalInfo } from "../types/profile";

interface AwardsSectionProps {
  additionalInfo: UserAdditionalInfo | null;
  onUpdateAdditionalInfo: (updates: Partial<UserAdditionalInfo>) => void;
  isEditing: boolean;
  onValidationChange?: (section: string, isValid: boolean) => void;
}

export function AwardsSection({
  isEditing,
  additionalInfo,
  onUpdateAdditionalInfo,
  onValidationChange,
}: AwardsSectionProps) {
  const [awards, setAwards] = useState<ProfileAward[]>([]);
  const [showAddAwardForm, setShowAddAwardForm] = useState(false);
  const [editingAward, setEditingAward] = useState<number | null>(null);
  const [newAward, setNewAward] = useState(defaultAwardValue);
  const [editForm, setEditForm] = useState(defaultAwardValue);
  const [dateError, setDateError] = useState<string | null>(null);

  const validateDate = (date: string): string | null => {
    if (!date) return null;
    const year = parseInt(date, 10);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || date.length !== 4) {
      return "Введите год в формате YYYY";
    }
    if (year > currentYear) {
      return "Год не может быть больше текущего";
    }
    return null;
  };

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange("awards", !dateError);
    }
  }, [dateError, onValidationChange]);

  useEffect(() => {
    if (additionalInfo?.awards) setAwards(additionalInfo?.awards);
  }, [additionalInfo?.awards]);

  const moveUp = (index: number) => {
    if (index === 0) return;

    const newAwards = [...awards];
    const temp = newAwards[index - 1];
    newAwards[index - 1] = newAwards[index];
    newAwards[index] = temp;

    setAwards(newAwards);
  };

  const moveDown = (index: number) => {
    if (index === awards.length - 1) return;

    const newAwards = [...awards];
    const temp = newAwards[index + 1];
    newAwards[index + 1] = newAwards[index];
    newAwards[index] = temp;

    setAwards(newAwards);
  };

  const addAward = () => {
    if (newAward.title && newAward.issuer) {
      const addedAward = {
        id: Date.now(),
        ...newAward,
      };
      const updatedAward = [...awards, addedAward];
      setAwards(updatedAward);
      onUpdateAdditionalInfo({ awards: updatedAward });
      setNewAward(defaultAwardValue);
      setShowAddAwardForm(false);
    }
  };

  const removeAward = (id: number) => {
    const newAwards = [...awards].filter((awardu) => awardu.id !== id);
    setAwards(newAwards);
    onUpdateAdditionalInfo({ awards: newAwards });
  };

  const startEditing = (award: ProfileAward) => {
    setEditingAward(award.id);
    setEditForm({
      title: award.title,
      issuer: award.issuer,
      date: award.date,
      description: award.description,
    });
  };

  const saveEdit = (id: number) => {
    const originalAward = awards.filter((award) => award.id === id)[0];

    const editedAward = {
      ...originalAward,
      ...editForm,
    };
    const updatedAward = [
      ...awards.filter((award) => award.id !== id),
      editedAward,
    ];
    setAwards(updatedAward);
    onUpdateAdditionalInfo({ awards: updatedAward });
    setEditingAward(null);
  };

  const cancelEdit = () => {
    setEditingAward(null);
    setEditForm(defaultAwardValue);
  };

  return (
    <Card className="mb-8 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Награды и достижения
          </div>
          {isEditing && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddAwardForm(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Добавить
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {awards.length === 0 && !isEditing && (
            <p className="text-muted-foreground italic">Нет данных.</p>
          )}

          {awards.map((award, index) => (
            <div key={award.id} className="border-l-2 border-primary/20 pl-4">
              {editingAward === award.id ? (
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
                        disabled={index === awards.length - 1}
                        className="h-7 w-7 p-0"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => saveEdit(award.id)}
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
                      <Label htmlFor="edit-award-title">Название</Label>
                      <Input
                        id="edit-award-title"
                        value={editForm.title}
                        onChange={(e) => {
                          if (e.target.value.length <= 64) {
                            setEditForm((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }));
                          }
                        }}
                        placeholder="Название награды или достижения..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-award-issuer">Кем выдано</Label>
                      <Input
                        id="edit-award-issuer"
                        value={editForm.issuer}
                        onChange={(e) => {
                          if (e.target.value.length <= 64) {
                            setEditForm((prev) => ({
                              ...prev,
                              issuer: e.target.value,
                            }));
                          }
                        }}
                        placeholder="Название организации"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-award-date">Дата</Label>
                      <Input
                        id="edit-award-date"
                        value={editForm.date}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditForm((prev) => ({
                            ...prev,
                            date: val,
                          }));
                          setDateError(validateDate(val));
                        }}
                        placeholder="2025"
                        className={dateError ? "border-destructive" : ""}
                      />
                      {dateError && (
                        <p className="text-xs text-destructive mt-1">
                          {dateError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-award-description">Описание</Label>
                    <Textarea
                      id="edit-award-description"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Описание заслуг или достижений..."
                      rows={2}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className="font-semibold text-lg">{award.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {award.date}
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
                            disabled={index === awards.length - 1}
                            className="h-7 w-7 p-0"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditing(award)}
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
                                  onClick={() => removeAward(award.id)}
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
                  <p className="text-primary font-medium mb-2">
                    {award.issuer}
                  </p>
                  <p className="text-muted-foreground break-words">
                    {award.description}
                  </p>
                </>
              )}
            </div>
          ))}

          {isEditing && showAddAwardForm && (
            <div className="border-l-2 border-dashed border-primary/20 pl-4 space-y-4">
              <h3 className="font-semibold text-lg">Добавить</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="award-title">Название</Label>
                  <Input
                    id="award-title"
                    value={newAward.title}
                    onChange={(e) => {
                      if (e.target.value.length <= 64) {
                        setNewAward((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }));
                      }
                    }}
                    placeholder="Best Developer Award"
                  />
                </div>
                <div>
                  <Label htmlFor="award-issuer">Кем выдано</Label>
                  <Input
                    id="award-issuer"
                    value={newAward.issuer}
                    onChange={(e) => {
                      if (e.target.value.length <= 64) {
                        setNewAward((prev) => ({
                          ...prev,
                          issuer: e.target.value,
                        }));
                      }
                    }}
                    placeholder="Tech Company Inc."
                  />
                </div>
                <div>
                  <Label htmlFor="award-date">Дата</Label>
                  <Input
                    id="award-date"
                    value={newAward.date}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewAward((prev) => ({ ...prev, date: val }));
                      setDateError(validateDate(val));
                    }}
                    placeholder="2024"
                    className={dateError ? "border-destructive" : ""}
                  />
                  {dateError && (
                    <p className="text-xs text-destructive mt-1">{dateError}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="award-description">Описание</Label>
                <Textarea
                  id="award-description"
                  value={newAward.description}
                  onChange={(e) =>
                    setNewAward((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Описание заслуг или достижений..."
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addAward}>Добавить</Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddAwardForm(false)}
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
