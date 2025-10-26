import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { GraduationCap, Plus, CreditCard as Edit, Trash2, ChevronUp, ChevronDown, Check, X, ChevronDown as ChevronDownIcon, Loader as Loader2 } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"

interface Education {
  id: number
  degree: string
  school: string
  period: string
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
    description: ''
  })
  const [editForm, setEditForm] = useState({
    degree: '',
    school: '',
    period: '',
    description: ''
  })

  // Study fields state
  const [studyFields, setStudyFields] = useState<{ id: number; name_ru: string }[]>([])
  const [isFetchingStudyFields, setIsFetchingStudyFields] = useState(false)
  const [newDegreeSearchInput, setNewDegreeSearchInput] = useState('')
  const [editDegreeSearchInput, setEditDegreeSearchInput] = useState('')
  const [openNewDegreeSelect, setOpenNewDegreeSelect] = useState(false)
  const [openEditDegreeSelect, setOpenEditDegreeSelect] = useState(false)

  // Universities state
  const [universitySearchQuery, setUniversitySearchQuery] = useState('')
  const [filteredUniversities, setFilteredUniversities] = useState<{ id: number; name_ru: string }[]>([])
  const [isFetchingUniversities, setIsFetchingUniversities] = useState(false)
  const [openNewUniversitySelect, setOpenNewUniversitySelect] = useState(false)
  const [openEditUniversitySelect, setOpenEditUniversitySelect] = useState(false)

  // Fetch study fields on component mount
  useEffect(() => {
    const fetchStudyFields = async () => {
      setIsFetchingStudyFields(true)
      try {
        const { data, error } = await supabase
          .from('list_study_field')
          .select('id, name_ru')
          .order('name_ru', { ascending: true })

        if (error) {
          console.error('Error fetching study fields:', error)
        } else {
          setStudyFields(data || [])
        }
      } catch (error) {
        console.error('Error fetching study fields:', error)
      } finally {
        setIsFetchingStudyFields(false)
      }
    }

    fetchStudyFields()
  }, [])

  // Debounced university search
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (universitySearchQuery.length >= 3) {
        setIsFetchingUniversities(true)
        try {
          const { data, error } = await supabase
            .from('list_university')
            .select('id, name_ru')
            .or(`name.ilike.%${universitySearchQuery}%,name_ru.ilike.%${universitySearchQuery}%`)
            .limit(50)

          if (error) {
            console.error('Error searching universities:', error)
          } else {
            setFilteredUniversities(data || [])
          }
        } catch (error) {
          console.error('Error searching universities:', error)
        } finally {
          setIsFetchingUniversities(false)
        }
      } else {
        setFilteredUniversities([])
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [universitySearchQuery])

  // Filter study fields based on search input
  const getFilteredStudyFields = useCallback((searchInput: string) => {
    if (!searchInput) return studyFields
    return studyFields.filter(field => 
      field.name_ru?.toLowerCase().includes(searchInput.toLowerCase())
    )
  }, [studyFields])

  const moveUp = (index: number) => {
    if (index === 0) return

    const newEducation = [...education]
    const temp = newEducation[index - 1]
    newEducation[index - 1] = newEducation[index]
    newEducation[index] = temp

    setEducation(newEducation)
  }

  const moveDown = (index: number) => {
    if (index === education.length - 1) return

    const newEducation = [...education]
    const temp = newEducation[index + 1]
    newEducation[index + 1] = newEducation[index]
    newEducation[index] = temp

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
      description: edu.description
    })
    setEditDegreeSearchInput('')
  }

  const saveEdit = (id: number) => {
    setEducation(prev => prev.map(edu =>
      edu.id === id ? { ...edu, ...editForm } : edu
    ))
    setEditingEducation(null)
  }

  const cancelEdit = () => {
    setEditingEducation(null)
    setEditForm({
      degree: '',
      school: '',
      period: '',
      description: ''
    })
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Education & Certifications
          </div>
          {isEditing && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddEducationForm(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Education
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {education.map((edu, index) => (
            <div key={edu.id} className="border-l-2 border-primary/20 pl-4">
              {editingEducation === edu.id ? (
                <div className="space-y-4 border rounded-lg p-4">
                  <div className="flex items-center justify-between">
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
                        disabled={index === education.length - 1}
                        className="h-7 w-7 p-0"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => saveEdit(edu.id)}
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
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-edu-degree">Degree</Label>
                      <Input
                        id="edit-edu-degree"
                        value={editForm.degree}
                        onChange={(e) => setEditForm(prev => ({ ...prev, degree: e.target.value }))}
                        placeholder="Bachelor of Science"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-edu-school">School/Institution</Label>
                      <Input
                        id="edit-edu-school"
                        value={editForm.school}
                        onChange={(e) => setEditForm(prev => ({ ...prev, school: e.target.value }))}
                        placeholder="University Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-edu-period">Period</Label>
                      <Input
                        id="edit-edu-period"
                        value={editForm.period}
                        onChange={(e) => setEditForm(prev => ({ ...prev, period: e.target.value }))}
                        placeholder="2016 - 2020"
                      />
                    </div>
                  </div>
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
                      <span className="text-sm text-muted-foreground">{edu.period}</span>
                      {isEditing && (
                        <div className="flex gap-1">
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
                            disabled={index === education.length - 1}
                            className="h-7 w-7 p-0"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => startEditing(edu)} className="h-7 w-7 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Education</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this education entry? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => removeEducation(edu.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
              <h3 className="font-semibold text-lg">Add New Education</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edu-degree">Degree</Label>
                  <Input
                    id="edu-degree"
                    value={newEducation.degree}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                    placeholder="Bachelor of Science"
                  />
                </div>
                <div>
                  <Label htmlFor="edu-school">School/Institution</Label>
                  <Input
                    id="edu-school"
                    value={newEducation.school}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, school: e.target.value }))}
                    placeholder="University Name"
                  />
                </div>
                <div>
                  <Label htmlFor="edu-period">Period</Label>
                  <Input
                    id="edu-period"
                    value={newEducation.period}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, period: e.target.value }))}
                    placeholder="2016 - 2020"
                  />
                </div>
              </div>
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
                <Button onClick={addEducation}>Add Education</Button>
                <Button variant="outline" onClick={() => setShowAddEducationForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
