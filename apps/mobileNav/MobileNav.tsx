import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import { useAuthContext } from "@/components/auth-provider"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { desktopNavigationItems, mobileBottomNavigationItems } from "@/shared-src/lib/navigation-config"

export function MobileNav() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, profile } = useAuthContext()

  const handleChatsToggle = () => {
    // This will be handled by the parent component
    // For now, we'll just show a placeholder action
    console.log("Toggle Chats")
  }

  return (
    <>
      {/* Bottom Fixed Navigation Bar - Only visible on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
        <div className="flex items-center justify-around px-2 py-2">
          {/* Navigation Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center justify-center h-12 w-12 p-1"
              >
                <Menu className="h-5 w-5" />
                <span className="text-xs mt-1">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
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
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to={itemPath}>
                      <item.icon className="h-5 w-5 mr-3" />
                      <span className="text-base">{item.label}</span>
                    </Link>
                  </Button>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>

          {/* Bottom Navigation Items */}
          {mobileBottomNavigationItems.map((item) => {
            const itemPath = typeof item.path === 'function' 
              ? item.path(profile, isAuthenticated) 
              : item.path
            
            return (
              <Button
                key={item.label}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center justify-center h-12 w-12 p-1 ${
                  location.pathname === itemPath ? "text-blue-500" : ""
                }`}
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link to={itemPath}>
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Bottom padding to prevent content from being hidden behind the fixed nav */}
      <div className="md:hidden h-16"></div>
    </>
  )
}