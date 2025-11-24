// Public profile test tab with mock data and create menu simulation
import { useState } from 'react';
import { ProfilePage } from '@/apps/profile/src/ProfilePage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, UserPlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const mockPublicProfile = {
  id: 'mock-public-profile-id',
  name: 'TechCorp Solutions',
  username: 'techcorp',
  avatar_url: null,
  cover_url: null,
  about: 'Leading software development company specializing in enterprise solutions and digital transformation.',
  telegram_username: null,
  profile_type: 'company',
  badge: ['verified'],
  created_at: '2024-01-15T10:00:00Z',
  cities: [
    { id: 1, name: 'Москва', type: 'city' as const },
    { id: 2, name: 'Санкт-Петербург', type: 'city' as const },
  ],
  countries: [
    { id: 1, name: 'Россия', type: 'country' as const },
  ],
  additional_info: 'Founded in 2010, TechCorp has grown to serve over 500 clients worldwide.',
  birthday: null,
  birthday_visibility: null,
  birthday_show_age: null,
  is_following: false,
};

export function PublicProfileTestTab() {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [creatingProfile, setCreatingProfile] = useState(false);

  const handleCreatePost = () => {
    setShowCreateMenu(false);
    alert('Create Post clicked - would navigate to post creation');
  };

  const handleCreateProfile = () => {
    setShowCreateMenu(false);
    setCreatingProfile(true);
    alert('Create Profile clicked - entering edit mode for new profile');
  };

  return (
    <div className="space-y-6">
      {/* Test Navigation Sidebar Preview */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Updated Sidebar Navigation (Preview)</h3>
          <div className="space-y-2 max-w-xs">
            <div className="text-sm text-muted-foreground mb-2">Bottom items:</div>

            {/* Create Button with Dropdown */}
            <DropdownMenu open={showCreateMenu} onOpenChange={setShowCreateMenu}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 px-4 hover:bg-accent/50"
                >
                  <Plus className="h-5 w-5 mr-3" />
                  <span className="text-base">+ Создать</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={handleCreatePost}>
                  <FileText className="h-4 w-4 mr-2" />
                  Создать пост
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCreateProfile}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Создать профиль
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-px bg-border mx-2 my-2"></div>

            {/* Mock User Profile Display */}
            <div className="flex items-center space-x-3 px-4 py-2 hover:bg-accent/50 transition-colors rounded-md cursor-pointer">
              <Avatar className="w-10 h-10">
                <AvatarImage src={undefined} alt="Profile" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-sm text-white">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  John Doe
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  @john
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Public Profile Display */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Public Profile Preview</h3>
              <p className="text-sm text-muted-foreground">
                {creatingProfile
                  ? 'Edit mode: Creating new public profile'
                  : 'Viewing existing public profile'}
              </p>
            </div>
            {!creatingProfile && (
              <Button
                onClick={() => setCreatingProfile(true)}
                variant="outline"
                size="sm"
              >
                Enter Edit Mode
              </Button>
            )}
          </div>

          {/* Note about mock data */}
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Примечание:</strong> Это демо режим с моковыми данными. Здесь показан пример публичного профиля компании "TechCorp Solutions" с аналогичным дизайном как у личного профиля.
            </p>
          </div>

          {creatingProfile && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Edit Mode Active:</strong> You can now edit profile settings similar to personal profile editing.
              </p>
              <Button
                onClick={() => setCreatingProfile(false)}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Exit Edit Mode
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Render the actual profile using ProfilePage component structure */}
      <div className="border border-border rounded-lg p-6">
        <div className="text-sm text-muted-foreground mb-4">
          Profile render area (using ProfilePage component structure)
        </div>

        {/* Mock profile hero section */}
        <div className="relative w-full mb-6">
          <div className="relative h-48 md:h-64 w-full overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-800" />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="relative px-6 pb-4">
            <div className="relative inline-block -mt-20 z-10">
              <Avatar className="w-40 h-40 border-4 border-background shadow-xl">
                <AvatarImage src={undefined} alt="Profile" />
                <AvatarFallback className="text-2xl text-gray-700">
                  TC
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="mt-4 flex justify-between items-start">
              <div className="flex-1 max-w-[70%]">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold truncate overflow-hidden">
                    {mockPublicProfile.name}
                  </h1>
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
                </div>

                <p className="text-muted-foreground mb-2">@{mockPublicProfile.username}</p>

                <p className="text-sm md:text-base text-foreground mb-4 max-w-2xl break-words leading-relaxed whitespace-pre-wrap">
                  {mockPublicProfile.about}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                    Company Profile
                  </span>
                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                    3 Team Members
                  </span>
                </div>
              </div>

              <div className="w-full md:w-auto md:ml-6 mt-0 md:mt-2 flex gap-2 md:gap-3 justify-end md:justify-start">
                {creatingProfile ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-4 md:px-6 py-2 rounded-full font-medium transition-colors text-sm"
                      onClick={() => setCreatingProfile(false)}
                    >
                      Отмена
                    </Button>
                    <Button
                      size="sm"
                      className="px-4 md:px-6 py-2 rounded-full font-medium transition-colors text-sm"
                      onClick={() => {
                        alert('Saving public profile...');
                        setCreatingProfile(false);
                      }}
                    >
                      Сохранить
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-4 md:px-6 py-2 rounded-full font-medium transition-colors text-sm"
                  >
                    Подписаться
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mock tabs */}
        <div className="border-b border-border">
          <div className="flex gap-8 px-6">
            <button className="py-3 px-1 border-b-2 border-blue-500 text-sm font-medium text-blue-500">
              Публикации
            </button>
            <button className="py-3 px-1 border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:text-foreground">
              Информация
            </button>
          </div>
        </div>

        {/* Mock content area */}
        <div className="mt-6 px-6">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Profile content will appear here (posts, information sections, team members, etc.)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
