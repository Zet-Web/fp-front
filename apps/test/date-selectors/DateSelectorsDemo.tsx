// Demo tab showcasing date selection components
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
