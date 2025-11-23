// Birthday section component with date selection and visibility controls
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Cake, Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { format, parse, isValid } from "date-fns";
import { BirthdayVisibility, UserProfile } from "../types/profile";
import { DateSelector, DateValue } from "@/components/shared/DateSelector";
import { calculateAge, getMonthLabel } from "@/lib/date-utils";

interface BirthdaySectionProps {
  user: UserProfile;
  isEditing: boolean;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export function BirthdaySection({
  user,
  isEditing,
  onUpdateProfile,
}: BirthdaySectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateValue>({
    day: "not-set",
    month: "not-set",
    year: "not-set",
  });
  const [visibility, setVisibility] = useState<BirthdayVisibility>(
    BirthdayVisibility.full
  );
  const [showAge, setShowAge] = useState<boolean>(true);

  useEffect(() => {
    if (user.birthday) {
      const parts = user.birthday.split("-");
      if (parts.length === 3) {
        setSelectedDate({
          year: parts[0] && parts[0] !== "0000" ? parts[0] : "not-set",
          month: parts[1] && parts[1] !== "00" ? parts[1] : "not-set",
          day: parts[2] && parts[2] !== "00" ? parts[2] : "not-set",
        });
      }
    } else {
      setSelectedDate({
        day: "not-set",
        month: "not-set",
        year: "not-set",
      });
    }
    if (user.birthday_visibility) {
      setVisibility(user.birthday_visibility);
    }
    if (
      user.birthday_show_age !== undefined &&
      user.birthday_show_age !== null
    ) {
      setShowAge(user.birthday_show_age);
    }
  }, [user.birthday, user.birthday_visibility, user.birthday_show_age]);

  const formatBirthdayDisplay = (
    date: string | null,
    visibility: string | null,
    displayAge: boolean = true
  ) => {
    if (!date) return null;

    const parts = date.split("-");
    const year = parts[0] && parts[0] !== "0000" ? parts[0] : null;
    const month = parts[1] && parts[1] !== "00" ? parts[1] : null;
    const day = parts[2] && parts[2] !== "00" ? parts[2] : null;

    if (!year && !month && !day) return null;

    const age = year && month && day ? calculateAge(date) : null;
    const ageText = displayAge && age !== null ? ` (${age} лет (года))` : "";

    if (visibility === "not_show") {
      return ageText || null;
    }

    switch (visibility) {
      case "full":
        if (year && month && day) {
          return `${day}.${month}.${year}${ageText}`;
        }
        break;
      case "day_month":
        if (month && day) {
          const parsedDate = parse(
            `2000-${month}-${day}`,
            "yyyy-MM-dd",
            new Date()
          );
          return isValid(parsedDate)
            ? format(parsedDate, "d MMMM") + ageText
            : null;
        }
        break;
      case "year":
        if (year) {
          return year + ageText;
        }
        break;
    }

    return null;
  };

  const handleAddBirthday = () => {
    if (
      selectedDate.day === "not-set" &&
      selectedDate.month === "not-set" &&
      selectedDate.year === "not-set"
    )
      return;

    const year = selectedDate.year !== "not-set" ? selectedDate.year : "0000";
    const month = selectedDate.month !== "not-set" ? selectedDate.month : "00";
    const day = selectedDate.day !== "not-set" ? selectedDate.day : "00";
    const formattedDate = `${year}-${month}-${day}`;

    onUpdateProfile({
      birthday: formattedDate,
      birthday_visibility: visibility,
      birthday_show_age: showAge,
    });
    setShowAddForm(false);
  };

  const handleRemoveBirthday = () => {
    onUpdateProfile({
      birthday: null,
      birthday_visibility: null,
      birthday_show_age: null,
    });
    setSelectedDate({
      day: "not-set",
      month: "not-set",
      year: "not-set",
    });
    setVisibility(BirthdayVisibility.full);
    setShowAge(true);
  };

  const handleVisibilityChange = (newVisibility: BirthdayVisibility) => {
    setVisibility(newVisibility);
    if (user.birthday) {
      onUpdateProfile({
        birthday_visibility: newVisibility,
      });
    }
  };

  const handleShowAgeChange = (checked: boolean) => {
    setShowAge(checked);
    if (user.birthday) {
      onUpdateProfile({
        birthday_show_age: checked,
      });
    }
  };

  const handleDateChange = (date: DateValue) => {
    setSelectedDate(date);
    const year = date.year !== "not-set" ? date.year : "0000";
    const month = date.month !== "not-set" ? date.month : "00";
    const day = date.day !== "not-set" ? date.day : "00";
    const formattedDate = `${year}-${month}-${day}`;
    onUpdateProfile({
      birthday: formattedDate,
    });
  };

  const renderViewMode = () => {
    const displayValue = formatBirthdayDisplay(
      user.birthday,
      user.birthday_visibility,
      user.birthday_show_age ?? true
    );

    if (!displayValue) {
      return (
        <p className="text-muted-foreground italic text-sm">
          Нет данных
        </p>
      );
    }

    return (
      <div className="flex items-center gap-2 border rounded-lg p-3 hover:bg-muted/50 transition-colors">
        <span className="text-foreground">{displayValue}</span>
      </div>
    );
  };

  const renderEditMode = () => {
    if (!user.birthday && !showAddForm) {
      return null;
    }

    if (user.birthday) {
      const previewDate = `${selectedDate.year !== "not-set" ? selectedDate.year : "0000"}-${selectedDate.month !== "not-set" ? selectedDate.month : "00"}-${selectedDate.day !== "not-set" ? selectedDate.day : "00"}`;

      return (
        <div className="space-y-4">
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-4">
                <Label>День рождения</Label>

                <DateSelector
                  value={selectedDate}
                  onChange={handleDateChange}
                  optional={true}
                  showLabels={true}
                />
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive h-7 w-7 p-0 mt-6"
                  >
                    <X className="w-4 h-4" />
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
                      onClick={handleRemoveBirthday}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Удалить
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div>
              <Label htmlFor="visibility">Вид отображения</Label>
              <Select value={visibility} onValueChange={handleVisibilityChange}>
                <SelectTrigger id="visibility" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Полностью</SelectItem>
                  <SelectItem value="day_month">День и месяц</SelectItem>
                  <SelectItem value="year">Год</SelectItem>
                  <SelectItem value="not_show">Не показывать</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-age"
                checked={showAge}
                onCheckedChange={handleShowAgeChange}
              />
              <Label
                htmlFor="show-age"
                className="text-sm font-normal cursor-pointer"
              >
                Показать возраст
              </Label>
            </div>

            {(selectedDate.day !== "not-set" ||
              selectedDate.month !== "not-set" ||
              selectedDate.year !== "not-set") && (
              <p className="text-sm text-muted-foreground mt-2">
                Видимость:{" "}
                {formatBirthdayDisplay(previewDate, visibility, showAge) ||
                  "Выберите поля"}
              </p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 space-y-4">
        <h4 className="font-medium">Добавить</h4>

        <div>
          <Label>Выберите дату</Label>
          <DateSelector
            value={selectedDate}
            onChange={setSelectedDate}
            optional={true}
            showLabels={true}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="new-visibility">Вид отображения</Label>
          <Select
            value={visibility}
            onValueChange={(value) =>
              setVisibility(value as BirthdayVisibility)
            }
          >
            <SelectTrigger id="new-visibility" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Полностью</SelectItem>
              <SelectItem value="day_month">День и месяц</SelectItem>
              <SelectItem value="year">Год</SelectItem>
              <SelectItem value="not_show">Не показывать</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="new-show-age"
            checked={showAge}
            onCheckedChange={setShowAge}
          />
          <Label
            htmlFor="new-show-age"
            className="text-sm font-normal cursor-pointer"
          >
            Показать возраст
          </Label>
        </div>

        {(selectedDate.day !== "not-set" ||
          selectedDate.month !== "not-set" ||
          selectedDate.year !== "not-set") && (
          <p className="text-sm text-muted-foreground mt-2">
            Preview:{" "}
            {formatBirthdayDisplay(
              `${selectedDate.year !== "not-set" ? selectedDate.year : "0000"}-${
                selectedDate.month !== "not-set" ? selectedDate.month : "00"
              }-${selectedDate.day !== "not-set" ? selectedDate.day : "00"}`,
              visibility,
              showAge
            ) || "Выберите поле"}
          </p>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleAddBirthday}
            disabled={
              selectedDate.day === "not-set" &&
              selectedDate.month === "not-set" &&
              selectedDate.year === "not-set"
            }
          >
            Добавить
          </Button>
          <Button variant="outline" onClick={() => setShowAddForm(false)}>
            Отмена
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cake className="w-5 h-5" />
            День рождения
          </div>
          {isEditing && !user.birthday && !showAddForm && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Добавить
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? renderEditMode() : renderViewMode()}
      </CardContent>
    </Card>
  );
}
