# Design System

## Overview
This business social network follows a clean, minimalistic design aesthetic with full dark/light/system theme support powered by Shadcn UI, Radix UI, and Tailwind CSS.

## Color System
The primary accent color is blue-500 (HSL: 217 91% 60%), used for interactive elements, links, and primary actions. All colors are theme-aware using CSS variables that adapt between light and dark modes. Gradients are used sparingly for decorative elements and hero sections. Color contrast ratios meet accessibility standards for readability in both themes.

## Typography
The font family is Inter with system font fallbacks for optimal cross-platform rendering. Body text uses 150% line-height for readability, while headings use 120% line-height for visual hierarchy. Font weights are limited to three variations (400, 500, 600) to maintain consistency.

## Spacing & Layout
All spacing follows an 8px grid system for consistent alignment and visual rhythm. Card-based design is the foundation, with all content using Shadcn Card components featuring consistent padding (p-3, p-4), rounded corners (rounded-lg), and shadows (shadow-sm, shadow-md).

## Components & Cards
Cards include hover effects (hover:shadow-md transition-shadow) for clear visual feedback. Smooth transitions (duration-200, duration-300) enhance user interactions. Mobile-first responsive design with "md" breakpoint defining mobile view transitions.

## Icons & Visual Elements
Lucide icons are used exclusively throughout the application for consistency. Icons follow size conventions: w-4 h-4 for inline elements, w-5 h-5 for standard actions, w-6 h-6 for prominent features. Avatar components use consistent sizing with fallback initials.

## Interactive Elements
Buttons use variants from Shadcn UI (default, outline, ghost, destructive) with consistent hover states. All interactive elements provide visual feedback through color changes, shadows, or transforms. Loading states use skeleton components or spinners with animations. Tooltips use popover background (bg-popover) with border and shadow for clarity, displaying text in popover-foreground color to maintain readability in both light and dark themes without using accent colors.

## Content Structure
Clear visual hierarchy is established through typography scale, spacing, and color contrast. Section cards group related content with headers using consistent title styling. Empty states provide clear messaging and call-to-action buttons when no content exists.

## Animation & Motion
Subtle animations enhance user experience without distraction. Transitions apply to background-color, border-color, and color properties (0.2s ease-in-out). Hover effects use scale transforms (hover:scale-105) and shadow transitions for depth perception.

## Standardized Component Patterns
Action Buttons: Edit actions always use Pencil icon (w-4 h-4) with ghost variant buttons, delete actions use Trash2 icon (w-4 h-4) with text-destructive color class. All action buttons in dropdown menus include icon on left (mr-2 spacing) followed by text label. Primary save buttons use default variant with optional Loader2 icon (w-4 h-4 mr-2 animate-spin) during loading states, while cancel buttons use outline variant.

Confirmation Dialogs: Destructive actions require AlertDialog with consistent structure including AlertDialogTitle describing action, AlertDialogDescription explaining consequences, AlertDialogCancel button labeled "Cancel" with default styling, and AlertDialogAction button for confirmation. Delete confirmations use red destructive styling (bg-destructive text-destructive-foreground hover:bg-destructive/90) while exit/discard dialogs maintain default action button styling.

Icon Sizing Standards: Action icons in buttons and menus use w-4 h-4, section headers and primary features use w-5 h-5, prominent hero elements use w-6 h-6. Close/remove icons (X) consistently use w-4 h-4 in buttons and w-3 h-3 in badge-style removals. All Lucide icons maintain consistent stroke width and never mix icon libraries.

Button Hierarchy: Primary actions use default blue variant, secondary actions use outline variant, tertiary actions use ghost variant with transparent backgrounds (bg-transparent hover:bg-transparent), destructive actions use destructive variant. Loading states disable buttons and show spinner icon, all buttons provide hover state feedback through color or shadow changes.

Form Validation: Required fields marked with red asterisk (text-destructive), error states show red border (border-destructive) with error message below in small red text (text-sm text-destructive), character counters display remaining count with color change at 20 characters remaining (text-destructive when low, text-muted-foreground normally). All inputs provide clear visual feedback for focus, error, and disabled states using consistent border and shadow transitions.