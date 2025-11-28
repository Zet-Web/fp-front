import { HeroSection } from "./components/hero-section";
import { PostsSection } from "./components/posts-section";
import { InformationSection } from "./components/information-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useProfileData } from "./hooks/use-profile-data";
import { useLocationData } from "./hooks/use-location-data";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LocationItem } from "./types/location";
import { UserAdditionalInfo, UserProfile } from "./types/profile";
import { getObjectDifferences } from "@/utils/getObjectDifferences";
import { FPApi } from "@/lib/api";
import { useAuthContext } from "@/components/auth-provider";
import { Members } from "../../../shared-src/members/Members";
import { getMyProfileMembershipStatus } from "../../../shared-src/profile/api";
import type { MembershipStatusResponse } from "../../../shared-src/profile/types";
import { useActiveProfile } from "../../../shared-src/profile/ActiveProfileContext";

enum ProfileTabs {
  information = "information",
  posts = "posts",
  members = "members",
  public_profiles = "public_profiles",
}

export function ProfilePage() {
  const { updateProfilePartial } = useAuthContext();
  const { activeProfile } = useActiveProfile();

  const {
    user: profile,
    isLoading,
    error,
    isOwnProfile,
    requestedUsername,
    redirectPath,
    refetchProfile,
    addititonalInfo,
    setNeedLoadAdditionalInfo,
    isAdditionalInfoLoading,
  } = useProfileData();

  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentTab, setCurrentTab] = useState<ProfileTabs>(ProfileTabs.posts);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState(profile);
  const [currentAdditionalInfo, setCurrentAdditionalInfo] =
    useState(addititonalInfo);

  const [membershipStatus, setMembershipStatus] =
    useState<MembershipStatusResponse | null>(null);
  const [membersUpdateKey, setMembersUpdateKey] = useState(0);

  const [cities, setCities] = useState<LocationItem[]>([]);
  const [countries, setCountries] = useState<LocationItem[]>([]);

  const showProfileMembers = profileData?.members_enabled;
  const isPublicProfile = profileData?.profile_type === "public";

  const {
    addLocation,
    removeLocation,
    clearAllLocations,
    getFormattedLocationString,
    handleSaveLocation,
  } = useLocationData({
    user: profile,
    cities,
    setCities,
    countries,
    setCountries,
  });

  useEffect(() => {
    if (profile) {
      setProfileData(profile);
      setCities(profile.cities);
      setCountries(profile.countries);
    }
  }, [profile]);

  useEffect(() => {
    if (addititonalInfo) {
      setCurrentAdditionalInfo(addititonalInfo);
    }
  }, [addititonalInfo]);

  useEffect(() => {
    if (profile && !isOwnProfile) {
      getMyProfileMembershipStatus(profile.id)
        .then(setMembershipStatus)
        .catch(() => setMembershipStatus(null));
    }
  }, [profile, isOwnProfile]);

  useEffect(() => {
    if (redirectPath) {
      navigate(redirectPath);
    }
  }, [redirectPath, navigate]);

  useEffect(() => {
    setCurrentTab(ProfileTabs.posts);
  }, [profile]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setProfileData(profile);
      setCities(profile?.cities || []);
      setCountries(profile?.countries || []);
      setCurrentAdditionalInfo(addititonalInfo);
    }
  };

  const updateProfileData = async () => {
    if (!profile || !profileData) return;

    const dataToUpdate: Partial<
      UserProfile & { public_profile_id?: string | null }
    > = getObjectDifferences(profile, profileData);

    // For public profile
    if (isPublicProfile) {
      dataToUpdate["public_profile_id"] = profile.id;
    }

    await FPApi.axios.patch("/profile/update", dataToUpdate);
    updateProfilePartial(dataToUpdate);
  };

  const updateAdditionalInfo = async () => {
    if (!addititonalInfo || !currentAdditionalInfo) return;
    const dataToUpdate: Partial<
      UserAdditionalInfo & { public_profile_id?: string | null }
    > = currentAdditionalInfo;

    // For public profile
    if (isPublicProfile && profile) {
      dataToUpdate["public_profile_id"] = profile.id;
    }

    await FPApi.axios.patch("/profile/update-additional-info", dataToUpdate);
  };

  const [validationErrors, setValidationErrors] = useState<
    Record<string, boolean>
  >({});

  const handleValidationChange = useCallback(
    (section: string, isValid: boolean) => {
      setValidationErrors((prev) => ({ ...prev, [section]: !isValid }));
    },
    []
  );

  const handleSaveChanges = async () => {
    const hasErrors = Object.values(validationErrors).some(
      (hasError) => hasError
    );
    if (hasErrors) {
      toast({
        title: "Ошибка валидации",
        description: "Исправьте все ошибки перед сохранением.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      if (!isPublicProfile) {
        await handleSaveLocation();
      }

      await updateProfileData();
      await updateAdditionalInfo();
      await refetchProfile(true);
      setIsEditing(false);
    } catch (error) {
      toast({ title: (error as Error)?.message || "Saving error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateProfileData = (updates: Partial<UserProfile>) => {
    setProfileData((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const handleUpdateAdditionalInfo = (updates: Partial<UserAdditionalInfo>) => {
    setCurrentAdditionalInfo((prev) => (prev ? { ...prev, ...updates } : null));
  };

  useEffect(() => {
    if (currentTab === ProfileTabs.information) setNeedLoadAdditionalInfo(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab]);

  const handleMembershipUpdate = () => {
    if (profile && !isOwnProfile) {
      getMyProfileMembershipStatus(profile.id)
        .then(setMembershipStatus)
        .catch(() => setMembershipStatus(null));
    }
    setMembersUpdateKey((prev) => prev + 1);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-background flex items-center justify-center overflow-y-auto">
        <Card className="w-full max-w-sm mx-4">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Загрузка...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-sm mx-4">
          <CardContent className="p-6 text-center">
            <p className="text-destructive mb-2">
              {error === "Profile not found"
                ? "Profile not found"
                : "Error loading profile"}
            </p>
            <p className="text-muted-foreground text-sm">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show no profile found state
  if (!profileData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-sm mx-4">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              {requestedUsername
                ? `Profile @${requestedUsername} not found.`
                : "Profile not available."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 max-w-4xl">
        <HeroSection
          user={profileData}
          isOwnProfile={isOwnProfile}
          isEditing={isEditing}
          isSaving={isSaving}
          onEditToggle={handleEditToggle}
          onSaveChanges={handleSaveChanges}
          onUpdateProfile={handleUpdateProfileData}
          cities={cities}
          countries={countries}
          locationString={getFormattedLocationString()}
          onAddLocation={addLocation}
          onRemoveLocation={removeLocation}
          onClearAllLocations={clearAllLocations}
          isPublicProfile={isPublicProfile}
          membershipStatus={membershipStatus}
          onMembershipUpdate={handleMembershipUpdate}
        />

        <Tabs
          value={currentTab}
          onValueChange={(value) => setCurrentTab(value as ProfileTabs)}
          defaultValue="posts"
          className="w-full"
        >
          <TabsList
            className={`grid w-full ${
              showProfileMembers ? "grid-cols-3" : "grid-cols-2"
            } mb-6`}
          >
            <TabsTrigger value="posts" className="text-sm font-medium">
              Публикации
            </TabsTrigger>
            <TabsTrigger value="information" className="text-sm font-medium">
              Информация
            </TabsTrigger>
            {showProfileMembers && (
              <TabsTrigger value="members" className="text-sm font-medium">
                Участники
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            <PostsSection
              usernameFilter={profile?.username || ""}
              isOwnProfile={isOwnProfile}
            />
          </TabsContent>

          <TabsContent value="information" className="mt-0">
            <InformationSection
              additionalInfo={addititonalInfo}
              user={profileData}
              isEditing={isEditing}
              onUpdateProfile={handleUpdateProfileData}
              onUpdateAdditionalInfo={handleUpdateAdditionalInfo}
              isAdditionalInfoLoading={isAdditionalInfoLoading}
              onValidationChange={handleValidationChange}
              isPublicProfile={isPublicProfile}
            />
          </TabsContent>

          {showProfileMembers && (
            <TabsContent value="members" className="mt-0">
              <>
                {profileData.members_visibility === "owner" &&
                  profile?.id !== activeProfile?.id && (
                    <div className="w-full">
                      <p className="text-center text-muted-foreground">
                        Участников профиля может просматривать только владелец
                      </p>
                    </div>
                  )}

                {profileData.members_visibility === "members" &&
                  membershipStatus?.status !== "active" &&
                  profile?.id !== activeProfile?.id && (
                    <div className="w-full">
                      <p className="text-center text-muted-foreground">
                        Список участников доступен только для подписчиков
                      </p>
                    </div>
                  )}

                {(profileData.members_visibility === "all" ||
                  (profileData.members_visibility === "members" &&
                    membershipStatus?.status === "active") ||
                  profile?.id === activeProfile?.id) && (
                  <Members
                    profileId={profileData.id}
                    authorId={profileData.id}
                    currentUserId={activeProfile?.id}
                    defaultMembersVisibility={
                      profileData.members_visibility || "all"
                    }
                    defaultPrivacy={profileData.membership_privacy || "public"}
                    updateKey={membersUpdateKey}
                  />
                )}
              </>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
