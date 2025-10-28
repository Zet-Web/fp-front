import { ChevronLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuthContext } from "@/components/auth-provider"

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile } = useAuthContext()

  const isHomePage = location.pathname === '/' || location.pathname === '/home'

  const getPageTitle = () => {
    const path = location.pathname

    if (path === '/' || path === '/home') return null
    if (path === '/settings') return 'Settings'
    if (path === '/auth') return 'Authentication'
    if (path === '/chats' || path === '/messages') return 'Messages'
    if (path === '/notifications') return 'Notifications'
    if (path === '/bookmarks') return 'Bookmarks'
    if (path === '/explore') return 'Explore'
    if (path === '/communities') return 'Communities'
    if (path.startsWith('/post/')) return 'Post'
    if (path === '/profile' || (profile?.username && path === `/${profile.username}`)) {
      return profile?.name || profile?.username || 'Profile'
    }
    if (path.startsWith('/')) {
      const username = path.substring(1)
      if (username && !username.includes('/')) {
        return `@${username}`
      }
    }

    return null
  }

  const canGoBack = () => {
    return window.history.length > 1
  }

  const handleBack = () => {
    if (canGoBack()) {
      navigate(-1)
    }
  }

  const pageTitle = getPageTitle()

  if (!pageTitle && !isHomePage) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 justify-between">
        <div className="flex items-center">
          {canGoBack() && !isHomePage && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 mr-2"
              onClick={handleBack}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Go back</span>
            </Button>
          )}
          {pageTitle && (
            <h1 className="text-lg font-semibold text-foreground truncate">
              {pageTitle}
            </h1>
          )}
        </div>
        {isHomePage && (
          <Button
            size="sm"
            onClick={() => navigate("/post?mode=create")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">Create</span>
          </Button>
        )}
      </div>
    </header>
  )
}