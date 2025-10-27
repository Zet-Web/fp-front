import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { MONTHS, generateYears } from "@/lib/date-utils"

export interface PeriodData {
  startMonth: string
  startYear: string
  endMonth: string
  endYear: string
  isCurrent: boolean
}

interface PeriodSelectorProps {
  value: PeriodData
  onChange: (period: PeriodData) => void
  currentLabel?: string
  showCurrent?: boolean
  startYearFrom?: number
  className?: string
}

export function PeriodSelector({
  value,
  onChange,
  currentLabel = "I currently work here",
  showCurrent = true,
  startYearFrom = 1930,
  className = ""
}: PeriodSelectorProps) {
  const years = generateYears(startYearFrom)

  const handleChange = (field: keyof PeriodData, newValue: string | boolean) => {
    onChange({ ...value, [field]: newValue })
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <Label>Period (Optional)</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div>
          <Label htmlFor="start-month" className="text-xs text-muted-foreground">
            Start Month
          </Label>
          <Select
            value={value.startMonth}
            onValueChange={(val) => handleChange('startMonth', val)}
          >
            <SelectTrigger id="start-month">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-set">Not set</SelectItem>
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
            Start Year
          </Label>
          <Select
            value={value.startYear}
            onValueChange={(val) => handleChange('startYear', val)}
          >
            <SelectTrigger id="start-year">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-set">Not set</SelectItem>
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
            End Month
          </Label>
          <Select
            value={value.endMonth}
            onValueChange={(val) => handleChange('endMonth', val)}
            disabled={value.isCurrent}
          >
            <SelectTrigger id="end-month">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-set">Not set</SelectItem>
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
            End Year
          </Label>
          <Select
            value={value.endYear}
            onValueChange={(val) => handleChange('endYear', val)}
            disabled={value.isCurrent}
          >
            <SelectTrigger id="end-year">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-set">Not set</SelectItem>
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
            checked={value.isCurrent}
            onCheckedChange={(checked) => handleChange('isCurrent', checked as boolean)}
          />
          <Label htmlFor="is-current" className="text-sm font-normal cursor-pointer">
            {currentLabel}
          </Label>
        </div>
      )}
    </div>
  )
}
