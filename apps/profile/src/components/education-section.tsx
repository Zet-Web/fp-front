import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { GraduationCap, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import { SectionCard } from "@/components/shared/SectionCard"
import { SortableListControls } from "@/components/shared/SortableListControls"
import { InlineEditActions } from "@/components/shared/InlineEditActions"
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog"
import { PeriodSelector, PeriodData } from "@/components/shared/PeriodSelector"
import { DatabaseDropdown } from "@/components/shared/DatabaseDropdown"
import { SearchableDropdown } from "@/components/shared/SearchableDropdown"
import { formatPeriod } from "@/lib/date-utils"

interface Education {
  id: number
  degree: string
  school: string
  period: string
  start_month?: string
  start_year?: string
  end_month?: string
  end_year?: string
  is_current?: boolean
  description: string
}

const initialEducation = [
  {
    id: 1,
    degree: "Bachelor of Science in Computer Science",
    school: "Tech University",
    period: "2016 - 2020",
    description: "Graduated Magna Cum Laude with focus on Software Engineering and Web Development."
  },
  {
    id: 2,
    degree: "AWS Certified Solutions Architect",
    school: "Amazon Web Services",
    period: "2021",
    description: "Professional certification in cloud architecture and AWS services."
  }
]

interface EducationSectionProps {
  isEditing: boolean
}

export function EducationSection({ isEditing }: EducationSectionProps) {
  const [education, setEducation] = useState(initialEducation)
  const [editingEducation, setEditingEducation] = useState<number | null>(null)
  const [showAddEducationForm, setShowAddEducationForm] = useState(false)
  const [newEducation, setNewEducation] = useState({
    degree: '',
    school: '',
    period: '',
    start_month: 'not-set',
    start_year: 'not-set',
    end_month: 'not-set',
    end_year: 'not-set',
    is_current: false,
    description: ''
  })
  const [editForm, setEditForm] = useState({
    degree: '',
    school: '',
    period: '',
    start_month: 'not-set',
    start_year: 'not-set',
    end_month: 'not-set',
    end_year: 'not-set',
    is_current: false,
    description: ''
  })

  const formatPeriodData = (edu: Education) => {
    return formatPeriod({
      startMonth: edu.start_month,
      startYear: edu.start_year,
      endMonth: edu.end_month,
      endYear: edu.end_year,
      isCurrent: edu.is_current
    }) || edu.period || ''
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newEducation = [...education]
    ;[newEducation[index - 1], newEducation[index]] = [newEducation[index], newEducation[index - 1]]
    setEducation(newEducation)
  }

  const moveDown = (index: number) => {
    if (index === education.length - 1) return
    const newEducation = [...education]
    ;[newEducation[index], newEducation[index + 1]] = [newEducation[index + 1], newEducation[index]]
    setEducation(newEducation)
  }

  const addEducation = () => {
    if (newEducation.degree && newEducation.school) {
      setEducation(prev => [...prev, {
        id: Date.now(),
        ...newEducation
      }])
      setNewEducation({
        degree: '',
        school: '',
        period: '',
        start_month: 'not-set',
        start_year: 'not-set',
        end_month: 'not-set',
        end_year: 'not-set',
        is_current: false,
        description: ''
      })
      setShowAddEducationForm(false)
    }
  }

  const removeEducation = (id: number) => {
    setEducation(prev => prev.filter(edu => edu.id !== id))
  }

  const startEditing = (edu: Education) => {
    setEditingEducation(edu.id)
    setEditForm({
      degree: edu.degree,
      school: edu.school,
      period: edu.period,
      start_month: edu.start_month || 'not-set',
      start_year: edu.start_year || 'not-set',
      end_month: edu.end_month || 'not-set',
      end_year: edu.end_year || 'not-set',
      is_current: edu.is_current || false,
      description: edu.description
    })
  }

  const saveEdit = (id: number) => {
    setEducation(prev => prev.map(edu =>
      edu.id === id ? { ...edu, ...editForm } : edu
    ))
    setEditingEducation(null)
  }

  const cancelEdit = () => {
    setEditingEducation(null)
  }

  const handlePeriodChange = (period: PeriodData, isNew: boolean) => {
    if (isNew) {
      setNewEducation(prev => ({ ...prev, ...period }))
    } else {
      setEditForm(prev => ({ ...prev, ...period }))
    }
  }

  return (
    <SectionCard
      title="Education & Certifications"
      icon={GraduationCap}
      isEditing={isEditing}
      onAddClick={() => setShowAddEducationForm(true)}
      showAddButton={!showAddEducationForm}
    >
      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={edu.id} className="border-l-2 border-primary/20 pl-4">
            {editingEducation === edu.id ? (
              <div className="space-y-4 border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <SortableListControls
                    index={index}
                    totalItems={education.length}
                    onMoveUp={() => moveUp(index)}
                    onMoveDown={() => moveDown(index)}
                  />
                  <InlineEditActions
                    onSave={() => saveEdit(edu.id)}
                    onCancel={cancelEdit}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DatabaseDropdown
                    table="list_study_field"
                    valueColumn="id"
                    labelColumn="name_ru"
                    value={editForm.degree}
                    onChange={(_, label) => setEditForm(prev => ({ ...prev, degree: label }))}
                    label="Degree"
                    placeholder="Select degree..."
                    searchPlaceholder="Search degrees..."
                    orderBy="name_ru"
                  />

                  <SearchableDropdown
                    table="list_university"
                    searchColumns={['name', 'name_ru']}
                    valueColumn="id"
                    labelColumn="name_ru"
                    value={editForm.school}
                    onChange={(_, label) => setEditForm(prev => ({ ...prev, school: label }))}
                    label="School/Institution"
                    placeholder="Select university..."
                    searchPlaceholder="Type at least 3 characters..."
                  />
                </div>

                <PeriodSelector
                  value={{
                    startMonth: editForm.start_month,
                    startYear: editForm.start_year,
                    endMonth: editForm.end_month,
                    endYear: editForm.end_year,
                    isCurrent: editForm.is_current
                  }}
                  onChange={(period) => handlePeriodChange(period, false)}
                  currentLabel="I currently study here"
                />

                <div>
                  <Label htmlFor="edit-edu-description">Description</Label>
                  <Textarea
                    id="edit-edu-description"
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Additional details about your education..."
                    rows={2}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="font-semibold text-lg">{edu.degree}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{formatPeriodData(edu)}</span>
                    {isEditing && (
                      <div className="flex gap-1">
                        <SortableListControls
                          index={index}
                          totalItems={education.length}
                          onMoveUp={() => moveUp(index)}
                          onMoveDown={() => moveDown(index)}
                        />
                        <Button size="sm" variant="ghost" onClick={() => startEditing(edu)} className="h-7 w-7 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <DeleteConfirmationDialog
                          title="Delete Education"
                          description="Are you sure you want to delete this education entry? This action cannot be undone."
                          onConfirm={() => removeEducation(edu.id)}
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
                <p className="text-primary font-medium mb-2">{edu.school}</p>
                <p className="text-muted-foreground">{edu.description}</p>
              </>
            )}
          </div>
        ))}

        {isEditing && showAddEducationForm && (
          <div className="border-l-2 border-dashed border-primary/20 pl-4 space-y-4">
            <h3 className="font-semibold text-lg">Add</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DatabaseDropdown
                table="list_study_field"
                valueColumn="id"
                labelColumn="name_ru"
                value={newEducation.degree}
                onChange={(_, label) => setNewEducation(prev => ({ ...prev, degree: label }))}
                label="Faculty"
                placeholder="Select degree..."
                searchPlaceholder="Search degrees..."
                orderBy="name_ru"
              />

              <SearchableDropdown
                table="list_university"
                searchColumns={['name', 'name_ru']}
                valueColumn="id"
                labelColumn="name_ru"
                value={newEducation.school}
                onChange={(_, label) => setNewEducation(prev => ({ ...prev, school: label }))}
                label="University"
                placeholder="Select university..."
                searchPlaceholder="Type at least 3 characters..."
              />
            </div>

            <PeriodSelector
              value={{
                startMonth: newEducation.start_month,
                startYear: newEducation.start_year,
                endMonth: newEducation.end_month,
                endYear: newEducation.end_year,
                isCurrent: newEducation.is_current
              }}
              onChange={(period) => handlePeriodChange(period, true)}
              currentLabel="I currently study here"
            />

            <div>
              <Label htmlFor="edu-description">Description</Label>
              <Textarea
                id="edu-description"
                value={newEducation.description}
                onChange={(e) => setNewEducation(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional details about your education..."
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addEducation}>Add</Button>
              <Button variant="outline" onClick={() => setShowAddEducationForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  )
}
