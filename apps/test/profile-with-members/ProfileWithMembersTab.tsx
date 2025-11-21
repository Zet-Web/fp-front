// Test profile page with members tab for evaluating members design
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, UserPlus, Users } from 'lucide-react';
import { Members } from './Members';

// Mock user data
const mockUser = {
  id: '1',
  name: 'Tech Community',
  username: 'techcommunity',
  about: 'A vibrant community of developers, designers, and tech enthusiasts. Join us to learn, share, and grow together!',
  avatar_url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
  cover_url: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1200',
  location: 'San Francisco, CA',
  badge: 'verified',
  membersCount: 8,
  followersCount: 1234,
};

type TabValue = 'posts' | 'information' | 'members';

export function ProfileWithMembersTab() {
  const [activeTab, setActiveTab] = useState<TabValue>('members');
  const [isFollowing, setIsFollowing] = useState(false);

  const avatarFallback = mockUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-0">
          {/* Hero Section */}
          <div className="relative w-full">
            {/* Cover Image */}
            <div className="relative h-48 md:h-64 w-full overflow-hidden rounded-t-lg">
              {mockUser.cover_url ? (
                <img
                  src={mockUser.cover_url}
                  alt="Cover"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700" />
              )}
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Profile Info */}
            <div className="relative px-6 pb-4">
              <div className="relative inline-block -mt-20 z-10">
                <Avatar className="w-40 h-40 border-4 border-background shadow-xl">
                  <AvatarImage src={mockUser.avatar_url} alt="Profile" />
                  <AvatarFallback className="text-2xl text-gray-700">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="mt-4 flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1 max-w-[70%]">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold">{mockUser.name}</h1>
                    {mockUser.badge?.includes('verified') && (
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

                  <p className="text-muted-foreground mb-2">@{mockUser.username}</p>

                  <p className="text-sm md:text-base text-foreground mb-4 max-w-2xl break-words leading-relaxed">
                    {mockUser.about}
                  </p>

                  {mockUser.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{mockUser.location}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">{mockUser.membersCount}</span>
                      <span className="text-muted-foreground">members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{mockUser.followersCount}</span>
                      <span className="text-muted-foreground">followers</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={isFollowing ? 'outline' : 'default'}
                    size="sm"
                    className="px-6 py-2 rounded-full font-medium transition-colors"
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    {!isFollowing && <UserPlus className="w-4 h-4 mr-2" />}
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabValue)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="posts" className="text-sm font-medium">
            Posts
          </TabsTrigger>
          <TabsTrigger value="information" className="text-sm font-medium">
            Information
          </TabsTrigger>
          <TabsTrigger value="members" className="text-sm font-medium">
            Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-muted-foreground">
                Posts section (empty for testing)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="information" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-muted-foreground">
                Information section (empty for testing)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="mt-0">
          <MembersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
