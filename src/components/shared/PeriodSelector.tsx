import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MONTHS, generateYears } from "@/lib/date-utils";

export interface PeriodData {
  start_month: string;
  start_year: string;
  end_month: string;
  end_year: string;
  is_current: boolean;
}

interface PeriodSelectorProps {
  value: PeriodData;
  onChange: (period: PeriodData) => void;
  currentLabel?: string;
  showCurrent?: boolean;
  startYearFrom?: number;
  className?: string;
}

export function PeriodSelector({
  value,
  onChange,
  currentLabel = "I currently work here",
  showCurrent = true,
  startYearFrom = 1930,
  className = "",
}: PeriodSelectorProps) {
  const years = generateYears(startYearFrom);

  const handleChange = (
    field: keyof PeriodData,
    newValue: string | boolean
  ) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label>Period (Optional)</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div>
          <Label
            htmlFor="start-month"
            className="text-xs text-muted-foreground"
          >
            Месяц начала
          </Label>
          <Select
            value={value.start_month}
            onValueChange={(val) => handleChange("start_month", val)}
          >
            <SelectTrigger id="start-month">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-set">Не установлен</SelectItem>
              {MONTHS.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="start-year" className="text-xs text-muted-foreground">
            Год начала
          </Label>
          <Select
            value={value.start_year}
            onValueChange={(val) => handleChange("start_year", val)}
          >
            <SelectTrigger id="start-year">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-set">Не установлен</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="end-month" className="text-xs text-muted-foreground">
            Месяц завершения
          </Label>
          <Select
            value={value.end_month}
            onValueChange={(val) => handleChange("end_month", val)}
            disabled={value.is_current}
          >
            <SelectTrigger id="end-month">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-set">Не установлен</SelectItem>
              {MONTHS.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="end-year" className="text-xs text-muted-foreground">
            Год завершения
          </Label>
          <Select
            value={value.end_year}
            onValueChange={(val) => handleChange("end_year", val)}
            disabled={value.is_current}
          >
            <SelectTrigger id="end-year">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-set">Не установлен</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {showCurrent && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is-current"
            checked={value.is_current}
            onCheckedChange={(checked) =>
              handleChange("is_current", checked as boolean)
            }
          />
          <Label
            htmlFor="is-current"
            className="text-sm font-normal cursor-pointer"
          >
            {currentLabel}
          </Label>
        </div>
      )}
    </div>
  );
}
