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
import { UserProfile } from "../types/profile";

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
  const [selectedDay, setSelectedDay] = useState<string>("not-set");
  const [selectedMonth, setSelectedMonth] = useState<string>("not-set");
  const [selectedYear, setSelectedYear] = useState<string>("not-set");
  const [visibility, setVisibility] = useState<
    "full" | "day_month" | "year" | "not_show"
  >("full");
  const [showAge, setShowAge] = useState<boolean>(true);

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

  const getDaysInMonth = (month: string, year: string) => {
    if (!month || !year) return 31;
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    return daysInMonth;
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1930; year--) {
      years.push(year.toString());
    }
    return years;
  };

  const calculateAge = (birthDate: string) => {
    const parsedDate = parse(birthDate, "yyyy-MM-dd", new Date());
    if (!isValid(parsedDate)) return null;

    const today = new Date();
    let age = today.getFullYear() - parsedDate.getFullYear();
    const monthDiff = today.getMonth() - parsedDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < parsedDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    if (user.birthday) {
      const parts = user.birthday.split("-");
      if (parts.length === 3) {
        setSelectedYear(parts[0] && parts[0] !== "0000" ? parts[0] : "not-set");
        setSelectedMonth(parts[1] && parts[1] !== "00" ? parts[1] : "not-set");
        setSelectedDay(parts[2] && parts[2] !== "00" ? parts[2] : "not-set");
      }
    } else {
      setSelectedYear("not-set");
      setSelectedMonth("not-set");
      setSelectedDay("not-set");
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
    const ageText = displayAge && age !== null ? ` (${age} years old)` : "";

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
      selectedDay === "not-set" &&
      selectedMonth === "not-set" &&
      selectedYear === "not-set"
    )
      return;

    const year = selectedYear !== "not-set" ? selectedYear : "0000";
    const month = selectedMonth !== "not-set" ? selectedMonth : "00";
    const day = selectedDay !== "not-set" ? selectedDay : "00";
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
    setSelectedDay("not-set");
    setSelectedMonth("not-set");
    setSelectedYear("not-set");
    setVisibility("full");
    setShowAge(true);
  };

  const handleVisibilityChange = (
    newVisibility: "full" | "day_month" | "year" | "not_show"
  ) => {
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

  const handleDayChange = (day: string) => {
    setSelectedDay(day);
    const year = selectedYear !== "not-set" ? selectedYear : "0000";
    const month = selectedMonth !== "not-set" ? selectedMonth : "00";
    const dayValue = day !== "not-set" ? day : "00";
    const formattedDate = `${year}-${month}-${dayValue}`;
    onUpdateProfile({
      birthday: formattedDate,
    });
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);

    if (
      selectedDay !== "not-set" &&
      selectedYear !== "not-set" &&
      month !== "not-set"
    ) {
      const maxDays = getDaysInMonth(month, selectedYear);
      const currentDay = parseInt(selectedDay);
      if (currentDay > maxDays) {
        setSelectedDay(maxDays.toString().padStart(2, "0"));
      }
    }

    const year = selectedYear !== "not-set" ? selectedYear : "0000";
    const day = selectedDay !== "not-set" ? selectedDay : "00";
    const monthValue = month !== "not-set" ? month : "00";
    const adjustedDay =
      selectedDay !== "not-set" &&
      selectedYear !== "not-set" &&
      month !== "not-set" &&
      parseInt(selectedDay) > getDaysInMonth(month, selectedYear)
        ? getDaysInMonth(month, selectedYear).toString().padStart(2, "0")
        : day;
    const formattedDate = `${year}-${monthValue}-${adjustedDay}`;
    onUpdateProfile({
      birthday: formattedDate,
    });
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);

    if (
      selectedDay !== "not-set" &&
      selectedMonth !== "not-set" &&
      year !== "not-set"
    ) {
      const maxDays = getDaysInMonth(selectedMonth, year);
      const currentDay = parseInt(selectedDay);
      if (currentDay > maxDays) {
        setSelectedDay(maxDays.toString().padStart(2, "0"));
      }
    }

    const month = selectedMonth !== "not-set" ? selectedMonth : "00";
    const day = selectedDay !== "not-set" ? selectedDay : "00";
    const yearValue = year !== "not-set" ? year : "0000";
    const adjustedDay =
      selectedDay !== "not-set" &&
      selectedMonth !== "not-set" &&
      year !== "not-set" &&
      parseInt(selectedDay) > getDaysInMonth(selectedMonth, year)
        ? getDaysInMonth(selectedMonth, year).toString().padStart(2, "0")
        : day;
    const formattedDate = `${yearValue}-${month}-${adjustedDay}`;
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
          No birthday added
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
      const year = selectedYear || "0000";
      const month = selectedMonth || "00";
      const day = selectedDay || "00";
      const previewDate = `${year}-${month}-${day}`;

      return (
        <div className="space-y-4">
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-4">
                <Label>Birthday</Label>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label
                      htmlFor="day"
                      className="text-xs text-muted-foreground"
                    >
                      Day (Optional)
                    </Label>
                    <Select value={selectedDay} onValueChange={handleDayChange}>
                      <SelectTrigger id="day">
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-set">Not set</SelectItem>
                        {Array.from(
                          {
                            length: getDaysInMonth(
                              selectedMonth !== "not-set"
                                ? selectedMonth
                                : "01",
                              selectedYear !== "not-set" ? selectedYear : "2000"
                            ),
                          },
                          (_, i) => {
                            const day = (i + 1).toString().padStart(2, "0");
                            return (
                              <SelectItem key={day} value={day}>
                                {day}
                              </SelectItem>
                            );
                          }
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="month"
                      className="text-xs text-muted-foreground"
                    >
                      Month (Optional)
                    </Label>
                    <Select
                      value={selectedMonth}
                      onValueChange={handleMonthChange}
                    >
                      <SelectTrigger id="month">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-set">Not set</SelectItem>
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
                      htmlFor="year"
                      className="text-xs text-muted-foreground"
                    >
                      Year (Optional)
                    </Label>
                    <Select
                      value={selectedYear}
                      onValueChange={handleYearChange}
                    >
                      <SelectTrigger id="year">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-set">Not set</SelectItem>
                        {generateYears().map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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
                    <AlertDialogTitle>Delete Birthday</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete your birthday? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRemoveBirthday}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div>
              <Label htmlFor="visibility">Display As</Label>
              <Select value={visibility} onValueChange={handleVisibilityChange}>
                <SelectTrigger id="visibility" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full</SelectItem>
                  <SelectItem value="day_month">Day and Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="not_show">Not show</SelectItem>
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
                Show Age
              </Label>
            </div>

            {(selectedDay !== "not-set" ||
              selectedMonth !== "not-set" ||
              selectedYear !== "not-set") && (
              <p className="text-sm text-muted-foreground mt-2">
                Preview:{" "}
                {formatBirthdayDisplay(previewDate, visibility, showAge) ||
                  "Select at least one field"}
              </p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 space-y-4">
        <h4 className="font-medium">Add</h4>

        <div>
          <Label>Select Date (at least one field)</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div>
              <Label
                htmlFor="new-day"
                className="text-xs text-muted-foreground"
              >
                Day (Optional)
              </Label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger id="new-day">
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-set">Not set</SelectItem>
                  {Array.from(
                    {
                      length: getDaysInMonth(
                        selectedMonth !== "not-set" ? selectedMonth : "01",
                        selectedYear !== "not-set" ? selectedYear : "2000"
                      ),
                    },
                    (_, i) => {
                      const day = (i + 1).toString().padStart(2, "0");
                      return (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      );
                    }
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="new-month"
                className="text-xs text-muted-foreground"
              >
                Month (Optional)
              </Label>
              <Select
                value={selectedMonth}
                onValueChange={(month) => {
                  setSelectedMonth(month);
                  if (
                    selectedDay !== "not-set" &&
                    selectedYear !== "not-set" &&
                    month !== "not-set"
                  ) {
                    const maxDays = getDaysInMonth(month, selectedYear);
                    const currentDay = parseInt(selectedDay);
                    if (currentDay > maxDays) {
                      setSelectedDay(maxDays.toString().padStart(2, "0"));
                    }
                  }
                }}
              >
                <SelectTrigger id="new-month">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-set">Not set</SelectItem>
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
                htmlFor="new-year"
                className="text-xs text-muted-foreground"
              >
                Year (Optional)
              </Label>
              <Select
                value={selectedYear}
                onValueChange={(year) => {
                  setSelectedYear(year);
                  if (
                    selectedDay !== "not-set" &&
                    selectedMonth !== "not-set" &&
                    year !== "not-set"
                  ) {
                    const maxDays = getDaysInMonth(selectedMonth, year);
                    const currentDay = parseInt(selectedDay);
                    if (currentDay > maxDays) {
                      setSelectedDay(maxDays.toString().padStart(2, "0"));
                    }
                  }
                }}
              >
                <SelectTrigger id="new-year">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-set">Not set</SelectItem>
                  {generateYears().map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="new-visibility">Display As</Label>
          <Select value={visibility} onValueChange={setVisibility}>
            <SelectTrigger id="new-visibility" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full</SelectItem>
              <SelectItem value="day_month">Day and Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
              <SelectItem value="not_show">Not show</SelectItem>
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
            Show Age
          </Label>
        </div>

        {(selectedDay !== "not-set" ||
          selectedMonth !== "not-set" ||
          selectedYear !== "not-set") && (
          <p className="text-sm text-muted-foreground mt-2">
            Preview:{" "}
            {formatBirthdayDisplay(
              `${selectedYear !== "not-set" ? selectedYear : "0000"}-${
                selectedMonth !== "not-set" ? selectedMonth : "00"
              }-${selectedDay !== "not-set" ? selectedDay : "00"}`,
              visibility,
              showAge
            ) || "Select at least one field"}
          </p>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleAddBirthday}
            disabled={
              selectedDay === "not-set" &&
              selectedMonth === "not-set" &&
              selectedYear === "not-set"
            }
          >
            Add
          </Button>
          <Button variant="outline" onClick={() => setShowAddForm(false)}>
            Cancel
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
            Birthday
          </div>
          {isEditing && !user.birthday && !showAddForm && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
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
