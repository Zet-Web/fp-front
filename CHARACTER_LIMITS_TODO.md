# Character Limits Implementation Status

## ✅ Completed Changes

### 1. Created CharacterCounter Component
- **File:** `/src/components/shared/CharacterCounter.tsx`
- Reusable character counter showing current/max with color coding

### 2. Profile - Hero Section
- **File:** `/apps/profile/src/components/hero-section.tsx`
- ✅ Name field: 50 characters (with counter)
- ✅ About field: 400 characters (with counter)
- ✅ Added `whitespace-pre-wrap` for proper text display

### 3. Profile - Contacts Section
- **File:** `/apps/profile/src/components/contacts-section.tsx`
- ✅ Contact value: 50 characters (with counter)
- ✅ Contact label: 50 characters (with counter)
- ✅ Added `break-all` for long URLs

### 4. Post Editor
- **File:** `/shared-src/post/EditablePostCard.tsx`
- ✅ Title: 100 characters (with counter)
- ✅ Content: 5000 characters (TipTap built-in counter)
- ✅ Excerpt: 400 characters (already had, max updated from 200)
- ✅ Slug: 100 characters (with counter)

## 🔄 Remaining Changes Needed

### 5. Profile - Education Section
**File:** `/apps/profile/src/components/education-section.tsx`

Add after line 28:
```typescript
const DESCRIPTION_MAX_LENGTH = 400;
```

Update line 214-228 (edit form description):
```tsx
<div>
  <div className="flex justify-between items-center mb-2">
    <Label htmlFor="edit-edu-description">Описание</Label>
    <CharacterCounter
      current={editForm.description?.length || 0}
      max={DESCRIPTION_MAX_LENGTH}
    />
  </div>
  <Textarea
    id="edit-edu-description"
    value={editForm.description}
    onChange={(e) =>
      setEditForm((prev) => ({
        ...prev,
        description: e.target.value,
      }))
    }
    placeholder="Дополнительная информация..."
    rows={2}
    maxLength={DESCRIPTION_MAX_LENGTH}
  />
</div>
```

Update line 332-346 (new form description): Similar pattern

Update line 275 (display mode):
```tsx
<p className="text-muted-foreground break-words whitespace-pre-wrap">{edu.description}</p>
```

Add import:
```typescript
import { CharacterCounter } from "@/components/shared/CharacterCounter";
```

### 6. Profile - Experience Section
**File:** `/apps/profile/src/components/experience-section.tsx`

Add after line 59:
```typescript
const TITLE_MAX_LENGTH = 50;
const COMPANY_MAX_LENGTH = 50;
const DESCRIPTION_MAX_LENGTH = 400;
```

Update lines 278-290 (title input):
```tsx
<div>
  <Label htmlFor="edit-exp-title">Должность</Label>
  <Input
    id="edit-exp-title"
    value={editForm.title}
    onChange={(e) =>
      setEditForm((prev) => ({
        ...prev,
        title: e.target.value,
      }))
    }
    placeholder="Senior Developer"
    maxLength={TITLE_MAX_LENGTH}
  />
  <div className="flex justify-end mt-1">
    <CharacterCounter
      current={editForm.title.length}
      max={TITLE_MAX_LENGTH}
    />
  </div>
</div>
```

Apply similar pattern to company (292-304) and description fields (447-461)

Update line 533-535 (display mode):
```tsx
<p className="text-muted-foreground mb-3 break-words whitespace-pre-wrap">
  {exp.description}
</p>
```

Add import:
```typescript
import { CharacterCounter } from "@/components/shared/CharacterCounter";
```

### 7. Profile - Awards Section
**File:** `/apps/profile/src/components/awards-section.tsx`

Add after line 48:
```typescript
const TITLE_MAX_LENGTH = 50;
const ISSUER_MAX_LENGTH = 50;
const DESCRIPTION_MAX_LENGTH = 400;
```

Update title input (200-212), issuer input (214-228), and description textarea (244-258)
Add character counters following the same pattern as above.

Update line 332 (display mode):
```tsx
<p className="text-muted-foreground break-words whitespace-pre-wrap">{award.description}</p>
```

Add import:
```typescript
import { CharacterCounter } from "@/components/shared/CharacterCounter";
```

### 8. Profile - Additional Info Section
**File:** `/apps/profile/src/components/additional-info-section.tsx`

Add after line 16:
```typescript
const ADDITIONAL_INFO_MAX_LENGTH = 400;
```

Update textarea (31-38):
```tsx
{isEditing ? (
  <div>
    <div className="flex justify-end mb-1">
      <CharacterCounter
        current={user.additional_info?.length || 0}
        max={ADDITIONAL_INFO_MAX_LENGTH}
      />
    </div>
    <Textarea
      value={user.additional_info || ""}
      onChange={(e) => handleAdditionalInfoChange(e.target.value)}
      className="resize-none"
      placeholder="Add any additional information..."
      rows={4}
      maxLength={ADDITIONAL_INFO_MAX_LENGTH}
    />
  </div>
) : (
  <p className="text-foreground whitespace-pre-wrap break-words">
    {user.additional_info || (
      <span className="text-muted-foreground italic text-sm">
        Нет данных
      </span>
    )}
  </p>
)}
```

Add import:
```typescript
import { CharacterCounter } from "@/components/shared/CharacterCounter";
```

### 9. Quiz Form
**File:** `/apps/quiz/src/QuizForm.tsx`

Add character limits for:
- Quiz title: 100 characters
- Quiz description: 400 characters
- Question text: 400 characters
- Answer text: 400 characters
- Explanation: 400 characters

### 10. Event Form
**File:** `/shared-src/event/EventFormCard.tsx`

Add character limits for:
- Address: 200 characters
- Website URL: 200 characters
- Additional event fields: 400 characters

##  Key Patterns Used

1. **Character Counter Pattern:**
```tsx
<div className="flex justify-between items-center mb-2">
  <Label>Field Name</Label>
  <CharacterCounter current={value.length} max={MAX_LENGTH} />
</div>
```

2. **Input with maxLength:**
```tsx
<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  maxLength={MAX_LENGTH}
/>
```

3. **Display Mode Text Wrapping:**
```tsx
<p className="break-words whitespace-pre-wrap">{text}</p>
```

## Summary of Limits

| Field Type | Limit | Status |
|------------|-------|--------|
| Profile Name | 50 | ✅ Done |
| Profile About | 400 | ✅ Done |
| Contact Value/Label | 50 | ✅ Done |
| Post Title | 100 | ✅ Done |
| Post Excerpt | 400 | ✅ Done |
| Post Content | 5000 | ✅ Done |
| Post Slug | 100 | ✅ Done |
| Education Desc | 400 | 🔄 Todo |
| Experience Title/Company | 50 | 🔄 Todo |
| Experience Desc | 400 | 🔄 Todo |
| Award Title/Issuer | 50 | 🔄 Todo |
| Award Desc | 400 | 🔄 Todo |
| Additional Info | 400 | 🔄 Todo |
| Quiz Questions/Answers | 400 | 🔄 Todo |
| Event Address/Website | 200 | 🔄 Todo |
