import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Cake, Plus, X } from "lucide-react"
import { useState, useEffect } from "react"
import { format, parse, isValid } from "date-fns"
import { cn } from "@/lib/utils"

interface UserProfile {
  id: string
  name: string | null
  username: string | null
  avatar_url: string | null
  about: string | null
  telegram_username: string | null
  profile_type: string | null
  badge: string[] | null
  contact_info: any[] | null
  birthday: string | null
  birthday_visibility: 'full' | 'month_day' | 'year' | null
}

interface BirthdaySectionProps {
  user: UserProfile
  isOwnProfile: boolean
  isEditing: boolean
  onUpdateProfile: (updates: Partial<UserProfile>) => void
}

export function BirthdaySection({ user, isOwnProfile, isEditing, onUpdateProfile }: BirthdaySectionProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string>('')
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [visibility, setVisibility] = useState<'full' | 'month_day' | 'year'>('full')

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ]

  const getDaysInMonth = (month: string, year: string) => {
    if (!month || !year) return 31
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate()
    return daysInMonth
  }

  const generateYears = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year.toString())
    }
    return years
  }

  const calculateAge = (birthDate: string) => {
    const parsedDate = parse(birthDate, 'yyyy-MM-dd', new Date())
    if (!isValid(parsedDate)) return null
    
    const today = new Date()
    let age = today.getFullYear() - parsedDate.getFullYear()
    const monthDiff = today.getMonth() - parsedDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < parsedDate.getDate())) {
      age--
    }
    
    return age
  }

  useEffect(() => {
    if (user.birthday) {
      const parsedDate = parse(user.birthday, 'yyyy-MM-dd', new Date())
      if (isValid(parsedDate)) {
        setSelectedDay(format(parsedDate, 'dd'))
        setSelectedMonth(format(parsedDate, 'MM'))
        setSelectedYear(format(parsedDate, 'yyyy'))
      }
    }
    if (user.birthday_visibility) {
      setVisibility(user.birthday_visibility)
    }
  }, [user.birthday, user.birthday_visibility])

  const formatBirthdayDisplay = (date: string | null, visibility: string | null) => {
    if (!date) return null

    const parsedDate = parse(date, 'yyyy-MM-dd', new Date())
    if (!isValid(parsedDate)) return null

    const age = calculateAge(date)
    const ageText = age !== null ? ` (${age} years old)` : ''

    switch (visibility) {
      case 'month_day':
        return format(parsedDate, 'MMMM d') + ageText
      case 'year':
        return format(parsedDate, 'yyyy') + (age !== null ? ` (${age} years old)` : '')
      case 'full':
      default:
        return format(parsedDate, 'MMMM d, yyyy') + ageText
    }
  }

  const handleAddBirthday = () => {
    if (!selectedDay || !selectedMonth || !selectedYear) return

    const formattedDate = `${selectedYear}-${selectedMonth}-${selectedDay}`
    onUpdateProfile({
      birthday: formattedDate,
      birthday_visibility: visibility
    })
    setShowAddForm(false)
  }

  const handleRemoveBirthday = () => {
    onUpdateProfile({
      birthday: null,
      birthday_visibility: null
    })
    setSelectedDay('')
    setSelectedMonth('')
    setSelectedYear('')
    setVisibility('full')
  }

  const handleVisibilityChange = (newVisibility: 'full' | 'month_day' | 'year') => {
    setVisibility(newVisibility)
    if (user.birthday) {
      onUpdateProfile({
        birthday_visibility: newVisibility
      })
    }
  }

  const handleDayChange = (day: string) => {
    setSelectedDay(day)
    if (selectedMonth && selectedYear) {
      const formattedDate = `${selectedYear}-${selectedMonth}-${day}`
      onUpdateProfile({
        birthday: formattedDate
      })
    }
  }

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month)
    
    // Adjust day if it's invalid for the new month
    if (selectedDay && selectedYear) {
      const maxDays = getDaysInMonth(month, selectedYear)
      const currentDay = parseInt(selectedDay)
      if (currentDay > maxDays) {
        setSelectedDay(maxDays.toString().padStart(2, '0'))
      }
    }
    
    if (selectedDay && selectedYear) {
      const adjustedDay = selectedDay && parseInt(selectedDay) > getDaysInMonth(month, selectedYear) 
        ? getDaysInMonth(month, selectedYear).toString().padStart(2, '0')
        : selectedDay
      const formattedDate = `${selectedYear}-${month}-${adjustedDay}`
      onUpdateProfile({
        birthday: formattedDate
      })
    }
  }

  const handleYearChange = (year: string) => {
    setSelectedYear(year)
    
    // Adjust day if it's invalid for the new year (leap year consideration)
    if (selectedDay && selectedMonth) {
      const maxDays = getDaysInMonth(selectedMonth, year)
      const currentDay = parseInt(selectedDay)
      if (currentDay > maxDays) {
        setSelectedDay(maxDays.toString().padStart(2, '0'))
      }
    }
    
    if (selectedDay && selectedMonth) {
      const adjustedDay = selectedDay && parseInt(selectedDay) > getDaysInMonth(selectedMonth, year)
        ? getDaysInMonth(selectedMonth, year).toString().padStart(2, '0')
        : selectedDay
      const formattedDate = `${year}-${selectedMonth}-${adjustedDay}`
      onUpdateProfile({
        birthday: formattedDate
      })
    }
  }

  const renderViewMode = () => {
    const displayValue = formatBirthdayDisplay(user.birthday, user.birthday_visibility)

    if (!displayValue) {
      return (
        <p className="text-muted-foreground italic text-sm">
          No birthday added
        </p>
      )
    }

    return ( 
      <div className="flex items-center gap-2 border rounded-lg p-3 hover:bg-muted/50 transition-colors">
        <span className="text-foreground">{displayValue}</span>
      </div>
    )
  }

  const renderEditMode = () => {
    if (!user.birthday && !showAddForm) {
      return null
    }

    if (user.birthday) {
      const previewDate = selectedDay && selectedMonth && selectedYear 
        ? `${selectedYear}-${selectedMonth}-${selectedDay}`
        : user.birthday

      return (
        <div className="space-y-4">
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-4">
                <Label>Birthday</Label>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="day" className="text-xs text-muted-foreground">Day</Label>
                    <Select value={selectedDay} onValueChange={handleDayChange}>
                      <SelectTrigger id="day">
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => {
                          const day = (i + 1).toString().padStart(2, '0')
                          return (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="month" className="text-xs text-muted-foreground">Month</Label>
                    <Select value={selectedMonth} onValueChange={handleMonthChange}>
                      <SelectTrigger id="month">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="year" className="text-xs text-muted-foreground">Year</Label>
                    <Select value={selectedYear} onValueChange={handleYearChange}>
                      <SelectTrigger id="year">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
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
                      Are you sure you want to delete your birthday? This action cannot be undone.
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
              <Select
                value={visibility}
                onValueChange={handleVisibilityChange}
              >
                <SelectTrigger id="visibility" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Date with Age (Month Day, Year + Age)</SelectItem>
                  <SelectItem value="month_day">Month and Day with Age</SelectItem>
                  <SelectItem value="year">Year with Age</SelectItem>
                </SelectContent>
              </Select>
              {selectedDay && selectedMonth && selectedYear && (
                <p className="text-sm text-muted-foreground mt-2">
                  Preview: {formatBirthdayDisplay(previewDate, visibility)}
                </p>
              )}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 space-y-4">
        <h4 className="font-medium">Add Birthday</h4>

        <div>
          <Label>Select Date</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div>
              <Label htmlFor="new-day" className="text-xs text-muted-foreground">Day</Label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger id="new-day">
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => {
                    const day = (i + 1).toString().padStart(2, '0')
                    return (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="new-month" className="text-xs text-muted-foreground">Month</Label>
              <Select value={selectedMonth} onValueChange={(month) => {
                setSelectedMonth(month)
                // Reset day if it's invalid for the new month
                if (selectedDay && selectedYear) {
                  const maxDays = getDaysInMonth(month, selectedYear)
                  const currentDay = parseInt(selectedDay)
                  if (currentDay > maxDays) {
                    setSelectedDay(maxDays.toString().padStart(2, '0'))
                  }
                }
              }}>
                <SelectTrigger id="new-month">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="new-year" className="text-xs text-muted-foreground">Year</Label>
              <Select value={selectedYear} onValueChange={(year) => {
                setSelectedYear(year)
                // Reset day if it's invalid for the new year (leap year)
                if (selectedDay && selectedMonth) {
                  const maxDays = getDaysInMonth(selectedMonth, year)
                  const currentDay = parseInt(selectedDay)
                  if (currentDay > maxDays) {
                    setSelectedDay(maxDays.toString().padStart(2, '0'))
                  }
                }
              }}>
                <SelectTrigger id="new-year">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
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
          <Select value={visibility} onValueChange={(value: 'full' | 'month_day' | 'year') => setVisibility(value)}>
            <SelectTrigger id="new-visibility" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Date with Age (Month Day, Year + Age)</SelectItem>
              <SelectItem value="month_day">Month and Day with Age</SelectItem>
              <SelectItem value="year">Year with Age</SelectItem>
            </SelectContent>
          </Select>
          {selectedDay && selectedMonth && selectedYear && (
            <p className="text-sm text-muted-foreground mt-2">
              Preview: {formatBirthdayDisplay(`${selectedYear}-${selectedMonth}-${selectedDay}`, visibility)}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={handleAddBirthday} disabled={!selectedDay || !selectedMonth || !selectedYear}>
            Add Birthday
          </Button>
          <Button variant="outline" onClick={() => setShowAddForm(false)}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

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
              Add Birthday
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? renderEditMode() : renderViewMode()}
      </CardContent>
    </Card>
  )
}