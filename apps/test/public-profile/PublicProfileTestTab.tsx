// Public profile test tab with mock data, settings profiles tab, and join request form inside Members tab
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, UserPlus, Trash2, Users, Lock, Globe, Send } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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
  privacy: 'private' as const,
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

const mockUserProfiles = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    username: 'techcorp',
    avatar_url: null,
    profile_type: 'company',
    role: 'owner',
    members_count: 12,
    privacy: 'private' as const,
    created_at: '2024-01-15',
  },
  {
    id: '2',
    name: 'OpenSource Initiative',
    username: 'opensource_pro',
    avatar_url: null,
    profile_type: 'organization',
    role: 'admin',
    members_count: 5,
    privacy: 'public' as const,
    created_at: '2024-03-20',
  },
  {
    id: '3',
    name: 'Legal Compliance Team',
    username: 'legal_team',
    avatar_url: null,
    profile_type: 'project',
    role: 'member',
    members_count: 8,
    privacy: 'private' as const,
    created_at: '2024-05-10',
  },
];

const getProfileTypeIcon = (type: string) => {
  switch (type) {
    case 'company':
      return Building2;
    case 'organization':
      return Users;
    case 'project':
      return FolderKanban;
    default:
      return UserCircle;
  }
};

const getProfileTypeLabel = (type: string) => {
  switch (type) {
    case 'company':
      return 'Компания';
    case 'organization':
      return 'Организация';
    case 'project':
      return 'Проект';
    default:
      return 'Профиль';
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'owner':
      return 'Владелец';
    case 'admin':
      return 'Администратор';
    case 'member':
      return 'Участник';
    default:
      return 'Участник';
  }
};

export function PublicProfileTestTab() {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [profiles, setProfiles] = useState(mockUserProfiles);
  const [joinMessage, setJoinMessage] = useState('');
  const [activeProfileTab, setActiveProfileTab] = useState('posts');

  const handleCreatePost = () => {
    setShowCreateMenu(false);
    toast.info('Создать пост - переход к созданию поста');
  };

  const handleCreateProfile = () => {
    setShowCreateMenu(false);
    setCreatingProfile(true);
    toast.info('Создать профиль - вход в режим создания профиля');
  };

  const handleDeleteProfile = (profileId: string, profileName: string) => {
    setProfiles(profiles.filter(p => p.id !== profileId));
    toast.success(`Профиль "${profileName}" удален`);
  };

  const handleJoinRequest = () => {
    if (mockPublicProfile.privacy === 'public') {
      toast.success('Вы успешно присоединились к профилю!');
    } else {
      toast.success('Запрос на присоединение отправлен. Ожидайте подтверждения от администратора.');
    }
    setJoinMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Test Navigation Sidebar Preview */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Нижняя часть панели меню</h3>
          <div className="space-y-2 max-w-xs">
            <div className="text-sm text-muted-foreground mb-2">Кнопка для создания поста и профиля</div>

            {/* Create Button with Dropdown */}
            <DropdownMenu open={showCreateMenu} onOpenChange={setShowCreateMenu}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 px-4 hover:bg-accent/50"
                >
                  <Plus className="h-5 w-5 mr-3" />
                  <span className="text-base">Создать</span>
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

      {/* Settings Page Simulation with Profiles Tab */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Настройки (страница /settings)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Пример доп таба для отображения списка своих профилей на странице настроек
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profiles" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Основное</TabsTrigger>
              <TabsTrigger value="profiles">Профили</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <p className="text-sm text-muted-foreground">Основные настройки...</p>
            </TabsContent>

            <TabsContent value="profiles" className="space-y-4">
              {/* Personal Profile Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold">Личный профиль</h3>
                </div>

                <Card className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14">
                        <AvatarImage src={undefined} alt="Profile" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          JD
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold truncate">John Doe</h4>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">@john</p>
                      </div>

                      <Button variant="outline" size="sm">
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
                  <h3 className="text-base font-semibold">Публичные профили ({profiles.length})</h3>

                </div>

                {profiles.length === 0 ? (
                  <Card className="shadow-sm">
                    <CardContent className="p-8 text-center">
                      <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-4">
                        У вас пока нет публичных профилей
                      </p>
                      <Button size="sm" onClick={handleCreateProfile}>
                        <Plus className="w-4 h-4 mr-2" />
                        Создать первый профиль
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {profiles.map((profile) => {
                      const canDelete = profile.role === 'owner';

                      return (
                        <Card key={profile.id} className="shadow-sm hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="w-14 h-14">
                                <AvatarImage src={profile.avatar_url || undefined} alt={profile.name} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                                  {profile.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold truncate mb-1">{profile.name}</h4>
                                <p className="text-sm text-muted-foreground truncate">@{profile.username}</p>
                              </div>

                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Просмотр
                                </Button>
                                {canDelete && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Удалить профиль?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Вы уверены, что хотите удалить профиль "{profile.name}"? Это действие нельзя отменить.
                                          Все данные профиля будут безвозвратно удалены.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteProfile(profile.id, profile.name)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Удалить
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Public Profile Display */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Просмотр публичного профиля</h3>
              <p className="text-sm text-muted-foreground">
                {creatingProfile
                  ? 'Режим редактирования: Создание нового публичного профиля'
                  : 'Просмотр существующего публичного профиля'}
              </p>
            </div>
            {!creatingProfile && (
              <Button
                onClick={() => setCreatingProfile(true)}
                variant="outline"
                size="sm"
              >
                Войти в режим редактирования
              </Button>
            )}
          </div>

          {/* Note about mock data */}
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Примечание:</strong> Это демо режим с моковыми данными. Показан пример публичного профиля компании с дизайном, аналогичным личному профилю.
            </p>
          </div>

          {creatingProfile && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Режим редактирования активен:</strong> Здесь можно редактировать настройки профиля аналогично редактированию личного профиля.
              </p>
              <Button
                onClick={() => setCreatingProfile(false)}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Выйти из режима редактирования
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Render the actual profile using ProfilePage component structure */}
      <div className="border border-border rounded-lg p-6">
        <div className="text-sm text-muted-foreground mb-4">
          Область отображения профиля (использует структуру компонента ProfilePage)
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

            <div className="mt-4 flex flex-col md:flex-row justify-between items-start gap-4">
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
                    Профиль компании
                  </span>
                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                    3 участника
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
                        toast.success('Профиль сохранен');
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
        <Tabs value={activeProfileTab} onValueChange={setActiveProfileTab} className="w-full">
          <div className="border-b border-border">
            <TabsList className="bg-transparent h-auto p-0 space-x-8 px-6">
              <TabsTrigger
                value="posts"
                className="py-3 px-1 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 rounded-none bg-transparent"
              >
                Публикации
              </TabsTrigger>
              <TabsTrigger
                value="info"
                className="py-3 px-1 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 rounded-none bg-transparent"
              >
                Информация
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="py-3 px-1 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 rounded-none bg-transparent"
              >
                Участники
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Posts Tab */}
          <TabsContent value="posts" className="mt-6 px-6">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Здесь будут публикации профиля
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Info Tab */}
          <TabsContent value="info" className="mt-6 px-6">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Здесь будет информация о профиле
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members Tab with Join Request Form */}
          <TabsContent value="members" className="mt-6 px-6 space-y-4">
            {/* Join Request Form */}
            {!creatingProfile && (
              <Card className="shadow-sm border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-base">Запрос на присоединение</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {mockPublicProfile.privacy === 'private'
                      ? 'Отправьте запрос для присоединения к этому приватному профилю'
                      : 'Присоединитесь к этому открытому профилю'}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleJoinRequest}
                    size="sm"
                    className="w-full md:w-auto"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {mockPublicProfile.privacy === 'private' ? 'Отправить запрос' : 'Присоединиться'}
                  </Button>

                  {mockPublicProfile.privacy === 'private' && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                      <p className="text-xs text-amber-800 dark:text-amber-200">
                        <Lock className="w-3 h-3 inline mr-1" />
                        Это приватный профиль. Ваш запрос будет рассмотрен администратором.
                      </p>
                    </div>
                  )}

                  {mockPublicProfile.privacy === 'public' && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                      <p className="text-xs text-green-800 dark:text-green-200">
                        <Globe className="w-3 h-3 inline mr-1" />
                        Это открытый профиль. Вы можете присоединиться сразу без подтверждения.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Members List */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-semibold">Участники (3)</h3>
                </div>
                <p className="text-sm text-muted-foreground text-center py-4">
                  Список участников профиля появится здесь
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
