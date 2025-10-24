# Server Functions Documentation

This document provides a comprehensive overview of all Supabase Edge Functions used in the project.

## Authentication Functions

### 1. generate-auth-state
**Location:** `apps/auth/supabase/functions/generate-auth-state/index.ts`

**Description:** Generates a secure authentication state for Telegram login flow. Creates a unique state token and stores it in the database with expiration time.

**Flow:**
1. Receives initiating host origin from client
2. Generates secure random state token (24 bytes)
3. Stores state in `auth_states` table with 3-minute expiration
4. Returns Telegram bot URL with state parameter

**Input:**
```json
{
  "initiatingHostOrigin": "http://localhost:5173"
}
```

**Output:**
```json
{
  "success": true,
  "state": "abc123...",
  "redirect_url": "https://t.me/fondprava_bot?start=auth_abc123..."
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

---

### 2. process-platform-auth
**Location:** `apps/auth/supabase/functions/process-platform-auth/index.ts`

**Description:** Processes authentication from Telegram bot webhook. Creates new users or authenticates existing ones based on Telegram data.

**Flow:**
1. Verifies webhook secret for security
2. Validates auth state exists and hasn't expired
3. Checks if user exists by telegram_id
4. Creates new user account if needed (with random email/password)
5. Creates profile record with Telegram data
6. Marks auth state as completed

**Input:**
```json
{
  "state": "abc123...",
  "telegram_user_id": 123456789,
  "telegram_full_name": "John Doe",
  "telegram_username": "johndoe",
  "webhook_secret": "secret_key"
}
```

**Output:**
```json
{
  "success": true,
  "message": "User created and authenticated",
  "user_id": "uuid-here"
}
```

---

### 3. get-auth-session
**Location:** `apps/auth/supabase/functions/get-auth-session/index.ts`

**Description:** Checks authentication completion status and generates magic link for automatic login.

**Flow:**
1. Validates state parameter and checks expiration
2. Returns pending status if auth not completed
3. If completed, retrieves user data and generates magic link
4. Cleans up auth state record
5. Returns magic link for client-side redirect

**Input:** Query parameter `state=abc123...`

**Output (Pending):**
```json
{
  "success": true,
  "completed": false,
  "message": "Authentication in progress"
}
```

**Output (Completed):**
```json
{
  "success": true,
  "completed": true,
  "magic_link": "https://supabase.co/auth/v1/verify?...",
  "user_id": "uuid-here"
}
```

---

### 4. delete-auth-state
**Location:** `apps/auth/supabase/functions/delete-auth-state/index.ts`

**Description:** Cleans up unused authentication states to prevent database bloat.

**Flow:**
1. Receives state parameter
2. Deletes auth state record only if not completed
3. Returns success confirmation

**Input:**
```json
{
  "state": "abc123..."
}
```

**Output:**
```json
{
  "success": true,
  "message": "Auth state deleted successfully"
}
```

---

## Profile Functions

### 5. fetch-auth-profile
**Location:** `supabase/functions/fetch-auth-profile/index.ts`

**Description:** Fetches authenticated user's own profile data using JWT token. Used for loading user's profile after login.

**Flow:**
1. Validates Authorization header with JWT token
2. Extracts user ID from token
3. Fetches profile data using RLS policies
4. Returns sanitized profile information

**Input:** Authorization header with Bearer token

**Output:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "about": "Software developer",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

---

### 6. fetch-profile-by-username
**Location:** `apps/profile/supabase/functions/fetch-profile-by-username/index.ts`

**Description:** Fetches public profile data by username for profile page viewing.

**Flow:**
1. Validates username format (3-30 chars, alphanumeric + underscore/hyphen)
2. Queries profiles table by username
3. Returns public profile fields or null if not found

**Input:**
```json
{
  "username": "johndoe"
}
```

**Output:**
```json
{
  "profile": {
    "id": "uuid-here",
    "name": "John Doe",
    "username": "johndoe",
    "about": "Software developer",
    "avatar_url": "https://example.com/avatar.jpg",
    "cover_url": null,
    "profile_type": "user",
    "badge": ["verified"],
    "contact_info": [...],
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### 7. update-profile
**Location:** `apps/profile/supabase/functions/update-profile/index.ts`

**Description:** Updates authenticated user's profile information with comprehensive validation.

**Flow:**
1. Validates JWT token and extracts user ID
2. Validates all input fields (contact_info, about, name, etc.)
3. Performs contact entry validation (types, formats)
4. Updates profile record in database
5. Returns updated profile data

**Input:**
```json
{
  "contact_info": [
    {
      "id": "1",
      "type": "email",
      "value": "john@example.com",
      "label": "Work Email",
      "order": 0
    }
  ],
  "about": "Updated bio text",
  "name": "John Smith",
  "avatar_url": "https://example.com/new-avatar.jpg",
  "profile_type": "developer"
}
```

**Output:**
```json
{
  "success": true,
  "profile": {
    "id": "uuid-here",
    "name": "John Smith",
    "about": "Updated bio text",
    ...
  }
}
```

---

### 8. fetch-additional-profile-data
**Location:** `supabase/functions/fetch-additional-profile-data/index.ts`

**Description:** Fetches location data (cities/countries) associated with a profile through relations table.

**Flow:**
1. Queries relations table for profile's location connections
2. Fetches detailed city/country data from reference tables
3. Formats and returns structured location data

**Input:**
```json
{
  "profile_id": "uuid-here"
}
```

**Output:**
```json
{
  "success": true,
  "location_data": {
    "cities": [
      {
        "type": "city",
        "id": 123,
        "name": "New York",
        "metadata": {
          "country": "United States",
          "population": 8000000
        }
      }
    ],
    "countries": [
      {
        "type": "country",
        "id": 456,
        "name": "United States",
        "metadata": {
          "code": "US"
        }
      }
    ]
  }
}
```

---

### 9. update-profile-locations
**Location:** `supabase/functions/update-profile-locations/index.ts`

**Description:** Updates location associations for a user profile (max 3 locations).

**Flow:**
1. Validates JWT token and profile ownership
2. Validates location data (max 3 items, valid types)
3. Deletes existing location relations
4. Inserts new location relations
5. Returns updated location data

**Input:**
```json
{
  "profile_id": "uuid-here",
  "locations": [
    {
      "type": "city",
      "id": 123,
      "name": "New York"
    },
    {
      "type": "country",
      "id": 456,
      "name": "United States"
    }
  ]
}
```

**Output:**
```json
{
  "success": true,
  "location_data": {
    "cities": [...],
    "countries": [...]
  }
}
```

---

## Reference Data Functions

### 10. fetch-reference-lists
**Location:** `supabase/functions/fetch-reference-lists/index.ts`

**Description:** Searches and returns reference data for cities or countries with optional search filtering.

**Flow:**
1. Validates list_type parameter (city/country)
2. Applies search filtering if query provided (min 2 chars)
3. Queries appropriate reference table with limits
4. Returns formatted results

**Input:**
```json
{
  "list_type": "city",
  "search_query": "New"
}
```

**Output:**
```json
{
  "success": true,
  "list_type": "city",
  "items": [
    {
      "id": 123,
      "name": "New York",
      "country": "United States",
      "population": 8000000
    },
    {
      "id": 124,
      "name": "New Delhi",
      "country": "India",
      "population": 30000000
    }
  ]
}
```

---

## Settings Functions

### 11. settings
**Location:** `apps/settings/supabase/functions/settings/index.ts`

**Description:** Handles user settings management (get/update operations for timezone and theme preferences).

**Flow:**
1. Validates JWT token and extracts user ID
2. For GET: Fetches current settings from profiles table
3. For UPDATE: Validates and updates settings, then refetches
4. Returns current settings data

**Input (GET):**
```json
{
  "action": "get"
}
```

**Input (UPDATE):**
```json
{
  "action": "update",
  "timezone": "America/New_York",
  "theme_mode": "dark"
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "timezone": "America/New_York",
    "theme_mode": "dark"
  }
}
```

---

## Function Categories Summary

### Authentication (4 functions)
- State generation and management
- Platform authentication processing
- Session validation and magic link generation
- Cleanup operations

### Profile Management (5 functions)
- Profile data fetching (own and public)
- Profile updates with validation
- Location data management
- Additional profile data retrieval

### Reference Data (1 function)
- City and country search functionality

### Settings (1 function)
- User preferences management

## Security Features

- **JWT Token Validation**: All authenticated endpoints validate Bearer tokens
- **Row Level Security (RLS)**: Database policies enforce data access rules
- **CORS Headers**: Proper cross-origin request handling
- **Input Validation**: Comprehensive validation of all input parameters
- **Webhook Security**: Secret-based verification for external webhooks
- **State Management**: Secure state tokens with expiration for auth flows

## Error Handling

All functions implement consistent error handling with:
- Proper HTTP status codes
- Structured error responses
- Detailed logging for debugging
- Graceful fallbacks where appropriate