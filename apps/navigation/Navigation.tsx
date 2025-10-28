import { Home, User, Settings, MessageCircle, Bell, Search, Bookmark, Users, Plus, Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, useLocation } from "react-router-dom"
import { useAuthContext } from "@/components/auth-provider"
import { useTheme } from "next-themes"

export function Navigation() {
  const location = useLocation()
  const { user, profile, isAuthenticated, loading } = useAuthContext()
  const { setTheme } = useTheme()

  const getProfilePath = () => {
    if (isAuthenticated && profile?.username) {
      return `/${profile.username}`
    }
    return '/auth'
  }

  return (
    <aside className="hidden lg:flex lg:w-64 xl:w-72 flex-col h-full bg-background/30 overflow-hidden">
      <div className="flex-1 p-4 space-y-4 overflow-y-auto"> 
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
  <Button variant="ghost" className="w-full justify-start h-auto p-0 hover:bg-transparent">
    <Link to="/" className="flex flex-row items-center space-x-3">
      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
        <div className="h-4 w-4 rounded bg-white"></div>
      </div>
      <CardTitle className="text-xl font-bold text-foreground">Social Network</CardTitle>
    </Link>
  </Button>
</CardHeader>
          <CardContent className="space-y-2">
            {/* Brand as first nav item */}
            {/*<div className="flex items-center space-x-3 px-4 py-2">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <div className="h-4 w-4 rounded bg-white"></div>
              </div>
              <span className="text-xl font-bold text-foreground">FP Network</span>
            </div>*/}

            {/* Navigation items */}
            {[
              { icon: Home, label: "Home", path: "/" },
              { icon: Search, label: "Explore", path: "/explore" },
              { icon: Bell, label: "Notifications", path: "/notifications" },
              { icon: MessageCircle, label: "Messages", path: "/messages" },
              { icon: Bookmark, label: "Bookmarks", path: "/bookmarks" },
              { icon: Users, label: "Communities", path: "/communities" },
              { icon: User, label: "Profile", path: getProfilePath() },
              { icon: Settings, label: "Settings", path: "/settings" },
            ].map((item) => (
              <Button
                key={item.label}
                variant={location.pathname === item.path ? "default" : "ghost"}
                className={`w-full justify-start h-12 px-4 ${
                  location.pathname === item.path
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "hover:bg-accent/50 transition-colors"
                }`}
                asChild
              >
                <Link to={item.path}>
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="text-base">{item.label}</span>
                </Link>
              </Button>
            ))}

            {/* Theme Toggle как навигационный пункт */}
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button
      variant="ghost"
      className={`w-full justify-start h-12 px-4 hover:bg-accent/50 transition-colors`}
    >
      <Sun className="h-5 w-5 mr-3 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute left-6 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="text-base ml-3 dark:ml-0">Theme</span>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start" className="w-48">
    <DropdownMenuItem onClick={() => setTheme("light")}>
      <Sun className="mr-2 h-4 w-4" />
      Light
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => setTheme("dark")}>
      <Moon className="mr-2 h-4 w-4" />
      Dark
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => setTheme("system")}>
      <Monitor className="mr-2 h-4 w-4" />
      System
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

{/* Create как навигационный пункт */}
<Button
  variant="ghost"
  className="w-full justify-start h-12 px-4 hover:bg-accent/50 transition-colors text-base"
  onClick={() => {
    console.log('Create button clicked')
  }}
>
  <Plus className="h-5 w-5 mr-3" />
  <span>Create</span>
</Button>

            {/* User Profile */}
            {loading ? (
              <div className="flex items-center space-x-3 px-4 py-2">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-muted rounded animate-pulse mb-1"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center space-x-3 px-4 py-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {profile?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile?.username ? `@${profile.username}` : ''}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 px-4 py-2">
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
          </CardContent>
        </Card>

        {/* Version Display */}
        <div className="px-4 pb-4">
          <p className="text-xs text-muted-foreground text-center">
            v{(window as any).APP_VERSION || '1.0.0'}
          </p>
        </div>
      </div>
    </aside>
  )
}