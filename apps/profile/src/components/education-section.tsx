import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { GraduationCap, Plus, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import { useState } from "react"

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
  const [editFormData, setEditFormData] = useState({
    degree: '',
    school: '',
    period: '',
    description: ''
  })

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

  const startEditing = (edu: any) => {
    setEditingEducation(edu.id)
    setEditFormData({
      degree: edu.degree,
      school: edu.school,
      period: edu.period,
      description: edu.description
    })
  }

  const saveEdit = () => {
    setEducation(prev => prev.map(edu => 
      edu.id === editingEducation 
        ? { ...edu, ...editFormData }
        : edu
    ))
    setEditingEducation(null)
    setEditFormData({
      degree: '',
      school: '',
      period: '',
      description: ''
    })
  }

  const cancelEdit = () => {
    setEditingEducation(null)
    setEditFormData({
      degree: '',
      school: '',
      period: '',
      description: ''
    })
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
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`edit-degree-${edu.id}`}>Degree</Label>
                      <Input
                        id={`edit-degree-${edu.id}`}
                        value={editFormData.degree}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, degree: e.target.value }))}
                        placeholder="Bachelor of Science"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edit-school-${edu.id}`}>School/Institution</Label>
                      <Input
                        id={`edit-school-${edu.id}`}
                        value={editFormData.school}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, school: e.target.value }))}
                        placeholder="University Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edit-period-${edu.id}`}>Period</Label>
                      <Input
                        id={`edit-period-${edu.id}`}
                        value={editFormData.period}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, period: e.target.value }))}
                        placeholder="2016 - 2020"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`edit-description-${edu.id}`}>Description</Label>
                    <Textarea
                      id={`edit-description-${edu.id}`}
                      value={editFormData.description}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Additional details about your education..."
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveEdit}>Save</Button>
                    <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
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
                          <Button size="sm" variant="ghost" onClick={() => startEditing(edu)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="w-3 h-3" />
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