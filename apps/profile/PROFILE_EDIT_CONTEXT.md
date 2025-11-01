# Profile Edit Context - Context-Based State Management

This document describes the context-based state management system implemented for the Profile page.

## Overview

The Profile Edit Context provides a centralized way to manage edit states across all profile sections while maintaining component isolation. This approach allows for:

- Global edit mode that affects all sections simultaneously
- Individual section save operations
- Coordinated save operations across multiple sections
- Tracking of dirty states (unsaved changes)
- Centralized loading states

## Architecture

### 1. ProfileEditContext

Located at: `apps/profile/src/contexts/ProfileEditContext.tsx`

The context provider manages:
- **Global edit mode**: Whether all sections are in edit mode
- **Global saving state**: Whether a save operation is in progress
- **Section states**: Individual state for each section (editing, saving, dirty)
- **Save callbacks**: Functions to call when saving each section

### 2. useSectionEdit Hook

Located at: `apps/profile/src/hooks/use-section-edit.ts`

A convenience hook for sections to integrate with the context:

```typescript
const { isEditing, isSaving, markDirty } = useSectionEdit(sectionId, onSave)
```

Parameters:
- `sectionId`: Unique identifier for the section
- `onSave`: Async function to execute when saving this section

Returns:
- `isEditing`: Whether this section is in edit mode
- `isSaving`: Whether this section is currently saving
- `isDirty`: Whether this section has unsaved changes
- `markDirty`: Function to mark the section as having unsaved changes

## Usage

### 1. Wrap ProfilePage with Provider

```typescript
export function ProfilePage(props: ProfilePageProps) {
  const { toast } = useToast()

  const handleSaveComplete = () => {
    toast({ title: "Profile updated", description: "Changes saved successfully" })
  }

  const handleSaveError = (error: Error) => {
    toast({ title: "Error", description: error.message, variant: "destructive" })
  }

  return (
    <ProfileEditProvider onSaveComplete={handleSaveComplete} onSaveError={handleSaveError}>
      <ProfilePageContent {...props} />
    </ProfileEditProvider>
  )
}
```

### 2. Use Context in Parent Component

```typescript
function ProfilePageContent() {
  const {
    globalEditMode,
    globalSaving,
    enterGlobalEditMode,
    exitGlobalEditMode,
    saveAllChanges
  } = useProfileEdit()

  const handleEditToggle = () => {
    if (globalEditMode) {
      exitGlobalEditMode()
    } else {
      enterGlobalEditMode()
    }
  }

  const handleSaveChanges = async () => {
    await saveAllChanges()
  }

  return (
    <HeroSection
      isEditing={globalEditMode}
      isSaving={globalSaving}
      onEditToggle={handleEditToggle}
      onSaveChanges={handleSaveChanges}
    />
  )
}
```

### 3. Integrate in Section Components

```typescript
export function ContactsSection({ user, onUpdateProfile }: ContactsSectionProps) {
  const [contactEntries, setContactEntries] = useState<ContactInfoEntry[]>([])

  const saveContacts = useCallback(async () => {
    console.log('Saving contacts:', contactEntries)
    await new Promise(resolve => setTimeout(resolve, 500))
  }, [contactEntries])

  const { isEditing, isSaving, markDirty } = useSectionEdit('contacts', saveContacts)

  const updateContactEntries = (updatedEntries: ContactInfoEntry[]) => {
    setContactEntries(updatedEntries)
    onUpdateProfile({ contact_info: updatedEntries })
    markDirty()
  }

  return (
    <Card>
      {isEditing ? <EditMode /> : <ViewMode />}
    </Card>
  )
}
```

## Key Features

### 1. Automatic Save Coordination

When `saveAllChanges()` is called:
1. Only sections marked as "dirty" are saved
2. Sections are saved sequentially
3. Each section shows its individual saving state
4. All sections exit edit mode upon completion
5. Errors are handled centrally

### 2. Component Isolation

Each section:
- Manages its own local state
- Registers its save function independently
- Can be developed and tested in isolation
- Only communicates with the context for coordination

### 3. Dirty State Tracking

Sections automatically track unsaved changes:
- Call `markDirty()` when data changes
- Only dirty sections are saved during global save
- Prevents unnecessary API calls

### 4. Loading States

Two levels of loading states:
- **Global saving**: Shown in the hero section save button
- **Section saving**: Individual sections can show their own loading state

## Benefits

1. **Centralized Control**: All edit state management in one place
2. **Component Independence**: Sections remain modular and testable
3. **Flexible**: Supports both global and individual section saves
4. **Efficient**: Only saves sections with changes
5. **User Feedback**: Clear loading and saving states throughout

## Migration Guide

To migrate an existing section:

1. Import the hook:
```typescript
import { useSectionEdit } from '../hooks/use-section-edit'
```

2. Create a save function:
```typescript
const saveData = useCallback(async () => {
  // Your save logic here
}, [dependencies])
```

3. Use the hook:
```typescript
const { isEditing, isSaving, markDirty } = useSectionEdit('section-id', saveData)
```

4. Mark dirty on changes:
```typescript
const handleUpdate = (newData) => {
  setData(newData)
  markDirty()
}
```

5. Use the editing state:
```typescript
return isEditing ? <EditMode /> : <ViewMode />
```

## Future Enhancements

- Individual section save buttons (in addition to global save)
- Discard changes confirmation when exiting with unsaved data
- Autosave functionality
- Optimistic updates with rollback on error
- Section-level validation before save
