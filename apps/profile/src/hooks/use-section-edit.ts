import { useEffect, useState, useCallback } from 'react'
import { useProfileEdit } from '../contexts/ProfileEditContext'

export function useSectionEdit(sectionId: string, onSave: () => Promise<void>) {
  const {
    globalEditMode,
    globalSaving,
    getSectionState,
    setSectionDirty,
    registerOnSave,
    unregisterOnSave,
  } = useProfileEdit()

  const sectionState = getSectionState(sectionId)
  const [localData, setLocalData] = useState<any>(null)

  useEffect(() => {
    registerOnSave(sectionId, onSave)
    return () => unregisterOnSave(sectionId)
  }, [sectionId, onSave])

  const markDirty = useCallback(() => {
    setSectionDirty(sectionId, true)
  }, [sectionId, setSectionDirty])

  const updateLocalData = useCallback((data: any) => {
    setLocalData(data)
    markDirty()
  }, [markDirty])

  return {
    isEditing: globalEditMode || sectionState.isEditing,
    isSaving: globalSaving || sectionState.isSaving,
    isDirty: sectionState.isDirty,
    localData,
    updateLocalData,
    markDirty,
  }
}
