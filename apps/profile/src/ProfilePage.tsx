import { HeroSection } from "./components/hero-section";
import { PostsSection } from "./components/posts-section";
import { InformationSection } from "./components/information-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useProfileData } from "./hooks/use-profile-data";
import { useLocationData } from "./hooks/use-location-data";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LocationItem } from "./types/location";
import { UserAdditionalInfo, UserProfile } from "./types/profile";
import { getObjectDifferences } from "@/utils/getObjectDifferences";
import { FPApi } from "@/lib/api";

enum ProfileTabs {
  information = "information",
  posts = "posts",
}

export function ProfilePage() {
  const {
    user,
    isLoading,
    error,
    isOwnProfile,
    requestedUsername,
    redirectPath,
    refetchProfile,
    addititonalInfo,
    setNeedLoadAdditionalInfo,
  } = useProfileData();

  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentTab, setCurrentTab] = useState<ProfileTabs>(ProfileTabs.posts);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState(user);
  const [currentAdditionalInfo, setCurrentAdditionalInfo] =
    useState(addititonalInfo);

  const [cities, setCities] = useState<LocationItem[]>([]);
  const [countries, setCountries] = useState<LocationItem[]>([]);

  const {
    addLocation,
    removeLocation,
    clearAllLocations,
    getFormattedLocationString,
    handleSaveLocation,
  } = useLocationData({
    user,
    cities,
    setCities,
    countries,
    setCountries,
  });

  useEffect(() => {
    if (user) {
      setProfileData(user);
      setCities(user.cities);
      setCountries(user.countries);
    }
  }, [user]);

  useEffect(() => {
    if (addititonalInfo) {
      setCurrentAdditionalInfo(addititonalInfo);
    }
  }, [addititonalInfo]);

  // Handle redirection when user visits /profile
  useEffect(() => {
    if (redirectPath) {
      navigate(redirectPath, { replace: true });
    }
  }, [redirectPath, navigate]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setProfileData(user);
      setCities(user?.cities || []);
      setCountries(user?.countries || []);
      setCurrentAdditionalInfo(addititonalInfo);
    }
  };

  const updateProfileData = async () => {
    if (!user || !profileData) return;

    const dataToUpdate: Partial<UserProfile> = getObjectDifferences(
      user,
      profileData
    );

    await FPApi.axios.patch("/profile/update", dataToUpdate);
  };

  const updateAdditionalInfo = async () => {
    if (!addititonalInfo || !currentAdditionalInfo) return;
    const dataToUpdate: Partial<UserAdditionalInfo> = currentAdditionalInfo;

    await FPApi.axios.patch("/profile/update-additional-info", dataToUpdate);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);

    try {
      await handleSaveLocation();
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-background flex items-center justify-center overflow-y-auto">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
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
        <Card className="w-96">
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
      <div className="container mx-auto px-6 py-6 max-w-4xl">
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
        />

        <Tabs
          value={currentTab}
          onValueChange={(value) => setCurrentTab(value as ProfileTabs)}
          defaultValue="posts"
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="posts" className="text-sm font-medium">
              Posts
            </TabsTrigger>
            <TabsTrigger value="information" className="text-sm font-medium">
              Information
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            <PostsSection user={profileData} isOwnProfile={isOwnProfile} />
          </TabsContent>

          <TabsContent value="information" className="mt-0">
            <InformationSection
              additionalInfo={addititonalInfo}
              user={profileData}
              isOwnProfile={isOwnProfile}
              isEditing={isEditing}
              onUpdateProfile={handleUpdateProfileData}
              onUpdateAdditionalInfo={handleUpdateAdditionalInfo}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
