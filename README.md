# Project

This project is a modern business social networking application with built-in AI and SaaS functionality.

# Code Structure

The project follows a modular and organized code structure to enhance maintainability, optimize performance, and facilitate development.
Goal is optimize and good organize code, save tokens, avoit AI mistakes by decide apps and shared-src to own folders and active using ignore file.

# Types of folders:
1. apps/ - folder for pages-apps. It storage pages (as separate apps) that have own fucntionality and mostly isolated. Apps can have own src, components, hooks, lib, supabase, and files. They use main folders/files and sometime use shared-src folder.
2. src/ - core directory for main entities and shared resources used across all applications.
3. shared-src/ - components, UI blocks, sections, etc (with logic) that using by some apps (not need for all apps).
4. base files - index, config, etc.

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
