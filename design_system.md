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
Buttons use variants from Shadcn UI (default, outline, ghost, destructive) with consistent hover states. All interactive elements provide visual feedback through color changes, shadows, or transforms. Loading states use skeleton components or spinners with animations.

## Content Structure
Clear visual hierarchy is established through typography scale, spacing, and color contrast. Section cards group related content with headers using consistent title styling. Empty states provide clear messaging and call-to-action buttons when no content exists.

## Animation & Motion
Subtle animations enhance user experience without distraction. Transitions apply to background-color, border-color, and color properties (0.2s ease-in-out). Hover effects use scale transforms (hover:scale-105) and shadow transitions for depth perception.
