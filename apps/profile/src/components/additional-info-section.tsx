import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { FileText, Plus, X, ChevronUp, ChevronDown, Edit, Check } from "lucide-react"
import { useState, useEffect } from "react"

interface AdditionalInfoEntry {
  id: string
  value: string
  order: number
}

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
  birthday: string | null
  birthday_visibility: 'full' | 'month_day' | 'year' | 'day_month' | 'day' | 'month' | null
  additional_info: AdditionalInfoEntry[] | null
}

interface AdditionalInfoSectionProps {
  user: UserProfile
  isOwnProfile: boolean
  isEditing: boolean
  onUpdateProfile: (updates: Partial<UserProfile>) => void
}

export function AdditionalInfoSection({ user, isOwnProfile, isEditing, onUpdateProfile }: AdditionalInfoSectionProps) {
  const [infoEntries, setInfoEntries] = useState<AdditionalInfoEntry[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEntry, setNewEntry] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')

  useEffect(() => {
    const entries = (user.additional_info || []).sort((a, b) => a.order - b.order)
    setInfoEntries(entries)
  }, [user.additional_info])

  const updateInfoEntries = (updatedEntries: AdditionalInfoEntry[]) => {
    setInfoEntries(updatedEntries)
    onUpdateProfile({ additional_info: updatedEntries })
  }

  const moveUp = (index: number) => {
    if (index === 0) return

    const newEntries = [...infoEntries]
    const temp = newEntries[index - 1]
    newEntries[index - 1] = newEntries[index]
    newEntries[index] = temp

    const reorderedEntries = newEntries.map((entry, idx) => ({
      ...entry,
      order: idx
    }))

    updateInfoEntries(reorderedEntries)
  }

  const moveDown = (index: number) => {
    if (index === infoEntries.length - 1) return

    const newEntries = [...infoEntries]
    const temp = newEntries[index + 1]
    newEntries[index + 1] = newEntries[index]
    newEntries[index] = temp

    const reorderedEntries = newEntries.map((entry, idx) => ({
      ...entry,
      order: idx
    }))

    updateInfoEntries(reorderedEntries)
  }

  const addEntry = () => {
    if (!newEntry.trim()) return

    const entry: AdditionalInfoEntry = {
      id: Date.now().toString(),
      value: newEntry.trim(),
      order: infoEntries.length
    }

    const updatedEntries = [...infoEntries, entry]
    updateInfoEntries(updatedEntries)

    setNewEntry('')
    setShowAddForm(false)
  }

  const startEditing = (entry: AdditionalInfoEntry) => {
    setEditingId(entry.id)
    setEditingValue(entry.value)
  }

  const saveEdit = (id: string) => {
    if (!editingValue.trim()) return

    const updatedEntries = infoEntries.map(entry =>
      entry.id === id ? { ...entry, value: editingValue.trim() } : entry
    )
    updateInfoEntries(updatedEntries)
    setEditingId(null)
    setEditingValue('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingValue('')
  }

  const removeEntry = (id: string) => {
    const updatedEntries = infoEntries.filter(entry => entry.id !== id)
    const reorderedEntries = updatedEntries.map((entry, idx) => ({
      ...entry,
      order: idx
    }))

    updateInfoEntries(reorderedEntries)
  }

  const renderViewMode = () => {
    if (infoEntries.length === 0) {
      return (
        <p className="text-muted-foreground italic text-sm">
          No additional information available
        </p>
      )
    }

    return (
      <div className="space-y-2">
        {infoEntries.map((entry) => (
          <div key={entry.id} className="flex items-center gap-2 border rounded-lg p-3 hover:bg-muted/50 transition-colors">
            <span className="text-foreground flex-1">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  const renderEditMode = () => {
    return (
      <div className="space-y-4">
        {infoEntries.map((entry, index) => (
          <div key={entry.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
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
                  disabled={index === infoEntries.length - 1}
                  className="h-7 w-7 p-0"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-1">
                {editingId === entry.id ? (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => saveEdit(entry.id)}
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
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEditing(entry)}
                      className="h-7 w-7 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive h-7 w-7 p-0">
                          <X className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this entry? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeEntry(entry.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>

            <div>
              {editingId === entry.id ? (
                <Input
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveEdit(entry.id)
                    } else if (e.key === 'Escape') {
                      cancelEdit()
                    }
                  }}
                  placeholder="Enter information"
                  autoFocus
                />
              ) : (
                <p className="text-foreground">{entry.value}</p>
              )}
            </div>
          </div>
        ))}

        {showAddForm && (
          <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Add</h4>

            <div>
              <Label htmlFor="new-info">Information</Label>
              <Input
                id="new-info"
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addEntry()
                  } else if (e.key === 'Escape') {
                    setShowAddForm(false)
                  }
                }}
                placeholder="Enter additional information"
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={addEntry} disabled={!newEntry.trim()}>
                Add
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
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
              Add
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
