# UniversalReferenceSelector Implementation Guide

## Overview

The `UniversalReferenceSelector` is a unified component for selecting cities, countries, regions, and universities from the database with Russian language support.

## Features

- **Single Component**: One component handles all reference types (city, country, region, university)
- **Russian Display**: Displays values from `name_ru` column
- **Bilingual Search**: Searches in both `name` and `name_ru` columns
- **SQL Function**: Uses optimized database function for better performance
- **Consistent UI**: Same interface across all reference selectors

## Database Setup

### SQL Function

Execute this SQL in your Supabase SQL editor:

```sql
CREATE OR REPLACE FUNCTION search_reference(
  p_type TEXT,
  p_search_query TEXT,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id INTEGER,
  name TEXT,
  name_en TEXT,
  code TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_table_name TEXT;
BEGIN
  CASE p_type
    WHEN 'city' THEN v_table_name := 'list_city';
    WHEN 'country' THEN v_table_name := 'list_country';
    WHEN 'region' THEN v_table_name := 'list_region';
    WHEN 'university' THEN v_table_name := 'list_university';
    ELSE
      RAISE EXCEPTION 'Invalid type parameter. Must be: city, country, region, or university';
  END CASE;

  RETURN QUERY EXECUTE format(
    'SELECT
      id::INTEGER,
      COALESCE(name_ru, name) as name,
      name as name_en,
      COALESCE(code, '''') as code
    FROM %I
    WHERE
      name ILIKE $1 OR
      name_ru ILIKE $1
    ORDER BY
      CASE
        WHEN name_ru ILIKE $1 || ''%%'' THEN 1
        WHEN name ILIKE $1 || ''%%'' THEN 2
        ELSE 3
      END,
      COALESCE(name_ru, name)
    LIMIT $2',
    v_table_name
  )
  USING '%' || p_search_query || '%', p_limit;
END;
$$;

GRANT EXECUTE ON FUNCTION search_reference(TEXT, TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION search_reference(TEXT, TEXT, INTEGER) TO anon;
```

### Required Tables

The function expects these tables to exist:
- `list_city` - Cities
- `list_country` - Countries
- `list_region` - Regions
- `list_university` - Universities

Each table must have columns:
- `id` (INTEGER) - Primary key
- `name` (TEXT) - English name
- `name_ru` (TEXT) - Russian name
- `code` (TEXT, optional) - Country/region code

## Component Usage

### Basic Usage

```tsx
import { UniversalReferenceSelector } from '@/components/shared/UniversalReferenceSelector';

function MyComponent() {
  const [cityId, setCityId] = useState<number>(0);
  const [cityName, setCityName] = useState<string>('');

  return (
    <UniversalReferenceSelector
      type="city"
      value={cityId}
      onChange={(id, name, item) => {
        setCityId(id);
        setCityName(name);
      }}
      label="Город"
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'city' \| 'country' \| 'region' \| 'university'` | **required** | Type of reference to select |
| `value` | `string \| number` | **required** | Current selected value (ID or name) |
| `onChange` | `(id: number, name: string, item: ReferenceItem) => void` | **required** | Callback when selection changes |
| `label` | `string` | `undefined` | Label text above the selector |
| `placeholder` | `string` | Auto-generated | Placeholder when nothing selected |
| `searchPlaceholder` | `string` | Auto-generated | Placeholder in search input |
| `error` | `string` | `undefined` | Error message to display |
| `disabled` | `boolean` | `false` | Disable the selector |
| `className` | `string` | `''` | Additional CSS classes |
| `minSearchLength` | `number` | `2` | Minimum characters before search |
| `showIcon` | `boolean` | `true` | Show icon for the reference type |
| `limit` | `number` | `20` | Maximum search results |

### Examples

#### City Selector

```tsx
<UniversalReferenceSelector
  type="city"
  value={cityId}
  onChange={(id, name) => {
    setCityId(id);
    setCityName(name);
  }}
  label="Город *"
  error={errors.city}
/>
```

#### Country Selector

```tsx
<UniversalReferenceSelector
  type="country"
  value={countryId}
  onChange={(id, name) => {
    setCountryId(id);
    setCountryName(name);
  }}
  label="Страна"
  placeholder="Выбрать страну"
/>
```

#### University Selector

```tsx
<UniversalReferenceSelector
  type="university"
  value={universityId}
  onChange={(id, name) => {
    setUniversityId(id);
    setUniversityName(name);
  }}
  label="ВУЗы"
  minSearchLength={3}
  placeholder="Выбрать университет"
/>
```

#### Region Selector

```tsx
<UniversalReferenceSelector
  type="region"
  value={regionId}
  onChange={(id, name) => {
    setRegionId(id);
    setRegionName(name);
  }}
  label="Регион"
/>
```

## Migration from Old Components

### From EventCitySelector

**Before:**
```tsx
import { EventCitySelector } from './EventCitySelector';

<EventCitySelector
  value={city}
  onChange={(city) => setCity(city)}
  error={errors.city}
/>
```

**After:**
```tsx
import { UniversalReferenceSelector } from '@/components/shared/UniversalReferenceSelector';

<UniversalReferenceSelector
  type="city"
  value={city}
  onChange={(id, name) => setCity(name)}
  error={errors.city}
  label="Город"
/>
```

### From SearchableDropdown (University)

**Before:**
```tsx
<SearchableDropdown
  table="list_university"
  searchColumns={["name", "name"]}
  valueColumn="id"
  labelColumn="name"
  value={universityId}
  onChange={(value, label) => {
    setUniversityId(Number(value));
    setUniversityName(label);
  }}
  label="ВУЗы"
/>
```

**After:**
```tsx
<UniversalReferenceSelector
  type="university"
  value={universityId}
  onChange={(id, name) => {
    setUniversityId(id);
    setUniversityName(name);
  }}
  label="ВУЗы"
  minSearchLength={3}
/>
```

## Benefits

### Before (Multiple Components)
- 6 different implementations
- Inconsistent behavior
- Mix of backend API and direct Supabase queries
- No Russian language support
- Hard to maintain

### After (Single Component)
- 1 unified component
- Consistent behavior everywhere
- Single SQL function for all searches
- Full Russian language support
- Easy to maintain and update
- Better performance with SQL function

## Updated Files

### New Files
- `/src/components/shared/UniversalReferenceSelector.tsx` - New unified component

### Modified Files
- `/shared-src/event/EventFormCard.tsx` - Updated to use UniversalReferenceSelector
- `/apps/profile/src/components/education-section.tsx` - Updated university selector
- `/apps/profile/src/components/LocationSelector.tsx` - Updated to use SQL function
- `/shared-src/event/EventCitySelector.tsx` - Marked as deprecated

### Database
- Added `search_reference` SQL function

## Performance

The SQL function provides better performance than:
- Backend API calls (eliminates HTTP overhead)
- Direct Supabase queries from frontend (optimized SQL)
- Client-side filtering (done in database)

## Security

- Function uses `SECURITY DEFINER` to run with elevated privileges
- Permissions granted to `authenticated` and `anon` roles
- SQL injection prevented by parameterized queries
- No direct table access from frontend

## Troubleshooting

### "Function does not exist"
Make sure you've executed the SQL function in Supabase SQL editor.

### "No results found"
- Check table names: `list_city`, `list_country`, `list_region`, `list_university`
- Verify tables have `name` and `name_ru` columns
- Check if data exists in the tables

### "Invalid type parameter"
Type must be one of: `'city'`, `'country'`, `'region'`, `'university'`

### Russian names not showing
- Verify `name_ru` column exists in the table
- Check if `name_ru` has data (function falls back to `name` if null)
