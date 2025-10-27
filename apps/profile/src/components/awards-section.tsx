import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Award, Plus, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import { SectionCard } from "@/components/shared/SectionCard"
import { SortableListControls } from "@/components/shared/SortableListControls"
import { InlineEditActions } from "@/components/shared/InlineEditActions"
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog"
import { EmptyState } from "@/components/shared/EmptyState"

interface AwardType {
  id: number
  title: string
  issuer: string
  date: string
  description: string
}

interface AwardsSectionProps {
  isEditing: boolean
}

export function AwardsSection({ isEditing }: AwardsSectionProps) {
  const [awards, setAwards] = useState<AwardType[]>([])
  const [showAddAwardForm, setShowAddAwardForm] = useState(false)
  const [editingAward, setEditingAward] = useState<number | null>(null)
  const [newAward, setNewAward] = useState({
    title: '',
    issuer: '',
    date: '',
    description: ''
  })
  const [editForm, setEditForm] = useState({
    title: '',
    issuer: '',
    date: '',
    description: ''
  })

  const moveUp = (index: number) => {
    if (index === 0) return

    const newAwards = [...awards]
    const temp = newAwards[index - 1]
    newAwards[index - 1] = newAwards[index]
    newAwards[index] = temp

    setAwards(newAwards)
  }

  const moveDown = (index: number) => {
    if (index === awards.length - 1) return

    const newAwards = [...awards]
    const temp = newAwards[index + 1]
    newAwards[index + 1] = newAwards[index]
    newAwards[index] = temp

    setAwards(newAwards)
  }

  const addAward = () => {
    if (newAward.title && newAward.issuer) {
      setAwards(prev => [...prev, {
        id: Date.now(),
        ...newAward
      }])
      setNewAward({
        title: '',
        issuer: '',
        date: '',
        description: ''
      })
      setShowAddAwardForm(false)
    }
  }

  const removeAward = (id: number) => {
    setAwards(prev => prev.filter(award => award.id !== id))
  }

  const startEditing = (award: AwardType) => {
    setEditingAward(award.id)
    setEditForm({
      title: award.title,
      issuer: award.issuer,
      date: award.date,
      description: award.description
    })
  }

  const saveEdit = (id: number) => {
    setAwards(prev => prev.map(award =>
      award.id === id ? { ...award, ...editForm } : award
    ))
    setEditingAward(null)
  }

  const cancelEdit = () => {
    setEditingAward(null)
    setEditForm({
      title: '',
      issuer: '',
      date: '',
      description: ''
    })
  }

  return (
    <SectionCard
      title="Awards and Achievements"
      icon={Award}
      isEditing={isEditing}
      onAddClick={() => setShowAddAwardForm(true)}
      showAddButton={!showAddAwardForm}
      className="mb-8"
    >
        <div className="space-y-6">
          {awards.length === 0 && !isEditing && (
            <EmptyState
              message="No awards or achievements added yet."
              icon={Award}
            />
          )}

          {awards.map((award, index) => (
            <div key={award.id} className="border-l-2 border-primary/20 pl-4">
              {editingAward === award.id ? (
                <div className="space-y-4 border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <SortableListControls
                      index={index}
                      totalItems={awards.length}
                      onMoveUp={() => moveUp(index)}
                      onMoveDown={() => moveDown(index)}
                    />
                    <InlineEditActions
                      onSave={() => saveEdit(award.id)}
                      onCancel={cancelEdit}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-award-title">Award Title</Label>
                      <Input
                        id="edit-award-title"
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Best Developer Award"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-award-issuer">Issuer/Organization</Label>
                      <Input
                        id="edit-award-issuer"
                        value={editForm.issuer}
                        onChange={(e) => setEditForm(prev => ({ ...prev, issuer: e.target.value }))}
                        placeholder="Tech Company Inc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-award-date">Date</Label>
                      <Input
                        id="edit-award-date"
                        value={editForm.date}
                        onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                        placeholder="2024"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-award-description">Description</Label>
                    <Textarea
                      id="edit-award-description"
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the achievement..."
                      rows={2}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className="font-semibold text-lg">{award.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{award.date}</span>
                      {isEditing && (
                        <div className="flex gap-1">
                          <SortableListControls
                            index={index}
                            totalItems={awards.length}
                            onMoveUp={() => moveUp(index)}
                            onMoveDown={() => moveDown(index)}
                          />
                          <Button size="sm" variant="ghost" onClick={() => startEditing(award)} className="h-7 w-7 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <DeleteConfirmationDialog
                            title="Delete Award"
                            description="Are you sure you want to delete this award? This action cannot be undone."
                            onConfirm={() => removeAward(award.id)}
                            triggerButton={
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-primary font-medium mb-2">{award.issuer}</p>
                  <p className="text-muted-foreground">{award.description}</p>
                </>
              )}
            </div>
          ))}

          {isEditing && showAddAwardForm && (
            <div className="border-l-2 border-dashed border-primary/20 pl-4 space-y-4">
              <h3 className="font-semibold text-lg">Add</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="award-title">Award Title</Label>
                  <Input
                    id="award-title"
                    value={newAward.title}
                    onChange={(e) => setNewAward(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Best Developer Award"
                  />
                </div>
                <div>
                  <Label htmlFor="award-issuer">Issuer/Organization</Label>
                  <Input
                    id="award-issuer"
                    value={newAward.issuer}
                    onChange={(e) => setNewAward(prev => ({ ...prev, issuer: e.target.value }))}
                    placeholder="Tech Company Inc."
                  />
                </div>
                <div>
                  <Label htmlFor="award-date">Date</Label>
                  <Input
                    id="award-date"
                    value={newAward.date}
                    onChange={(e) => setNewAward(prev => ({ ...prev, date: e.target.value }))}
                    placeholder="2024"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="award-description">Description</Label>
                <Textarea
                  id="award-description"
                  value={newAward.description}
                  onChange={(e) => setNewAward(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the achievement..."
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addAward}>Add</Button>
                <Button variant="outline" onClick={() => setShowAddAwardForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
    </SectionCard>
  )
}
