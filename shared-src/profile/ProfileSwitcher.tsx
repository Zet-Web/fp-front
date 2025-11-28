import { useEffect } from "react";
import { Check, ChevronDown, User, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useActiveProfile } from "./ActiveProfileContext";
import { useAuthContext } from "@/components/auth-provider";
import { getStorageUrl } from "@/utils/getStorageUrl";
import { useNavigate } from "react-router-dom";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  large?: boolean;
};

export function ProfileSwitcher({ isOpen, setIsOpen, large }: Props) {
  const navigate = useNavigate();
  const { profile } = useAuthContext();
  const {
    activeProfile,
    publicProfiles,
    setActiveProfile,
    loadPublicProfiles,
  } = useActiveProfile();

  useEffect(() => {
    if (!activeProfile && profile) {
      setActiveProfile({
        id: profile.id,
        name: profile.name || "",
        username: profile.username || "",
        avatar_url: profile.avatar_url || undefined,
        isPublicProfile: false,
      });
    }
  }, [profile, activeProfile, setActiveProfile]);

  useEffect(() => {
    loadPublicProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!profile || !activeProfile) return null;

  const personalProfile = {
    id: profile.id,
    name: profile.name || "",
    username: profile.username || "",
    avatar_url: profile.avatar_url || undefined,
    isPublicProfile: false,
  };

  const handleSelectProfile = (selectedProfile: typeof activeProfile) => {
    setActiveProfile(selectedProfile);
    setIsOpen(false);
  };

  const handleManageProfiles = () => {
    navigate(`/${profile.username}?tab=public_profiles`);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex flex-1 w-full justify-between items-center gap-2 px-2 h-auto hover:bg-accent"
        >
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={
                  activeProfile.avatar_url
                    ? getStorageUrl(activeProfile.avatar_url)
                    : undefined
                }
                alt={activeProfile.name}
              />
              <AvatarFallback className="text-xs">
                {activeProfile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start min-w-0">
              <p
                className={
                  large
                    ? "text-sm font-medium truncate "
                    : "text-xs font-medium truncate max-w-[120px]"
                }
              >
                {activeProfile.name}
              </p>
              <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                @{activeProfile.username}
              </p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Переключить профиль</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Personal Profile */}
        <DropdownMenuItem
          onClick={() => handleSelectProfile(personalProfile)}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={
                personalProfile.avatar_url
                  ? getStorageUrl(personalProfile.avatar_url)
                  : undefined
              }
              alt={personalProfile.name}
            />
            <AvatarFallback className="text-sm">
              {personalProfile.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <User className="w-3 h-3 text-muted-foreground" />
              <p className="text-sm font-medium truncate">
                {personalProfile.name}
              </p>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              @{personalProfile.username}
            </p>
          </div>
          {activeProfile.id === personalProfile.id && (
            <Check className="w-4 h-4 text-primary" />
          )}
        </DropdownMenuItem>

        {publicProfiles.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Публичные профили
            </DropdownMenuLabel>
            {publicProfiles.map((publicProfile) => (
              <DropdownMenuItem
                key={publicProfile.id}
                onClick={() => handleSelectProfile(publicProfile)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={
                      publicProfile.avatar_url
                        ? getStorageUrl(publicProfile.avatar_url)
                        : undefined
                    }
                    alt={publicProfile.name}
                  />
                  <AvatarFallback className="text-sm">
                    {publicProfile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <p className="text-sm font-medium truncate">
                      {publicProfile.name}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    @{publicProfile.username}
                  </p>
                </div>
                {activeProfile.id === publicProfile.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </>
        )}

        {!large && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleManageProfiles}
              className="cursor-pointer text-primary"
            >
              <Users className="w-4 h-4 mr-2" />
              Управление профилями
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
