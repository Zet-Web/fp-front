import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Briefcase, Plus, Edit, Trash2, ChevronUp, ChevronDown, Check, X } from "lucide-react"
import { useState } from "react"

interface Experience {
  id: number
  title: string
  company: string
  period: string
  description: string
  achievements: string[]
}

const initialExperiences: Experience[] = [
  {
    id: 1,
    title: "Senior Full-Stack Developer",
    company: "TechCorp Solutions",
    period: "2022 - Present",
    description: "Lead development of scalable web applications using React, Node.js, and AWS. Mentored junior developers and architected microservices infrastructure.",
    achievements: [
      "Improved application performance by 40% through code optimization",
      "Led a team of 5 developers on multiple client projects",
      "Implemented CI/CD pipelines reducing deployment time by 60%"
    ]
  },
  {
    id: 2,
    title: "Full-Stack Developer",
    company: "StartupXYZ",
    period: "2020 - 2022",
    description: "Developed and maintained multiple web applications using modern JavaScript frameworks. Collaborated with designers and product managers to deliver user-focused solutions.",
    achievements: [
      "Built 3 major product features from concept to production",
      "Reduced bug reports by 50% through comprehensive testing",
      "Contributed to 200% user growth through performance improvements"
    ]
  }
]

interface ExperienceSectionProps {
  isEditing: boolean
}

export function ExperienceSection({ isEditing }: ExperienceSectionProps) {
  const [experiences, setExperiences] = useState(initialExperiences)
  const [editingExperience, setEditingExperience] = useState<number | null>(null)
  const [showAddExperienceForm, setShowAddExperienceForm] = useState(false)
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    period: '',
    description: '',
    achievements: ['']
  })
  const [editForm, setEditForm] = useState({
    title: '',
    company: '',
    period: '',
    description: '',
    achievements: ['']
  })

  const moveUp = (index: number) => {
    if (index === 0) return

    const newExperiences = [...experiences]
    const temp = newExperiences[index - 1]
    newExperiences[index - 1] = newExperiences[index]
    newExperiences[index] = temp

    setExperiences(newExperiences)
  }

  const moveDown = (index: number) => {
    if (index === experiences.length - 1) return

    const newExperiences = [...experiences]
    const temp = newExperiences[index + 1]
    newExperiences[index + 1] = newExperiences[index]
    newExperiences[index] = temp

    setExperiences(newExperiences)
  }

  const addExperience = () => {
    if (newExperience.title && newExperience.company) {
      setExperiences(prev => [...prev, {
        id: Date.now(),
        ...newExperience,
        achievements: newExperience.achievements.filter(a => a.trim())
      }])
      setNewExperience({
        title: '',
        company: '',
        period: '',
        description: '',
        achievements: ['']
      })
      setShowAddExperienceForm(false)
    }
  }

  const removeExperience = (id: number) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id))
  }

  const startEditing = (exp: Experience) => {
    setEditingExperience(exp.id)
    setEditForm({
      title: exp.title,
      company: exp.company,
      period: exp.period,
      description: exp.description,
      achievements: exp.achievements.length > 0 ? exp.achievements : ['']
    })
  }

  const saveEdit = (id: number) => {
    setExperiences(prev => prev.map(exp =>
      exp.id === id ? {
        ...exp,
        ...editForm,
        achievements: editForm.achievements.filter(a => a.trim())
      } : exp
    ))
    setEditingExperience(null)
  }

  const cancelEdit = () => {
    setEditingExperience(null)
    setEditForm({
      title: '',
      company: '',
      period: '',
      description: '',
      achievements: ['']
    })
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Professional Experience
          </div>
          {isEditing && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddExperienceForm(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Experience
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="border-l-2 border-primary/20 pl-4">
              {editingExperience === exp.id ? (
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
                        disabled={index === experiences.length - 1}
                        className="h-7 w-7 p-0"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => saveEdit(exp.id)}
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
                      <Label htmlFor="edit-exp-title">Job Title</Label>
                      <Input
                        id="edit-exp-title"
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Senior Developer"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-exp-company">Company</Label>
                      <Input
                        id="edit-exp-company"
                        value={editForm.company}
                        onChange={(e) => setEditForm(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="Company Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-exp-period">Period</Label>
                      <Input
                        id="edit-exp-period"
                        value={editForm.period}
                        onChange={(e) => setEditForm(prev => ({ ...prev, period: e.target.value }))}
                        placeholder="2022 - Present"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-exp-description">Description</Label>
                    <Textarea
                      id="edit-exp-description"
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your role and responsibilities..."
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className="font-semibold text-lg">{exp.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{exp.period}</span>
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
                            disabled={index === experiences.length - 1}
                            className="h-7 w-7 p-0"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => startEditing(exp)} className="h-7 w-7 p-0">
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
                                <AlertDialogTitle>Delete Experience</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this work experience? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => removeExperience(exp.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-primary font-medium mb-2">{exp.company}</p>
                  <p className="text-muted-foreground mb-3">{exp.description}</p>
                  {exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {exp.achievements.map((achievement, achievementIndex) => (
                        <li key={achievementIndex}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          ))}

          {isEditing && showAddExperienceForm && (
            <div className="border-l-2 border-dashed border-primary/20 pl-4 space-y-4">
              <h3 className="font-semibold text-lg">Add New Experience</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="exp-title">Job Title</Label>
                  <Input
                    id="exp-title"
                    value={newExperience.title}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Senior Developer"
                  />
                </div>
                <div>
                  <Label htmlFor="exp-company">Company</Label>
                  <Input
                    id="exp-company"
                    value={newExperience.company}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <Label htmlFor="exp-period">Period</Label>
                  <Input
                    id="exp-period"
                    value={newExperience.period}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, period: e.target.value }))}
                    placeholder="2022 - Present"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="exp-description">Description</Label>
                <Textarea
                  id="exp-description"
                  value={newExperience.description}
                  onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your role and responsibilities..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addExperience}>Add Experience</Button>
                <Button variant="outline" onClick={() => setShowAddExperienceForm(false)}>
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
