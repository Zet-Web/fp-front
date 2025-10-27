import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { GraduationCap, Plus, Edit, Trash2, ChevronUp, ChevronDown, Check, X, ChevronDownIcon, Loader2 } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"

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

  const generateYears = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = currentYear; year >= 1930; year--) {
      years.push(year.toString())
    }
    return years
  }

  const formatPeriod = (edu: Education) => {
    if (edu.start_year && edu.start_year !== 'not-set') {
      const startMonth = edu.start_month !== 'not-set' && edu.start_month ? months.find(m => m.value === edu.start_month)?.label : ''
      const startYear = edu.start_year
      const start = startMonth ? `${startMonth} ${startYear}` : startYear

      if (edu.is_current) {
        return `${start} - Present`
      }

      if (edu.end_year && edu.end_year !== 'not-set') {
        const endMonth = edu.end_month !== 'not-set' && edu.end_month ? months.find(m => m.value === edu.end_month)?.label : ''
        const endYear = edu.end_year
        const end = endMonth ? `${endMonth} ${endYear}` : endYear
        return `${start} - ${end}`
      }

      return start
    }

    return edu.period || ''
  }

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
      start_month: 'not-set',
      start_year: 'not-set',
      end_month: 'not-set',
      end_year: 'not-set',
      is_current: false,
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
              Add
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
                      <Popover open={openEditDegreeSelect} onOpenChange={setOpenEditDegreeSelect}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openEditDegreeSelect}
                            className="w-full justify-between"
                          >
                            {editForm.degree || "Select degree..."}
                            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search degrees..."
                              value={editDegreeSearchInput}
                              onValueChange={setEditDegreeSearchInput}
                            />
                            <CommandList>
                              {isFetchingStudyFields && (
                                <div className="flex items-center justify-center py-6">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                </div>
                              )}
                              {!isFetchingStudyFields && getFilteredStudyFields(editDegreeSearchInput).length === 0 && (
                                <CommandEmpty>No degrees found.</CommandEmpty>
                              )}
                              {!isFetchingStudyFields && getFilteredStudyFields(editDegreeSearchInput).length > 0 && (
                                <CommandGroup>
                                  {getFilteredStudyFields(editDegreeSearchInput).map((field) => (
                                    <CommandItem
                                      key={field.id}
                                      value={field.name_ru}
                                      onSelect={() => {
                                        setEditForm(prev => ({ ...prev, degree: field.name_ru }))
                                        setEditDegreeSearchInput('')
                                        setOpenEditDegreeSelect(false)
                                      }}
                                    >
                                      {field.name_ru}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="edit-edu-school">School/Institution</Label>
                      <Popover open={openEditUniversitySelect} onOpenChange={setOpenEditUniversitySelect}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openEditUniversitySelect}
                            className="w-full justify-between"
                          >
                            {editForm.school || "Select university..."}
                            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command shouldFilter={false}>
                            <CommandInput
                              placeholder="Type at least 3 characters..."
                              value={universitySearchQuery}
                              onValueChange={setUniversitySearchQuery}
                            />
                            <CommandList>
                              {isFetchingUniversities && (
                                <div className="flex items-center justify-center py-6">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                </div>
                              )}
                              {!isFetchingUniversities && universitySearchQuery.length < 3 && (
                                <CommandEmpty>Type at least 3 characters to search</CommandEmpty>
                              )}
                              {!isFetchingUniversities && universitySearchQuery.length >= 3 && filteredUniversities.length === 0 && (
                                <CommandEmpty>No universities found</CommandEmpty>
                              )}
                              {!isFetchingUniversities && filteredUniversities.length > 0 && (
                                <CommandGroup>
                                  {filteredUniversities.map((university) => (
                                    <CommandItem
                                      key={university.id}
                                      value={university.name_ru}
                                      onSelect={() => {
                                        setEditForm(prev => ({ ...prev, school: university.name_ru }))
                                        setUniversitySearchQuery('')
                                        setOpenEditUniversitySelect(false)
                                      }}
                                    >
                                      {university.name_ru}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Period (Optional)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div>
                        <Label htmlFor="edit-edu-start-month" className="text-xs text-muted-foreground">Start Month</Label>
                        <Select value={editForm.start_month} onValueChange={(value) => setEditForm(prev => ({ ...prev, start_month: value }))}>
                          <SelectTrigger id="edit-edu-start-month">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-set">Not set</SelectItem>
                            {months.map((month) => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="edit-edu-start-year" className="text-xs text-muted-foreground">Start Year</Label>
                        <Select value={editForm.start_year} onValueChange={(value) => setEditForm(prev => ({ ...prev, start_year: value }))}>
                          <SelectTrigger id="edit-edu-start-year">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-set">Not set</SelectItem>
                            {generateYears().map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="edit-edu-end-month" className="text-xs text-muted-foreground">End Month</Label>
                        <Select
                          value={editForm.end_month}
                          onValueChange={(value) => setEditForm(prev => ({ ...prev, end_month: value }))}
                          disabled={editForm.is_current}
                        >
                          <SelectTrigger id="edit-edu-end-month">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-set">Not set</SelectItem>
                            {months.map((month) => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="edit-edu-end-year" className="text-xs text-muted-foreground">End Year</Label>
                        <Select
                          value={editForm.end_year}
                          onValueChange={(value) => setEditForm(prev => ({ ...prev, end_year: value }))}
                          disabled={editForm.is_current}
                        >
                          <SelectTrigger id="edit-edu-end-year">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-set">Not set</SelectItem>
                            {generateYears().map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="edit-edu-is-current"
                        checked={editForm.is_current}
                        onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, is_current: checked as boolean }))}
                      />
                      <Label htmlFor="edit-edu-is-current" className="text-sm font-normal cursor-pointer">
                        I currently study here
                      </Label>
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
                      <span className="text-sm text-muted-foreground">{formatPeriod(edu)}</span>
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
              <h3 className="font-semibold text-lg">Add</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edu-degree">Faculty</Label>
                  <Popover open={openNewDegreeSelect} onOpenChange={setOpenNewDegreeSelect}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openNewDegreeSelect}
                        className="w-full justify-between"
                      >
                        {newEducation.degree || "Select degree..."}
                        <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search degrees..."
                          value={newDegreeSearchInput}
                          onValueChange={setNewDegreeSearchInput}
                        />
                        <CommandList>
                          {isFetchingStudyFields && (
                            <div className="flex items-center justify-center py-6">
                              <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                          )}
                          {!isFetchingStudyFields && getFilteredStudyFields(newDegreeSearchInput).length === 0 && (
                            <CommandEmpty>No degrees found.</CommandEmpty>
                          )}
                          {!isFetchingStudyFields && getFilteredStudyFields(newDegreeSearchInput).length > 0 && (
                            <CommandGroup>
                              {getFilteredStudyFields(newDegreeSearchInput).map((field) => (
                                <CommandItem
                                  key={field.id}
                                  value={field.name_ru}
                                  onSelect={() => {
                                    setNewEducation(prev => ({ ...prev, degree: field.name_ru }))
                                    setNewDegreeSearchInput('')
                                    setOpenNewDegreeSelect(false)
                                  }}
                                >
                                  {field.name_ru}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="edu-school">University</Label>
                  <Popover open={openNewUniversitySelect} onOpenChange={setOpenNewUniversitySelect}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openNewUniversitySelect}
                        className="w-full justify-between"
                      >
                        {newEducation.school || "Select university..."}
                        <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Type at least 3 characters..."
                          value={universitySearchQuery}
                          onValueChange={setUniversitySearchQuery}
                        />
                        <CommandList>
                          {isFetchingUniversities && (
                            <div className="flex items-center justify-center py-6">
                              <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                          )}
                          {!isFetchingUniversities && universitySearchQuery.length < 3 && (
                            <CommandEmpty>Type at least 3 characters to search</CommandEmpty>
                          )}
                          {!isFetchingUniversities && universitySearchQuery.length >= 3 && filteredUniversities.length === 0 && (
                            <CommandEmpty>No universities found</CommandEmpty>
                          )}
                          {!isFetchingUniversities && filteredUniversities.length > 0 && (
                            <CommandGroup>
                              {filteredUniversities.map((university) => (
                                <CommandItem
                                  key={university.id}
                                  value={university.name_ru}
                                  onSelect={() => {
                                    setNewEducation(prev => ({ ...prev, school: university.name_ru }))
                                    setUniversitySearchQuery('')
                                    setOpenNewUniversitySelect(false)
                                  }}
                                >
                                  {university.name_ru}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-3">
                <Label>Period (Optional)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div>
                    <Label htmlFor="new-edu-start-month" className="text-xs text-muted-foreground">Start Month</Label>
                    <Select value={newEducation.start_month} onValueChange={(value) => setNewEducation(prev => ({ ...prev, start_month: value }))}>
                      <SelectTrigger id="new-edu-start-month">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-set">Not set</SelectItem>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="new-edu-start-year" className="text-xs text-muted-foreground">Start Year</Label>
                    <Select value={newEducation.start_year} onValueChange={(value) => setNewEducation(prev => ({ ...prev, start_year: value }))}>
                      <SelectTrigger id="new-edu-start-year">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-set">Not set</SelectItem>
                        {generateYears().map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="new-edu-end-month" className="text-xs text-muted-foreground">End Month</Label>
                    <Select
                      value={newEducation.end_month}
                      onValueChange={(value) => setNewEducation(prev => ({ ...prev, end_month: value }))}
                      disabled={newEducation.is_current}
                    >
                      <SelectTrigger id="new-edu-end-month">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-set">Not set</SelectItem>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="new-edu-end-year" className="text-xs text-muted-foreground">End Year</Label>
                    <Select
                      value={newEducation.end_year}
                      onValueChange={(value) => setNewEducation(prev => ({ ...prev, end_year: value }))}
                      disabled={newEducation.is_current}
                    >
                      <SelectTrigger id="new-edu-end-year">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-set">Not set</SelectItem>
                        {generateYears().map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="new-edu-is-current"
                    checked={newEducation.is_current}
                    onCheckedChange={(checked) => setNewEducation(prev => ({ ...prev, is_current: checked as boolean }))}
                  />
                  <Label htmlFor="new-edu-is-current" className="text-sm font-normal cursor-pointer">
                    I currently study here
                  </Label>
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
                <Button onClick={addEducation}>Add</Button>
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
