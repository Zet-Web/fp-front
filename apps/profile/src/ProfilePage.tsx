import { HeroSection } from "./components/hero-section"
import { PostsSection } from "./components/posts-section"
import { InformationSection } from "./components/information-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useProfileData } from "./hooks/use-profile-data"
import { useLocationData } from "./hooks/useLocationData"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuthContext } from "@/components/auth-provider"
import { ProfileEditProvider, useProfileEdit } from "./contexts/ProfileEditContext"

interface ProfilePageProps {
  username?: string // Optional prop to override URL-based username detection
}

function ProfilePageContent({ username }: ProfilePageProps) {
  const { user, isLoading, error, isOwnProfile, requestedUsername, redirectPath, refetchProfile } = useProfileData()
  const { session } = useAuthContext()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [profileData, setProfileData] = useState(user)
  const { globalEditMode, globalSaving, enterGlobalEditMode, exitGlobalEditMode, saveAllChanges } = useProfileEdit()

  const {
    cities,
    countries,
    isLoading: isLoadingLocation,
    error: locationError,
    addLocation,
    removeLocation,
    clearAllLocations,
    hasUnsavedChanges: hasLocationChanges,
    getAllLocations,
    getFormattedLocationString,
    refetchLocations
  } = useLocationData({
    profileId: user?.id || null,
    isOwnProfile
  })

  // Update local profile data when user data changes
  useEffect(() => {
    if (user) {
      setProfileData(user)
    }
  }, [user])

  // Handle redirection when user visits /profile
  useEffect(() => {
    if (redirectPath) {
      navigate(redirectPath, { replace: true })
    }
  }, [redirectPath, navigate])

  const handleEditToggle = () => {
    if (globalEditMode) {
      exitGlobalEditMode()
      setProfileData(user)
      refetchLocations()
    } else {
      enterGlobalEditMode()
    }
  }

  const handleSaveChanges = async () => {
    await saveAllChanges()
  }

  const updateProfileData = (updates: Partial<typeof profileData>) => {
    setProfileData(prev => prev ? { ...prev, ...updates } : null)
  }

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
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-destructive mb-2">
              {error === 'Profile not found' ? 'Profile not found' : 'Error loading profile'}
            </p>
            <p className="text-muted-foreground text-sm">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
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
                : 'Profile not available.'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-6 py-6 max-w-4xl">
        <HeroSection
          user={profileData}
          isOwnProfile={isOwnProfile}
          isEditing={globalEditMode}
          isSaving={globalSaving}
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
              isEditing={globalEditMode}
              onUpdateProfile={updateProfileData}
            />
          </TabsContent>
        </Tabs>
        
      </div>
    </div>
  )
}

export function ProfilePage(props: ProfilePageProps) {
  const { toast } = useToast()

  const handleSaveComplete = () => {
    toast({
      title: "Profile updated",
      description: "Your changes have been saved successfully.",
    })
  }

  const handleSaveError = (error: Error) => {
    toast({
      title: "Error",
      description: error.message || "Failed to save changes. Please try again.",
      variant: "destructive",
    })
  }

  return (
    <ProfileEditProvider onSaveComplete={handleSaveComplete} onSaveError={handleSaveError}>
      <ProfilePageContent {...props} />
    </ProfileEditProvider>
  )
}