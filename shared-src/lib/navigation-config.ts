// Centralized navigation configuration for consistent navigation across desktop and mobile

import { Home, User, Settings, MessageCircle, Bell, Search, Bookmark, Users, Plus, Library, Network } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { Profile } from "@/types/profile"

export interface NavItem {
  icon: LucideIcon
  label: string
  path: string | ((profile: Profile | null, isAuthenticated: boolean) => string)
  authRequired?: boolean
}

// Desktop navigation items (full list)
export const desktopNavigationItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Explore", path: "/explore" },
  { icon: Network, label: "Network", path: "/network" },
  { icon: Library, label: "Resources", path: "/yurservice" },
  {
    icon: User,
    label: "Profile",
    path: (profile, isAuthenticated) => {
      if (isAuthenticated && profile?.username) {
        return `/${profile.username}`
      }
      return '/auth'
    }
  },
  { icon: Settings, label: "Settings", path: "/settings" },
]

// Mobile bottom navigation items (limited set for bottom bar)
export const mobileBottomNavigationItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/" },
  { 
    icon: User, 
    label: "Profile", 
    path: (profile, isAuthenticated) => {
      if (isAuthenticated && profile?.username) {
        return `/${profile.username}`
      }
      return '/auth'
    }
  },
  { icon: MessageCircle, label: "Messages", path: "/chats" },
]

// Create button configuration
export const createButtonConfig = {
  icon: Plus,
  label: "Create",
  path: "/post"
}