import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { CommandList } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSettingsData } from "./hooks/use-settings-data";
import { Clock, Palette, LogOut, Check, ChevronsUpDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/components/auth-provider";

interface UserSettings {
  timezone: string;
  theme_mode: "light" | "dark" | "system";
}

interface MainSettingsProps {
  settings: UserSettings;
  allTimezones: TimezoneOption[];
  onUpdate: (data: Partial<UserSettings>) => void;
  hasUnsavedChanges: boolean;
}

interface TimezoneOption {
  value: string;
  label: string;
  region: string;
  city: string;
  offset: string;
}

export function SettingsPage() {
  const { session, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
  }, [isAuthenticated, navigate]);

  const settingsData = useSettingsData(session);
  const {
    settings,
    allTimezones,
    updateSettings,
    saveChanges,
    resetChanges,
    isLoading,
    error,
    hasUnsavedChanges,
  } = settingsData;

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">No settings found</p>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      await saveChanges(session);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  const handleReset = async () => {
    try {
      await resetChanges(session);
    } catch (error) {
      console.error("Failed to reset settings:", error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and application settings.
        </p>
      </div>

      <MainSettings
        settings={settings}
        allTimezones={allTimezones}
        onUpdate={updateSettings}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {hasUnsavedChanges && (
        <div className="mt-6 flex gap-4">
          <Button onClick={handleSave}>Save Changes</Button>
          <Button variant="outline" onClick={handleReset}>
            Reset Changes
          </Button>
        </div>
      )}
    </div>
  );
}

export function MainSettings({
  settings,
  allTimezones,
  onUpdate,
  hasUnsavedChanges,
}: MainSettingsProps) {
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const { signOut } = useAuthContext();
  const [timezoneOpen, setTimezoneOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter timezones based on search term
  const filteredTimezones = useMemo(() => {
    if (!searchTerm.trim()) return allTimezones || [];

    const search = searchTerm.toLowerCase();
    return (allTimezones || []).filter(
      (tz) =>
        tz.label.toLowerCase().includes(search) ||
        tz.region.toLowerCase().includes(search) ||
        tz.city.toLowerCase().includes(search) ||
        tz.value.toLowerCase().includes(search)
    );
  }, [allTimezones, searchTerm]);

  const handleTimezoneChange = (timezone: string) => {
    onUpdate({ timezone });
    setTimezoneOpen(false);
  };

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    onUpdate({ theme_mode: theme });
    setTheme(theme);
  };

  const handleExit = async () => {
    await signOut();
    navigate("/");
  };

  // Find current timezone label
  const currentTimezone = allTimezones.find(
    (tz) => tz.value === settings.timezone
  );
  const currentTimezoneLabel = currentTimezone?.label || settings.timezone;

  return (
    <div className="space-y-6">
      {/* Timezone Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Часовой пояс
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="timezone">Выберите свой часовой пояс</Label>
            <Popover open={timezoneOpen} onOpenChange={setTimezoneOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={timezoneOpen}
                  className="w-full justify-between"
                >
                  <span className="truncate">{currentTimezoneLabel}</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Поиск..."
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                  />
                  <CommandList>
                    <CommandEmpty>Не найдено.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {filteredTimezones.map((timezone) => (
                        <CommandItem
                          key={timezone.value}
                          value={timezone.value}
                          onSelect={() => handleTimezoneChange(timezone.value)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              settings.timezone === timezone.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <span>{timezone.label}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Часовой пояс используется для корректного отображения даты и времени в различных функциях
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Вид интерфейса
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="theme">Темы интерфейса</Label>
            <Select
              value={settings.theme_mode}
              onValueChange={handleThemeChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Светлый</SelectItem>
                <SelectItem value="dark">Темный</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Выберите режим
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Exit Settings */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <LogOut className="w-5 h-5" />
            Выход
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Завершение сеанса профиля
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Выйти из аккаунта
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Вы уверены, что хотите выйти из аккаунта?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {hasUnsavedChanges
                        ? "You have unsaved changes. Are you sure you want to exit without saving?"
                        : "Are you sure you want to exit the settings?"}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleExit}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Выйти
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasUnsavedChanges && (
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Сохраните новые настройки
          </p>
        </div>
      )}
    </div>
  );
}
