import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSettingsData } from "./hooks/use-settings-data";
import {
  Clock,
  Palette,
  LogOut,
  Check,
  ChevronsUpDown,
  Users,
  Plus,
  Trash2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/components/auth-provider";
import { toast } from "sonner";
import { getStorageUrl } from "@/utils/getStorageUrl";
import {
  getMyPublicProfiles,
  deletePublicProfile,
} from "../../../shared-src/profile/api";
import { ProfileSwitcher } from "../../../shared-src/profile/ProfileSwitcher";

interface UserSettings {
  timezone: string;
  theme_mode: "light" | "dark" | "system";
  members_enabled: boolean;
}

interface MainSettingsProps {
  settings: UserSettings;
  allTimezones: TimezoneOption[];
  onUpdate: (
    data: Partial<UserSettings>
  ) => Promise<{ success: boolean; error?: unknown }>;
}

interface TimezoneOption {
  value: string;
  label: string;
  region: string;
  city: string;
  offset: string;
}

interface PublicProfile {
  id: string;
  name: string;
  username: string;
  about?: string;
  avatar_url?: string;
  profile_type: string;
  owner_id: string;
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
  const { settings, allTimezones, updateSettings, isLoading, error } =
    settingsData;

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
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

  return (
    <div className="container mx-auto px-6 py-6 max-w-4xl">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="general">Основное</TabsTrigger>
          <TabsTrigger value="profiles">Профили</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <MainSettings
            settings={settings}
            allTimezones={allTimezones}
            onUpdate={updateSettings}
          />
        </TabsContent>

        <TabsContent value="profiles">
          <ProfilesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function MainSettings({
  settings,
  allTimezones,
  onUpdate,
}: MainSettingsProps) {
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const { signOut } = useAuthContext();

  const [isProfileSwitcherOpen, setIsProfileSwitcherOpen] = useState(false);
  const [timezoneOpen, setTimezoneOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleTimezoneChange = async (timezone: string) => {
    const result = await onUpdate({ timezone });
    setTimezoneOpen(false);

    if (result.success) {
      toast.success("Часовой пояс сохранен");
    } else {
      toast.error("Не удалось сохранить часовой пояс");
    }
  };

  const handleThemeChange = async (theme: "light" | "dark" | "system") => {
    const result = await onUpdate({ theme_mode: theme });
    setTheme(theme);

    if (result.success) {
      toast.success("Тема сохранена");
    } else {
      toast.error("Не удалось сохранить тему");
    }
  };

  const handleMembersEnabledChange = async (enabled: boolean) => {
    const result = await onUpdate({ members_enabled: enabled });

    if (result.success) {
      toast.success("Настройка сохранена");
    } else {
      toast.error("Не удалось сохранить настройку");
    }
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
      {/* Members Tab Settings */}

      <ProfileSwitcher
        isOpen={isProfileSwitcherOpen}
        setIsOpen={setIsProfileSwitcherOpen}
        large
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Вкладка Участники
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="members-toggle">Включить вкладку Участники</Label>
              <p className="text-xs text-muted-foreground">
                Отображение вкладки с участниками в профиле
              </p>
            </div>
            <Switch
              id="members-toggle"
              checked={settings.members_enabled}
              onCheckedChange={handleMembersEnabledChange}
            />
          </div>
        </CardContent>
      </Card>

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
              Часовой пояс используется для корректного отображения даты и
              времени в различных функциях
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
            <p className="text-xs text-muted-foreground">Выберите режим</p>
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
                    <AlertDialogTitle>
                      Вы уверены, что хотите выйти из аккаунта?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Вы действительно хотите выйти из аккаунта?
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
    </div>
  );
}

function ProfilesTab() {
  const { profile } = useAuthContext();
  const navigate = useNavigate();
  const [publicProfiles, setPublicProfiles] = useState<PublicProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<PublicProfile | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProfiles = async () => {
    try {
      setLoadingProfiles(true);
      const data = await getMyPublicProfiles();
      setPublicProfiles(data as unknown as PublicProfile[]);
    } catch (error) {
      console.error("Failed to load public profiles", error);
      toast.error("Не удалось загрузить публичные профили");
    } finally {
      setLoadingProfiles(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleDeleteProfile = (profile: PublicProfile) => {
    setProfileToDelete(profile);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProfile = async () => {
    if (!profileToDelete) return;

    setIsDeleting(true);
    try {
      await deletePublicProfile(profileToDelete.id);
      toast.success(`Профиль "${profileToDelete.name}" удален`);
      loadProfiles();
    } catch (error) {
      console.error(error);
      toast.error("Не удалось удалить профиль");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setProfileToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Profile Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Личный профиль</h3>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14">
                <AvatarImage
                  src={
                    profile?.avatar_url
                      ? getStorageUrl(profile.avatar_url)
                      : undefined
                  }
                  alt="Profile"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {profile?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold truncate">
                    {profile?.name || "User"}
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  @{profile?.username || "username"}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/${profile?.username}`)}
              >
                Редактировать
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="h-px bg-border my-4"></div>

      {/* Public Profiles Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">
            Публичные профили ({publicProfiles.length})
          </h3>
        </div>

        {loadingProfiles ? (
          <Card className="shadow-sm">
            <CardContent className="p-8 text-center">
              <p className="text-sm text-muted-foreground">Загрузка...</p>
            </CardContent>
          </Card>
        ) : publicProfiles.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                У вас пока нет публичных профилей
              </p>
              <Button size="sm" onClick={() => navigate("/profile/create")}>
                <Plus className="w-4 h-4 mr-2" />
                Создать первый профиль
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {publicProfiles.map((publicProfile) => (
              <Card
                key={publicProfile.id}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-14 h-14">
                      <AvatarImage
                        src={
                          publicProfile.avatar_url
                            ? getStorageUrl(publicProfile.avatar_url)
                            : undefined
                        }
                        alt={publicProfile.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                        {publicProfile.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate mb-1">
                        {publicProfile.name}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        @{publicProfile.username}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/${publicProfile.username}`)}
                      >
                        Просмотр
                      </Button>
                      <AlertDialog
                        open={
                          deleteDialogOpen &&
                          profileToDelete?.id === publicProfile.id
                        }
                        onOpenChange={setDeleteDialogOpen}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteProfile(publicProfile)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Удалить профиль?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Вы уверены, что хотите удалить профиль "
                              {publicProfile.name}"? Это действие нельзя
                              отменить. Все данные профиля будут безвозвратно
                              удалены.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={confirmDeleteProfile}
                              disabled={isDeleting}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {isDeleting ? "Удаление..." : "Удалить"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
