# Project

This project is a modern business social networking application with built-in AI and SaaS functionality.

# Code Structure

The project follows a modular and organized code structure to enhance maintainability, optimize performance, and facilitate development.
Goal is optimize and good organize code, save tokens, avoit AI mistakes by decide apps and shared-src to own folders and active using ignore file.

Types of folders:
1. apps/ - folder for pages-apps.
2. src/ - core directory for main entities and shared resources used across all applications.
3. shared-src/ - components, UI blocks, sections, etc (with logic) that using by some apps (not need for all apps).
4. supabase/ - supabase settings and edge functions for full project and apps.
6. base files - index, config, etc.

1. apps/ - storage pages (as separate apps) that have own fucntionality and mostly isolated. Apps can have own src, components, hooks, lib, supabase, and files. They use main folders/files and sometime use shared-src folder.
Current list of apps (if Bolt not see, then they ignored temporarily):
- 404 - Not found (error) page.
- auth - Handles user authentication processes.
- home - The application's landing page.
- header - The main application header with branding and theme toggle
- navigation - List of pages like menu. It is page on mobile, and left sidebar on desktop.
- mobileNav - Bottom navigation bar and side sheet menu for mobile devices.
- chats - List of users chats like messenger. It is page on mobile, and right sidebar on desktop.
- network - Network visualization with D3.js interactive graph and list view for connections.
- profile - Manages profiles.
- settings - User settings management.

# Auth flow:
Authentication begins in the Auth app using Supabase to handle Telegram login and generate a magic link. After redirecting, the Supabase client extracts and stores the JWT and refresh_token in Local Storage, maintaining a persistent session. This enables automatic token refresh and access to user profile data (name, username, avatar, bio, etc.). Profile data in `public.profiles` is linked to `auth.users`, allowing secure, session-based retrieval and management of user details.
All profiles have own usernames.

# Network Visualization:
The Network page provides an interactive visualization of business connections using D3.js force-directed graph layout. Users can explore their network through multiple levels of connections (direct, 2nd degree, 3rd degree) with different relationship types (colleagues, clients, partners, community members). The page features:
- Interactive D3.js graph with zoom, pan, and drag functionality
- List view with sorting and pagination
- Advanced filtering by connection type, community, and level
- Statistics dashboard showing network metrics and insights
- Modal dialogs for detailed connection information
- Theme-aware visualization adapting to light/dark modes
- Smooth transitions between views using Framer Motion
Currently uses mock data for testing; ready for database integration.

---
