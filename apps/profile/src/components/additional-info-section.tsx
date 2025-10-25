import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { FileText, Plus, X, Calendar, ChevronUp, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { BirthdayInfo, AdditionalInfoEntry } from "@/types/profile"

interface UserProfile {
  id: string
  name: string | null
  username: string | null
  email?: string
  avatar_url: string | null
  about: string | null
  telegram_username: string | null
  profile_type: string | null
  badge: string[] | null
  birthday: BirthdayInfo | null
  additional_info: AdditionalInfoEntry[] | null
}

interface AdditionalInfoSectionProps {
  user: UserProfile
  isOwnProfile: boolean
  isEditing: boolean
  onUpdateProfile: (updates: Partial<UserProfile>) => void
}

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
]

const INFO_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'link', label: 'Link' },
  { value: 'skill', label: 'Skill' },
  { value: 'interest', label: 'Interest' },
  { value: 'language', label: 'Language' },
  { value: 'custom', label: 'Custom' }
]

export function AdditionalInfoSection({ user, isOwnProfile, isEditing, onUpdateProfile }: AdditionalInfoSectionProps) {
  const [birthday, setBirthday] = useState<BirthdayInfo>(user.birthday || { visibility: 'public' })
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfoEntry[]>(user.additional_info || [])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEntry, setNewEntry] = useState<Partial<AdditionalInfoEntry>>({
    type: 'text',
    label: '',
    value: ''
  })

  useEffect(() => {
    setBirthday(user.birthday || { visibility: 'public' })
    setAdditionalInfo(user.additional_info || [])
  }, [user.birthday, user.additional_info])

  const handleAboutChange = (value: string) => {
    onUpdateProfile({ about: value })
  }

  const handleBirthdayChange = (field: keyof BirthdayInfo, value: any) => {
    const updatedBirthday = { ...birthday, [field]: value }
    setBirthday(updatedBirthday)
    onUpdateProfile({ birthday: updatedBirthday })
  }

  const addInfoEntry = () => {
    if (!newEntry.label?.trim() || !newEntry.value?.trim()) return

    const entry: AdditionalInfoEntry = {
      id: Date.now().toString(),
      type: newEntry.type as AdditionalInfoEntry['type'],
      label: newEntry.label.trim(),
      value: newEntry.value.trim(),
      order: additionalInfo.length
    }

    const updatedInfo = [...additionalInfo, entry]
    setAdditionalInfo(updatedInfo)
    onUpdateProfile({ additional_info: updatedInfo })

    setNewEntry({ type: 'text', label: '', value: '' })
    setShowAddForm(false)
  }

  const removeInfoEntry = (index: number) => {
    const updatedInfo = additionalInfo.filter((_, i) => i !== index)
    const reorderedInfo = updatedInfo.map((entry, idx) => ({ ...entry, order: idx }))
    setAdditionalInfo(reorderedInfo)
    onUpdateProfile({ additional_info: reorderedInfo })
  }

  const moveInfoEntry = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === additionalInfo.length - 1)) {
      return
    }

    const newInfo = [...additionalInfo]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const temp = newInfo[index]
    newInfo[index] = newInfo[targetIndex]
    newInfo[targetIndex] = temp

    const reorderedInfo = newInfo.map((entry, idx) => ({ ...entry, order: idx }))
    setAdditionalInfo(reorderedInfo)
    onUpdateProfile({ additional_info: reorderedInfo })
  }

  const formatBirthdayDisplay = () => {
    if (!birthday.day && !birthday.month && !birthday.year) return null

    const parts = []
    if (birthday.day && birthday.month) {
      const monthName = MONTHS.find(m => m.value === birthday.month)?.label
      parts.push(`${monthName} ${birthday.day}`)
    } else if (birthday.month) {
      const monthName = MONTHS.find(m => m.value === birthday.month)?.label
      parts.push(monthName)
    }
    
    if (birthday.year) {
      parts.push(birthday.year.toString())
    }

    return parts.join(', ')
  }

  return (
    <Card className="mb-8 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Additional Information
          </div>
          {isEditing && !showAddForm && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Info
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* About Section */}
        <div>
          <Label className="text-sm font-medium mb-2 block">About</Label>
          {isEditing && isOwnProfile ? (
            <Textarea
              value={user.about || ''}
              onChange={(e) => handleAboutChange(e.target.value)}
              className="resize-none"
              placeholder="Tell others about yourself..."
              rows={4}
            />
          ) : (
            <p className="text-muted-foreground leading-relaxed">
              {user.about || (isOwnProfile ? 'Add a bio to tell others about yourself.' : 'No bio available.')}
            </p>
          )}
        </div>

        {/* Birthday Section */}
        <div>
          <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Birthday
          </Label>
          {isEditing && isOwnProfile ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <Label htmlFor="birthday-day" className="text-xs">Day</Label>
                  <Select
                    value={birthday.day?.toString() || ''}
                    onValueChange={(value) => handleBirthdayChange('day', value ? parseInt(value) : undefined)}
                  >
                    <SelectTrigger id="birthday-day">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Not set</SelectItem>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="birthday-month" className="text-xs">Month</Label>
                  <Select
                    value={birthday.month?.toString() || ''}
                    onValueChange={(value) => handleBirthdayChange('month', value ? parseInt(value) : undefined)}
                  >
                    <SelectTrigger id="birthday-month">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Not set</SelectItem>
                      {MONTHS.map(month => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="birthday-year" className="text-xs">Year</Label>
                  <Input
                    id="birthday-year"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={birthday.year || ''}
                    onChange={(e) => handleBirthdayChange('year', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Year"
                  />
                </div>
                <div>
                  <Label htmlFor="birthday-visibility" className="text-xs">Visibility</Label>
                  <Select
                    value={birthday.visibility}
                    onValueChange={(value) => handleBirthdayChange('visibility', value)}
                  >
                    <SelectTrigger id="birthday-visibility">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Friends only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              {formatBirthdayDisplay() || (isOwnProfile ? 'Add your birthday.' : 'Birthday not shared.')}
            </p>
          )}
        </div>

        {/* Additional Info Entries */}
        {additionalInfo.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-2 block">Additional Details</Label>
            <div className="space-y-2">
              {additionalInfo.map((entry, index) => (
                <div key={entry.id} className="flex items-center gap-2 p-3 border rounded-lg">
                  {isEditing && (
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveInfoEntry(index, 'up')}
                        disabled={index === 0}
                        className="h-6 w-6 p-0"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveInfoEntry(index, 'down')}
                        disabled={index === additionalInfo.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                  <div className="flex-1">
                    <span className="font-medium text-sm">{entry.label}:</span>
                    <span className="ml-2 text-muted-foreground">{entry.value}</span>
                  </div>
                  {isEditing && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive h-6 w-6 p-0">
                          <X className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Information</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this information entry?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeInfoEntry(index)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Info Form */}
        {isEditing && showAddForm && (
          <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Add Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="new-info-type">Type</Label>
                <Select
                  value={newEntry.type}
                  onValueChange={(value) => setNewEntry(prev => ({ ...prev, type: value as AdditionalInfoEntry['type'] }))}
                >
                  <SelectTrigger id="new-info-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INFO_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="new-info-label">Label</Label>
                <Input
                  id="new-info-label"
                  value={newEntry.label || ''}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g., Favorite Language"
                />
              </div>
              <div>
                <Label htmlFor="new-info-value">Value</Label>
                <Input
                  id="new-info-value"
                  value={newEntry.value || ''}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="e.g., JavaScript"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addInfoEntry} disabled={!newEntry.label?.trim() || !newEntry.value?.trim()}>
                Add
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}