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
- Using Supabase Self Hosted database.
- Using direct database requests, call SQL functions, request serverless functions in the own server (NestJs).

# External Integrations
## DataNewton API
The Contragent page uses the DataNewton API for fetching real company information from ЕГРЮЛ/ЕГРИП registry.
- API Endpoint: https://api.datanewton.ru/v1/counterparty
- Implementation: Client-side fetch requests
- Features: Search by INN (10-12 digits) or OGRN (13-15 digits)
- Data blocks: OWNER_BLOCK, ADDRESS_BLOCK, MANAGER_BLOCK, OKVED_BLOCK, CONTACT_BLOCK, NEGATIVE_LISTS_BLOCK, WORKERS_COUNT_BLOCK
- Files:
  - apps/contragent/lib/datanewton-api.ts - API service for making requests
  - apps/contragent/lib/datanewton-mapper.ts - Data transformation and risk assessment logic

Design system description and rules in the design_system.md file.