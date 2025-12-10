import { Menu, Plus, FileText, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "@/components/auth-provider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  desktopNavigationItems,
  mobileBottomNavigationItems,
} from "@shared/navigation/navigation-config";
import { ProfileSwitcher } from "../../shared-src/profile/ProfileSwitcher";
import { useActiveProfile } from "../../shared-src/profile/ActiveProfileContext";

export function MobileNav() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const { activeProfile } = useActiveProfile();

  return (
    <>
      {/* Bottom Fixed Navigation Bar - Only visible on mobile */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around px-2 py-2 relative">
          {/* Navigation Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center justify-center h-12 w-12 p-1"
              >
                <Menu className="h-5 w-5" />
                <span className="text-xs mt-1">Меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="mt-6 space-y-2">
                {desktopNavigationItems.map((item) => {
                  const itemPath =
                    typeof item.path === "function"
                      ? item.path(activeProfile, isAuthenticated)
                      : item.path;

                  return (
                    <Button
                      key={item.label}
                      variant={
                        location.pathname === itemPath ? "default" : "ghost"
                      }
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
                  );
                })}

                <ProfileSwitcher
                  isOpen={isProfileOpen}
                  setIsOpen={setIsProfileOpen}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Bottom Navigation Items - First Half */}
          {mobileBottomNavigationItems.slice(0, 1).map((item) => {
            const itemPath =
              typeof item.path === "function"
                ? item.path(activeProfile, isAuthenticated)
                : item.path;

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
            );
          })}

          {/* Elevated Create Dropdown Button - Center */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="icon"
                className="h-14 w-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 -mt-6 relative"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              side="top"
              className="mb-2 bg-background/95 backdrop-blur-md border border-border/50 shadow-xl rounded-xl min-w-[200px]"
            >
              <DropdownMenuItem
                asChild
                className="cursor-pointer py-3 px-4 focus:bg-blue-500/10"
              >
                <Link to="/post" className="flex items-center gap-3">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Создать пост</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="cursor-pointer py-3 px-4 focus:bg-blue-500/10"
              >
                <Link to="/profile/create" className="flex items-center gap-3">
                  <UserPlus className="h-4 w-4" />
                  <span className="font-medium">Создать профиль</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Bottom Navigation Items - Second Half */}
          {mobileBottomNavigationItems.slice(1).map((item) => {
            const itemPath =
              typeof item.path === "function"
                ? item.path(activeProfile, isAuthenticated)
                : item.path;

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
            );
          })}
        </div>
      </div>

      {/* Bottom padding to prevent content from being hidden behind the fixed nav */}
      <div className="md:hidden h-16"></div>
    </>
  );
}
