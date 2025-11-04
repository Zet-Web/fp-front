import {
  User,
  Moon,
  Sun,
  Monitor,
  PanelLeftClose,
  PanelLeftOpen,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "@/components/auth-provider";
import { useTheme } from "next-themes";
import {
  desktopNavigationItems,
  createButtonConfig,
} from "@shared/navigation/navigation-config";
import { useSidebar } from "@/contexts/sidebar-context";

export function Navigation() {
  const location = useLocation();
  const { user, profile, isAuthenticated, loading } = useAuthContext();
  const { setTheme } = useTheme();
  const { leftCollapsed, rightCollapsed, toggleLeft, collapseAll, expandAll } =
    useSidebar();

  const handleFocusMode = () => {
    if (leftCollapsed && rightCollapsed) {
      expandAll();
    } else {
      collapseAll();
    }
  };

  if (leftCollapsed) {
    return (
      <aside className="hidden lg:flex lg:w-16 xl:w-18 flex-col h-full bg-background/30 overflow-hidden transition-all duration-300">
        <div className="flex-1 p-2 space-y-2 overflow-y-auto">
          <TooltipProvider>
            <div className="flex flex-col items-center space-y-3 py-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/"
                    className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <div className="h-5 w-5 rounded bg-white"></div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Social Network</p>
                </TooltipContent>
              </Tooltip>

              <div className="h-px w-8 bg-border"></div>

              {desktopNavigationItems.map((item) => {
                const itemPath =
                  typeof item.path === "function"
                    ? item.path(profile, isAuthenticated)
                    : item.path;

                return (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <Link to={itemPath}>
                        <Button
                          variant={
                            location.pathname === itemPath ? "default" : "ghost"
                          }
                          size="icon"
                          className={`h-10 w-10 ${
                            location.pathname === itemPath
                              ? "bg-blue-500 hover:bg-blue-600 text-white"
                              : "hover:bg-accent/50"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}

              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 hover:bg-accent/50"
                      >
                        <div className="relative h-5 w-5">
                          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                          <Moon className="absolute inset-0 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      side="right"
                      className="w-48"
                    >
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
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Theme</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={createButtonConfig.path}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 hover:bg-accent/50"
                    >
                      <createButtonConfig.icon className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{createButtonConfig.label}</p>
                </TooltipContent>
              </Tooltip>

              <div className="h-px w-8 bg-border mt-2"></div>

              {loading ? (
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
              ) : isAuthenticated && user ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={
                        typeof desktopNavigationItems[6].path === "function"
                          ? desktopNavigationItems[6].path(
                              profile,
                              isAuthenticated
                            )
                          : desktopNavigationItems[6].path
                      }
                    >
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer">
                        <span className="text-white font-semibold text-sm">
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>
                      {profile?.name ||
                        user.user_metadata?.name ||
                        user.email?.split("@")[0] ||
                        "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {profile?.username ? `@${profile.username}` : ""}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/auth">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Sign in</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <div className="h-px w-8 bg-border mt-2"></div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleLeft}
                    className="h-8 w-8 hover:bg-accent/50"
                  >
                    <PanelLeftOpen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Expand sidebar</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleFocusMode}
                    className="h-8 w-8 hover:bg-accent/50"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>
                    {leftCollapsed && rightCollapsed
                      ? "Expand All"
                      : "Focus Mode"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden lg:flex lg:w-64 xl:w-72 flex-col h-full bg-background/30 overflow-hidden transition-all duration-300">
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
                  ? item.path(profile, isAuthenticated)
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
                    ? desktopNavigationItems[6].path(profile, isAuthenticated)
                    : desktopNavigationItems[6].path
                }
                className="flex items-center space-x-3 px-4 py-2 hover:bg-accent/50 transition-colors rounded-md mt-2"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {profile?.name ||
                      user.user_metadata?.name ||
                      user.email?.split("@")[0] ||
                      "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile?.username ? `@${profile.username}` : ""}
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

            {/* Collapse Controls */}
            <div className="h-px bg-border mx-2 mt-4"></div>
            <div className="flex gap-2 mt-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleLeft}
                      className="flex-1 h-9 hover:bg-accent/50"
                    >
                      <PanelLeftClose className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Collapse this sidebar</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleFocusMode}
                      className="flex-1 h-9 hover:bg-accent/50"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {leftCollapsed && rightCollapsed
                        ? "Expand all sidebars"
                        : "Focus Mode (Collapse all sidebars)"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
