# Project
This project is a modern business social networking application with built-in AI and SaaS functionality.

# Code Structure
The project follows a modular and organized code structure to enhance maintainability, optimize performance, and facilitate development.
Goal is optimize and good organize code, save tokens, avoit AI mistakes by decide apps and shared-src to own (isolated) folders and active using ignore file.

1. apps/ - folder for pages-apps. It storage pages (as separate apps) that have own fucntionality and mostly isolated. Apps can have own src, components, hooks, lib, supabase, and files. They use main folders/files and sometime use shared-src folder.
2. src/ - core directory for main entities and shared resources used across all applications.
3. shared-src/ - components, UI blocks, sections, etc (with logic) that using by some apps (not need for all apps).
4. base files - index, config, etc.

# Backend
- Using Supabase Self Hosted.
- Using direct database requests, call SQL functions, request serverless functions in the own server (NestJs).