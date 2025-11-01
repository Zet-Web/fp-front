import { createContext, useContext, useState, ReactNode } from 'react'

interface SectionState {
  isEditing: boolean
  isSaving: boolean
  isDirty: boolean
}

interface ProfileEditContextValue {
  globalEditMode: boolean
  globalSaving: boolean
  sectionStates: Record<string, SectionState>

  enterGlobalEditMode: () => void
  exitGlobalEditMode: () => void
  saveAllChanges: () => Promise<void>

  getSectionState: (sectionId: string) => SectionState
  setSectionEditing: (sectionId: string, isEditing: boolean) => void
  setSectionSaving: (sectionId: string, isSaving: boolean) => void
  setSectionDirty: (sectionId: string, isDirty: boolean) => void

  registerOnSave: (sectionId: string, callback: () => Promise<void>) => void
  unregisterOnSave: (sectionId: string) => void
}

const ProfileEditContext = createContext<ProfileEditContextValue | undefined>(undefined)

const DEFAULT_SECTION_STATE: SectionState = {
  isEditing: false,
  isSaving: false,
  isDirty: false,
}

interface ProfileEditProviderProps {
  children: ReactNode
  onSaveComplete?: () => void
  onSaveError?: (error: Error) => void
}

export function ProfileEditProvider({ children, onSaveComplete, onSaveError }: ProfileEditProviderProps) {
  const [globalEditMode, setGlobalEditMode] = useState(false)
  const [globalSaving, setGlobalSaving] = useState(false)
  const [sectionStates, setSectionStates] = useState<Record<string, SectionState>>({})
  const [savCallbacks, setSaveCallbacks] = useState<Record<string, () => Promise<void>>>({})

  const getSectionState = (sectionId: string): SectionState => {
    return sectionStates[sectionId] || DEFAULT_SECTION_STATE
  }

  const setSectionEditing = (sectionId: string, isEditing: boolean) => {
    setSectionStates(prev => ({
      ...prev,
      [sectionId]: { ...getSectionState(sectionId), isEditing }
    }))
  }

  const setSectionSaving = (sectionId: string, isSaving: boolean) => {
    setSectionStates(prev => ({
      ...prev,
      [sectionId]: { ...getSectionState(sectionId), isSaving }
    }))
  }

  const setSectionDirty = (sectionId: string, isDirty: boolean) => {
    setSectionStates(prev => ({
      ...prev,
      [sectionId]: { ...getSectionState(sectionId), isDirty }
    }))
  }

  const enterGlobalEditMode = () => {
    setGlobalEditMode(true)
    Object.keys(sectionStates).forEach(sectionId => {
      setSectionEditing(sectionId, true)
    })
  }

  const exitGlobalEditMode = () => {
    setGlobalEditMode(false)
    Object.keys(sectionStates).forEach(sectionId => {
      setSectionEditing(sectionId, false)
      setSectionDirty(sectionId, false)
    })
  }

  const saveAllChanges = async () => {
    setGlobalSaving(true)

    try {
      const sectionsToSave = Object.entries(sectionStates)
        .filter(([_, state]) => state.isDirty)
        .map(([sectionId]) => sectionId)

      for (const sectionId of sectionsToSave) {
        setSectionSaving(sectionId, true)
        const callback = savCallbacks[sectionId]
        if (callback) {
          await callback()
        }
        setSectionSaving(sectionId, false)
        setSectionDirty(sectionId, false)
      }

      exitGlobalEditMode()
      onSaveComplete?.()
    } catch (error) {
      onSaveError?.(error instanceof Error ? error : new Error('Failed to save changes'))
    } finally {
      setGlobalSaving(false)
    }
  }

  const registerOnSave = (sectionId: string, callback: () => Promise<void>) => {
    setSaveCallbacks(prev => ({ ...prev, [sectionId]: callback }))

    if (!sectionStates[sectionId]) {
      setSectionStates(prev => ({
        ...prev,
        [sectionId]: { ...DEFAULT_SECTION_STATE }
      }))
    }
  }

  const unregisterOnSave = (sectionId: string) => {
    setSaveCallbacks(prev => {
      const { [sectionId]: _, ...rest } = prev
      return rest
    })
  }

  const value: ProfileEditContextValue = {
    globalEditMode,
    globalSaving,
    sectionStates,
    getSectionState,
    setSectionEditing,
    setSectionSaving,
    setSectionDirty,
    enterGlobalEditMode,
    exitGlobalEditMode,
    saveAllChanges,
    registerOnSave,
    unregisterOnSave,
  }

  return (
    <ProfileEditContext.Provider value={value}>
      {children}
    </ProfileEditContext.Provider>
  )
}

export function useProfileEdit() {
  const context = useContext(ProfileEditContext)
  if (!context) {
    throw new Error('useProfileEdit must be used within ProfileEditProvider')
  }
  return context
}
