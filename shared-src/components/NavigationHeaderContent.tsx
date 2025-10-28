// Shared navigation header content with brand logo and user profile/sign-in section

import { Link } from "react-router-dom"
import { CardTitle } from "@/components/ui/card"
import { useAuthContext } from "@/components/auth-provider"
import { UserAvatar } from "@/components/shared/UserAvatar"
import { desktopNavigationItems } from "@shared/lib/navigation-config"

export function NavigationHeaderContent() {
  const { user, profile, loading, isAuthenticated } = useAuthContext()

  return (
    <>
      {/* Brand/Logo Section */}
      <Link to="/" className="flex flex-row items-center space-x-3 w-full justify-start h-auto px-4 py-2 hover:bg-accent/50 transition-colors rounded-md mb-2">
        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
          <div className="h-4 w-4 rounded bg-white"></div>
        </div>
        <CardTitle className="text-lg text-foreground">Social Network</CardTitle>
      </Link>
      
      {/* Separator after brand */}
      <div className="h-px bg-border mx-2"></div>

      {/* Navigation items will be inserted here by parent components */}
      
      {/* Separator before user profile */}
      <div className="h-px bg-border mx-2 mt-4"></div>

      {/* User Profile Section */}
      {loading ? (
        <div className="flex items-center space-x-3 px-4 py-2 mt-2">
          <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-muted rounded animate-pulse mb-1"></div>
            <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      ) : isAuthenticated && user ? (
        <Link to={typeof desktopNavigationItems[6].path === 'function' ? desktopNavigationItems[6].path(profile, isAuthenticated) : desktopNavigationItems[6].path} className="flex items-center space-x-3 px-4 py-2 hover:bg-accent/50 transition-colors rounded-md mt-2">
          <UserAvatar 
            user={{
              name: profile?.name || user.user_metadata?.name || null,
              username: profile?.username || null,
              avatar_url: profile?.avatar_url || null,
              badge: profile?.badge || null
            }}
            size="md"
            showVerifiedBadge={true}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {profile?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {profile?.username ? `@${profile.username}` : ''}
            </p>
          </div>
        </Link>
      ) : (
        <div className="flex items-center space-x-3 px-4 py-2 mt-2">
          <div className="h-10 w-10 rounded-full bg-muted"></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground">
              Not signed in
            </p>
            <p className="text-xs text-muted-foreground">
              <Link to="/auth" className="text-blue-500 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  )
}