import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, UserPlus, Loader as Loader2, MapPin, Camera, Upload } from "lucide-react"
import { useState } from "react"
import { LocationSelector } from "./LocationSelector"
import { LocationItem } from "../types/location"
import { UserAvatar } from "@/components/shared/UserAvatar"
import { VerifiedBadge } from "@/components/shared/VerifiedBadge"

interface UserProfile {
  id: string
  name: string | null
  username: string | null
  avatar_url: string | null
  about: string | null
  telegram_username: string | null
  profile_type: string | null
  badge: string[] | null
  contact_info: any[] | null
  cover_url?: string | null
}

interface HeroSectionProps {
  user: UserProfile
  isOwnProfile: boolean
  isEditing: boolean
  isSaving?: boolean
  onEditToggle: () => void
  onSaveChanges: () => void
  onUpdateProfile: (updates: Partial<UserProfile>) => void
  cities: LocationItem[]
  countries: LocationItem[]
  locationString: string
  onAddLocation: (location: LocationItem) => boolean
  onRemoveLocation: (location: LocationItem) => void
  onClearAllLocations: () => void
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
  onClearAllLocations
}: HeroSectionProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)

  const displayName = user.name || user.username || 'User'
  const displayUsername = user.username || user.telegram_username || 'user'
  const avatarFallback = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const handleNameChange = (value: string) => {
    onUpdateProfile({ name: value })
  }

  const handleAboutChange = (value: string) => {
    onUpdateProfile({ about: value })
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploadingAvatar(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      const tempUrl = URL.createObjectURL(file)
      onUpdateProfile({ avatar_url: tempUrl })
      console.log('Avatar uploaded (simulated):', file.name)
    } catch (error) {
      console.error('Avatar upload failed:', error)
    } finally {
      setIsUploadingAvatar(false)
      event.target.value = ''
    }
  }

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploadingCover(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      const tempUrl = URL.createObjectURL(file)
      onUpdateProfile({ cover_url: tempUrl })
      console.log('Cover uploaded (simulated):', file.name)
    } catch (error) {
      console.error('Cover upload failed:', error)
    } finally {
      setIsUploadingCover(false)
      event.target.value = ''
    }
  }
  return (
    <div className="relative w-full mb-8">
      <div className="relative h-64 w-full overflow-hidden rounded-lg">
        {user.cover_url ? (
          <img 
            src={user.cover_url} 
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
                  {isUploadingCover ? 'Uploading...' : 'Change Cover'}
                </span>
              </Button>
            </label>
          </div>
        )}
      </div>
      
      <div className="relative px-6 pb-4">
        <div className="relative inline-block -mt-20 z-10">
          <UserAvatar
            src={user.avatar_url}
            alt={displayName}
            fallback={avatarFallback}
            size="2xl"
            className="border-4 border-background shadow-xl"
          />
          
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
                  className="w-10 h-10 rounded-full p-0 cursor-pointer shadow-lg"
                  disabled={isUploadingAvatar}
                  asChild
                >
                  <span>
                    {isUploadingAvatar ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </span>
                </Button>
              </label>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isEditing ? (
                <Input
                  value={user.name || ''}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="text-3xl font-bold border border-input rounded-md px-3 py-2 h-auto bg-background focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Enter your name"
                />
              ) : (
                <h1 className="text-3xl font-bold">{displayName}</h1>
              )}
              <VerifiedBadge isVerified={user.badge?.includes('verified')} size="md" />
            </div>
            
            <p className="text-muted-foreground mb-2">@{displayUsername}</p>
            
            {isEditing ? (
              <Textarea
                value={user.about || ''}
                onChange={(e) => handleAboutChange(e.target.value)}
                className="mb-4 max-w-4xl resize-none"
                placeholder="Tell others about yourself..."
                rows={3}
              />
            ) : (
              <p className="text-foreground mb-4 max-w-2xl">
                {user.about || 'Welcome to my profile!'}
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
           
          <div className="ml-6 mt-2 flex gap-3">
            {isOwnProfile || true ? (
              <>
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      className="px-6 py-2 rounded-full font-medium transition-colors"
                      onClick={onEditToggle}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="px-6 py-2 rounded-full font-medium transition-colors"
                      onClick={onSaveChanges}
                      disabled={isSaving}
                    >
                      {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline"
                    className="px-6 py-2 rounded-full font-medium transition-colors"
                    onClick={onEditToggle}
                  >
                    Edit Profile
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button 
                  variant="outline"
                  className="px-4 py-2 rounded-full font-medium transition-colors"
                  onClick={() => {/* TODO: Implement messages navigation */}}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button 
                  onClick={() => setIsFollowing(!isFollowing)}
                  variant="outline"
                  className="px-6 py-2 rounded-full font-medium transition-colors"
                >
                  {!isFollowing && <UserPlus className="w-4 h-4 mr-2" />}
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}