import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  UserPlus,
  Loader as Loader2,
  MapPin,
  Camera,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { LocationSelector } from "./LocationSelector";
import { LocationItem } from "../types/location";
import { UserProfile } from "../types/profile";
import { FPApi } from "@/lib/api";
import { useAuthContext } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { getStorageUrl } from "@/utils/getStorageUrl";
import { CharacterCounter } from "@/components/shared/CharacterCounter";

interface HeroSectionProps {
  user: UserProfile;
  isOwnProfile: boolean;
  isEditing: boolean;
  isSaving?: boolean;
  onEditToggle: () => void;
  onSaveChanges: () => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  cities: LocationItem[];
  countries: LocationItem[];
  locationString: string;
  onAddLocation: (location: LocationItem) => boolean;
  onRemoveLocation: (location: LocationItem) => void;
  onClearAllLocations: () => void;
}

export function HeroSection({
  user,
  isOwnProfile,
  isEditing,
  isSaving = false,
  onEditToggle,
  onSaveChanges,
  onUpdateProfile,
  cities,
  countries,
  locationString,
  onAddLocation,
  onRemoveLocation,
  onClearAllLocations,
}: HeroSectionProps) {
  const { updateProfilePartial } = useAuthContext();
  const { toast } = useToast();

  const [isFollowing, setIsFollowing] = useState(Boolean(user.is_following));
  const [isFollowingLoading, setFollowingLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const displayName = user.name || user.username || "User";
  const displayUsername = user.username || user.telegram_username || "user";
  const avatarFallback = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const NAME_MAX_LENGTH = 50;
  const ABOUT_MAX_LENGTH = 400;

  const handleNameChange = (value: string) => {
    onUpdateProfile({ name: value });
  };

  const handleAboutChange = (value: string) => {
    onUpdateProfile({ about: value });
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await FPApi.axios.post<{ filePath: string }>(
        "profile/upload-avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!res.data?.filePath) return;

      const uniqueVersion = new Date().getTime();
      const newUrl = `${res.data.filePath}?v=${uniqueVersion}`;
      await FPApi.axios.patch("/profile/update", {
        avatar_url: newUrl,
      });
      onUpdateProfile({
        avatar_url: newUrl,
      });
      updateProfilePartial({ avatar_url: newUrl });
    } catch (error) {
      console.error("Avatar upload failed:", error);
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = "";
    }
  };

  const handleCoverUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await FPApi.axios.post<{ filePath: string }>(
        "profile/upload-cover",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!res.data?.filePath) return;

      const uniqueVersion = new Date().getTime();
      const newUrl = `${res.data.filePath}?v=${uniqueVersion}`;
      await FPApi.axios.patch("/profile/update", {
        cover_url: newUrl,
      });
      onUpdateProfile({
        cover_url: newUrl,
      });
    } catch (error) {
      console.error("Cover upload failed:", error);
    } finally {
      setIsUploadingCover(false);
      event.target.value = "";
    }
  };

  const handleToggleFollow = async () => {
    setFollowingLoading(true);

    try {
      const res = await FPApi.axios.post<{ isNowFollowing: boolean }>(
        `/profile/toggle-follow/${user.username}`
      );
      setIsFollowing(res.data.isNowFollowing);
    } catch (error) {
      console.error(error);
      toast({
        title: "Following error",
        description: (error as Error)?.message || "",
      });
    } finally {
      setFollowingLoading(false);
    }
  };

  return (
    <div className="relative w-full mb-6 md:mb-8">
      <div className="relative h-48 md:h-64 w-full overflow-hidden rounded-lg">
        {user.cover_url ? (
          <img
            src={getStorageUrl(user.cover_url)}
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-800" />
        )}
        <div className="absolute inset-0 bg-black/20" />

        {isEditing && (
          <div className="absolute top-4 right-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
              id="cover-upload"
              disabled={isUploadingCover}
            />
            <label htmlFor="cover-upload">
              <Button
                variant="secondary"
                size="sm"
                className="gap-2 cursor-pointer"
                disabled={isUploadingCover}
                asChild
              >
                <span>
                  {isUploadingCover ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {isUploadingCover ? "Загрузка..." : "Изменить обложку"}
                </span>
              </Button>
            </label>
          </div>
        )}
      </div>

      <div className="relative px-6 pb-4">
        <div className="relative inline-block -mt-20 z-10">
          <Avatar className="w-40 h-40 border-4 border-background shadow-xl">
            <AvatarImage
              src={user.avatar_url ? getStorageUrl(user.avatar_url) : undefined}
              alt="Profile"
            />
            <AvatarFallback className="text-2xl text-gray-700">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>

          {isEditing && (
            <div className="absolute bottom-2 right-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                id="avatar-upload"
                disabled={isUploadingAvatar}
              />
              <label htmlFor="avatar-upload">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full p-0 cursor-pointer shadow-lg"
                  disabled={isUploadingAvatar}
                  asChild
                >
                  <span>
                    {isUploadingAvatar ? (
                      <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                    ) : (
                      <Camera className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                  </span>
                </Button>
              </label>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between items-start">
          <div className="flex-1 max-w-[70%]">
            <div className="flex items-center gap-2 mb-2">
              {isEditing ? (
                <div className="flex-1">
                  <Input
                    value={user.name || ""}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="text-2xl md:text-3xl font-bold border border-input rounded-md px-3 py-2 h-auto bg-background focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Enter your name"
                    maxLength={NAME_MAX_LENGTH}
                  />
                  <div className="flex justify-end mt-1">
                    <CharacterCounter
                      current={user.name?.length || 0}
                      max={NAME_MAX_LENGTH}
                    />
                  </div>
                </div>
              ) : (
                <h1 className="text-3xl font-bold truncate overflow-hidden">
                  {displayName}
                </h1>
              )}
              {user.badge?.includes("verified") && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            <p className="text-muted-foreground mb-2">@{displayUsername}</p>

            {isEditing ? (
              <div className="mb-4 max-w-4xl">
                <Textarea
                  value={user.about || ""}
                  onChange={(e) => handleAboutChange(e.target.value)}
                  className="resize-none"
                  placeholder="Tell others about yourself..."
                  rows={3}
                  maxLength={ABOUT_MAX_LENGTH}
                />
                <div className="flex justify-end mt-1">
                  <CharacterCounter
                    current={user.about?.length || 0}
                    max={ABOUT_MAX_LENGTH}
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm md:text-base text-foreground mb-4 max-w-2xl break-words leading-relaxed whitespace-pre-wrap">
                {user.about || ""}
              </p>
            )}

            {isEditing ? (
              <div className="mb-4 max-w-2xl">
                <LocationSelector
                  cities={cities}
                  countries={countries}
                  onAddLocation={onAddLocation}
                  onRemoveLocation={onRemoveLocation}
                  onClearAll={onClearAllLocations}
                  maxLocations={3}
                />
              </div>
            ) : (
              locationString && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{locationString}</span>
                </div>
              )
            )}
          </div>

          <div className="w-full md:w-auto md:ml-6 mt-0 md:mt-2 flex gap-2 md:gap-3 justify-end md:justify-start">
            {isOwnProfile ? (
              <>
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-4 md:px-6 py-2 rounded-full font-medium transition-colors text-sm"
                      onClick={onEditToggle}
                      disabled={isSaving}
                    >
                      Отмена
                    </Button>
                    <Button
                      size="sm"
                      className="px-4 md:px-6 py-2 rounded-full font-medium transition-colors text-sm"
                      onClick={onSaveChanges}
                      disabled={isSaving}
                    >
                      {isSaving && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      {isSaving ? "Сохраняется..." : "Сохранить"}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-4 md:px-6 py-2 rounded-full font-medium transition-colors text-sm"
                    onClick={onEditToggle}
                  >
                    Ред.
                  </Button>
                )}
              </>
            ) : (
              <>
                {/* TODO: Uncomment when chat functionality is ready */}
                {/* <Button
                  variant="outline"
                  className="px-4 py-2 rounded-full font-medium transition-colors"
                  onClick={() => {
     
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Чат
                </Button> */}
                <Button
                  onClick={handleToggleFollow}
                  disabled={isFollowingLoading}
                  variant="outline"
                  size="sm"
                  className="px-4 md:px-6 py-2 rounded-full font-medium transition-colors text-sm flex-1 md:flex-none"
                >
                  {isFollowingLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {!isFollowing && <UserPlus className="w-4 h-4 mr-2" />}
                      {isFollowing ? "Отписаться" : "Подписаться"}
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
