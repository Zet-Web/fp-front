// Centralized navigation configuration for consistent navigation across desktop and mobile

import { Home, User, Settings, MessageCircle, Bell, Search, Bookmark, Users, Plus, Library, Network, Building2, CreditCard } from "lucide-react"
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
  { icon: Home, label: "Главная", path: "/" },
  //{ icon: Search, label: "Поиск", path: "/explore" },
  { icon: Network, label: "Нетворк", path: "/network" },
  { icon: Library, label: "ЮрСервисы", path: "/yurservice" },
  { icon: Building2, label: "Контрагенты", path: "/contragent" },
  { icon: CreditCard, label: "Рассрочка", path: "/split" },
  {
    icon: User,
    label: "Профиль",
    path: (profile, isAuthenticated) => {
      if (isAuthenticated && profile?.username) {
        return `/${profile.username}`
      }
      return '/auth'
    }
  },
  { icon: Settings, label: "Настройки", path: "/settings" },
]

// Mobile bottom navigation items (limited set for bottom bar)
export const mobileBottomNavigationItems: NavItem[] = [
  { icon: Home, label: "Главная", path: "/" },
  { 
    icon: User, 
    label: "Профиль", 
    path: (profile, isAuthenticated) => {
      if (isAuthenticated && profile?.username) {
        return `/${profile.username}` 
      }
      return '/auth'
    }
  },
  // Temproraily used Settings before realized Chats functionality. Then will change to Chats
  { icon: Settings, label: "Настройки", path: "/settings" },
]

// Create button configuration
export const createButtonConfig = {
  icon: Plus,
  label: "Создать пост",
  path: "/post"
}