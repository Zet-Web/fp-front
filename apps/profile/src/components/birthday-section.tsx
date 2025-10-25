import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, CreditCard as Edit, X } from "lucide-react"
import { useState } from "react"
import { BirthdayInfo } from "@/types/profile"

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
  birthday: BirthdayInfo | null
}

interface BirthdaySectionProps {
  user: UserProfile
  isOwnProfile: boolean
  isEditing: boolean
  onUpdateProfile: (updates: Partial<UserProfile>) => void
}

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" }
]

export function BirthdaySection({ user, isOwnProfile, isEditing, onUpdateProfile }: BirthdaySectionProps) {
  const [showAddForm, setShowAddForm] = useState(false)

  const formatBirthday = (birthday: BirthdayInfo | null): string => {
    if (!birthday) return ""

    const parts: string[] = []
    
    if (birthday.month) {
      const monthName = MONTHS.find(m => m.value === birthday.month)?.label || ""
      if (birthday.day) {
        parts.push(`${monthName} ${birthday.day}`)
      } else {
        parts.push(monthName)
      }
    } else if (birthday.day) {
      parts.push(`Day ${birthday.day}`)
    }

    if (birthday.year) {
      if (parts.length > 0) {
        parts.push(`${birthday.year}`)
      } else {
        parts.push(`${birthday.year}`)
      }
    }

    return parts.join(", ")
  }

  const handleBirthdayChange = (field: keyof BirthdayInfo, value: any) => {
    const currentBirthday = user.birthday || { visibility: 'public' }
    const updatedBirthday = { ...currentBirthday, [field]: value }
    
    // Remove undefined values to keep the object clean
    if (value === undefined || value === "" || value === null) {
      delete updatedBirthday[field as keyof BirthdayInfo]
    }
    
    onUpdateProfile({ birthday: updatedBirthday })
  }

  const removeBirthday = () => {
    onUpdateProfile({ birthday: null })
    setShowAddForm(false)
  }

  const addBirthday = () => {
    onUpdateProfile({ 
      birthday: { 
        visibility: 'public' 
      } 
    })
    setShowAddForm(true)
  }

  const renderViewMode = () => {
    if (!user.birthday) {
      return (
        <p className="text-muted-foreground italic text-sm">
          No birthday information available
        </p>
      )
    }

    const formattedBirthday = formatBirthday(user.birthday)
    if (!formattedBirthday) {
      return (
        <p className="text-muted-foreground italic text-sm">
          No birthday information available
        </p>
      )
    }

    return (
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{formattedBirthday}</p>
          <p className="text-sm text-muted-foreground capitalize">
            Visibility: {user.birthday.visibility}
          </p>
        </div>
      </div>
    )
  }

  const renderEditMode = () => {
    if (!user.birthday && !showAddForm) {
      return (
        <div className="text-center py-4">
          <Button
            variant="outline"
            onClick={addBirthday}
            className="gap-2"
          >
            <Calendar className="w-4 h-4" />
            Add Birthday
          </Button>
        </div>
      )
    }

    const birthday = user.birthday || { visibility: 'public' }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="birthday-day">Day (Optional)</Label>
            <Input
              id="birthday-day"
              type="number"
              min="1"
              max="31"
              value={birthday.day || ''}
              onChange={(e) => handleBirthdayChange('day', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="15"
            />
          </div>

          <div>
            <Label htmlFor="birthday-month">Month (Optional)</Label>
            <Select
              value={birthday.month?.toString() || ''}
              onValueChange={(value) => handleBirthdayChange('month', value ? parseInt(value) : undefined)}
            >
              <SelectTrigger id="birthday-month">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No month</SelectItem>
                {MONTHS.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="birthday-year">Year (Optional)</Label>
            <Input
              id="birthday-year"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={birthday.year || ''}
              onChange={(e) => handleBirthdayChange('year', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="1990"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="birthday-visibility">Visibility</Label>
          <Select
            value={birthday.visibility}
            onValueChange={(value) => handleBirthdayChange('month', value === 'none' ? undefined : parseInt(value))}
          >
            <SelectTrigger id="birthday-visibility">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No month</SelectItem>
              <SelectItem value="friends">Friends only</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={removeBirthday}
            className="gap-2 text-destructive hover:text-destructive"
          >
            <X className="w-4 h-4" />
            Remove Birthday
          </Button>
        </div>

        {birthday.day || birthday.month || birthday.year ? (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">Preview:</p>
            <p className="text-sm text-muted-foreground">
              {formatBirthday(birthday) || "No date information"}
            </p>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Birthday
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? renderEditMode() : renderViewMode()}
      </CardContent>
    </Card>
  )
}