/* eslint-disable @typescript-eslint/no-explicit-any */
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "@/components/auth-provider";
import { useTheme } from "next-themes";
import {
  desktopNavigationItems,
  createButtonConfig,
} from "@shared/lib/navigation-config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navigation() {
  const location = useLocation();
  const { profile: user, isAuthenticated, loading } = useAuthContext();
  const { setTheme } = useTheme();

  const displayName = user?.name || user?.username || "User";
  const avatarFallback = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="hidden lg:flex lg:w-64 xl:w-72 flex-col h-full bg-background/30 overflow-hidden">
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-3">
            <Link
              to="/"
              className="flex flex-row items-center space-x-3 w-full justify-start h-auto px-4 py-2 hover:bg-accent/50 transition-colors rounded-md mb-2"
            >
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <div className="h-4 w-4 rounded bg-white"></div>
              </div>
              <CardTitle className="text-lg text-foreground">
                Social Network
              </CardTitle>
            </Link>

            {/* Separator after brand */}
            <div className="h-px bg-border mx-2"></div>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Navigation items */}
            {desktopNavigationItems.map((item) => {
              const itemPath =
                typeof item.path === "function"
                  ? item.path(user, isAuthenticated)
                  : item.path;

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
              );
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
              asChild
            >
              <Link to={createButtonConfig.path}>
                <createButtonConfig.icon className="h-5 w-5 mr-3" />
                <span>{createButtonConfig.label}</span>
              </Link>
            </Button>

            {/* Separator before user profile */}
            <div className="h-px bg-border mx-2 mt-4"></div>

            {/* User Profile */}
            {loading ? (
              <div className="flex items-center space-x-3 px-4 py-2 mt-2">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-muted rounded animate-pulse mb-1"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            ) : isAuthenticated && user ? (
              <Link
                to={
                  typeof desktopNavigationItems[6].path === "function"
                    ? desktopNavigationItems[6].path(user, isAuthenticated)
                    : desktopNavigationItems[6].path
                }
                className="flex items-center space-x-3 px-4 py-2 hover:bg-accent/50 transition-colors rounded-md mt-2"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={user.avatar_url || undefined}
                    alt="Profile"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-sm text-white">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.username ? `@${user.username}` : ""}
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
          </CardContent>
        </Card>

        {/* Version Display */}
        <div className="px-4 pb-4">
          <p className="text-xs text-muted-foreground text-center">
            v{(window as any).APP_VERSION || "1.0.0"}
          </p>
        </div>
      </div>
    </aside>
  );
}
