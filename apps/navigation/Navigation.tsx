import { Chrome as Home, User, Settings, MessageCircle, Bell, Search, Bookmark, Users, Plus, Moon, Sun, Monitor } from "lucide-react"
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
import { NavigationHeaderContent } from "@shared/components/NavigationHeaderContent"
import { desktopNavigationItems, createButtonConfig } from "@shared/lib/navigation-config"

export function Navigation() {
  const location = useLocation()
  const { user, profile, isAuthenticated, loading } = useAuthContext()
  const { setTheme } = useTheme()

  return (
    <aside className="hidden lg:flex lg:w-64 xl:w-72 flex-col h-full bg-background/30 overflow-hidden">
      <div className="flex-1 p-4 space-y-4 overflow-y-auto"> 
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-3">
            <NavigationHeaderContent />
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Navigation items */}
            {desktopNavigationItems.map((item) => {
              const itemPath = typeof item.path === 'function' 
                ? item.path(profile, isAuthenticated) 
                : item.path
              
              return (
              <Button
                key={item.label}
                variant={location.pathname === itemPath ? "default" : "ghost"}
                className={`w-full justify-start h-12 px-4 ${
                  location.pathname === itemPath
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "hover:bg-accent/50 transition-colors"
                }`}
                asChild
              >
                <Link to={itemPath}>
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="text-base">{item.label}</span>
                </Link>
              </Button>
              )
            })}

            {/* Theme Toggle item */}
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button
  variant="ghost"
  className="w-full justify-start h-12 px-4 hover:bg-accent/50 transition-colors"
>
  <div className="relative h-5 w-5 mr-3">
    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    <Moon className="absolute inset-0 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
  </div>
  <span className="text-base">Theme</span>
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

{/* Create item */}
<Button
  variant="ghost"
  className="w-full justify-start h-12 px-4 text-base"
  onClick={createButtonConfig.onClick}
>
  <createButtonConfig.icon className="h-5 w-5 mr-3" />
  <span>{createButtonConfig.label}</span>
</Button>

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