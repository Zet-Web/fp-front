import { HeroSection } from "./components/hero-section";
import { PostsSection } from "./components/posts-section";
import { InformationSection } from "./components/information-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useProfileData } from "./hooks/use-profile-data";
import { useLocationData } from "./hooks/useLocationData";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function ProfilePage() {
  const {
    user,
    isLoading,
    error,
    isOwnProfile,
    requestedUsername,
    redirectPath,
  } = useProfileData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState(user);

  const {
    cities,
    countries,
    addLocation,
    removeLocation,
    clearAllLocations,
    getFormattedLocationString,
    refetchLocations,
  } = useLocationData({
    profileId: user?.id || null,
    isOwnProfile,
  });

  // Update local profile data when user data changes
  useEffect(() => {
    if (user) {
      setProfileData(user);
    }
  }, [user]);

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
      refetchLocations();
    }
  };

  const handleSaveChanges = async () => {
    console.log("=========================================");
    console.log(
      "🚀 [Profile Save] Starting profile save operation at:",
      new Date().toISOString()
    );
    console.log("=========================================");

    // TEMPORARY: Save locally without database for testing
    console.log(
      "🧪 [Profile Save] TEMPORARY MODE: Saving locally without database"
    );
    setIsSaving(true);

    try {
      // Simulate API delay for realistic testing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("✅ [Profile Save] Local save completed successfully");
      console.log("📋 [Profile Save] Updated profile data:", {
        name: profileData?.name,
        about: profileData?.about,
        hasContactInfo: !!profileData?.contact_info,
        contactInfoCount: profileData?.contact_info?.length || 0,
      });

      // Exit edit mode
      setIsEditing(false);

      toast({
        title: "Profile updated (locally)",
        description: "Your changes have been saved locally for testing.",
      });

      console.log("=========================================");
      console.log("✅ [Profile Save] Temporary local save completed");
      console.log("=========================================");
    } catch (error) {
      console.error("❌ [Profile Save] Temporary save failed:", error);
      toast({
        title: "Error",
        description: "Failed to save changes locally.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }

    return;
  };

  const updateProfileData = (updates: Partial<typeof profileData>) => {
    setProfileData((prev) => (prev ? { ...prev, ...updates } : null));
  };

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
          onUpdateProfile={updateProfileData}
          cities={cities}
          countries={countries}
          locationString={getFormattedLocationString()}
          onAddLocation={addLocation}
          onRemoveLocation={removeLocation}
          onClearAllLocations={clearAllLocations}
        />

        <Tabs defaultValue="posts" className="w-full">
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
              user={profileData}
              isOwnProfile={isOwnProfile}
              isEditing={isEditing}
              onUpdateProfile={updateProfileData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
