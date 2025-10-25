import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Cake, Calendar as CalendarIcon, Plus, X } from "lucide-react"
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [visibility, setVisibility] = useState<'full' | 'month_day' | 'year'>('full')

  useEffect(() => {
    if (user.birthday) {
      const parsedDate = parse(user.birthday, 'yyyy-MM-dd', new Date())
      if (isValid(parsedDate)) {
        setSelectedDate(parsedDate)
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

    switch (visibility) {
      case 'month_day':
        return format(parsedDate, 'MMMM d')
      case 'year':
        return format(parsedDate, 'yyyy')
      case 'full':
      default:
        return format(parsedDate, 'MMMM d, yyyy')
    }
  }

  const handleAddBirthday = () => {
    if (!selectedDate) return

    const formattedDate = format(selectedDate, 'yyyy-MM-dd')
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
    setSelectedDate(undefined)
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
        <Cake className="w-4 h-4 text-primary flex-shrink-0" />
        <span className="text-foreground">{displayValue}</span>
      </div>
    )
  }

  const renderEditMode = () => {
    if (!user.birthday && !showAddForm) {
      return null
    }

    if (user.birthday) {
      return (
        <div className="space-y-4">
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <Label>Birthday</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-2",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date)
                          const formattedDate = format(date, 'yyyy-MM-dd')
                          onUpdateProfile({
                            birthday: formattedDate
                          })
                        }
                      }}
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive h-7 w-7 p-0 mt-6"
                onClick={handleRemoveBirthday}
              >
                <X className="w-4 h-4" />
              </Button>
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
                  <SelectItem value="full">Full Date (Month Day, Year)</SelectItem>
                  <SelectItem value="month_day">Month and Day Only</SelectItem>
                  <SelectItem value="year">Year Only</SelectItem>
                </SelectContent>
              </Select>
              {selectedDate && (
                <p className="text-sm text-muted-foreground mt-2">
                  Preview: {formatBirthdayDisplay(format(selectedDate, 'yyyy-MM-dd'), visibility)}
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal mt-2",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="new-visibility">Display As</Label>
          <Select value={visibility} onValueChange={(value: 'full' | 'month_day' | 'year') => setVisibility(value)}>
            <SelectTrigger id="new-visibility" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Date (Month Day, Year)</SelectItem>
              <SelectItem value="month_day">Month and Day Only</SelectItem>
              <SelectItem value="year">Year Only</SelectItem>
            </SelectContent>
          </Select>
          {selectedDate && (
            <p className="text-sm text-muted-foreground mt-2">
              Preview: {formatBirthdayDisplay(format(selectedDate, 'yyyy-MM-dd'), visibility)}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={handleAddBirthday} disabled={!selectedDate}>
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
