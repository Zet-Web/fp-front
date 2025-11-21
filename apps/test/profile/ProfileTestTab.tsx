// Test profile page with mock data and Members tab
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MembersTab } from "../members/MembersTab";
import { mockProfileUser, mockAdditionalInfo } from "./mock-profile-data";
import { mockMembers, mockMembersStats } from "../members/mock-members-data";
import { MapPin, Camera, UserPlus } from "lucide-react";
import { BirthdayVisibility, UserAdditionalInfo, UserProfile } from "../../profile/src/types/profile";

enum ProfileTestTabs {
  posts = "posts",
  information = "information",
  members = "members",
}

export function ProfileTestTab() {
  const [currentTab, setCurrentTab] = useState<ProfileTestTabs>(ProfileTestTabs.posts);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>(mockProfileUser);
  const [additionalInfo, setAdditionalInfo] = useState<UserAdditionalInfo>(mockAdditionalInfo);

  const handleEditToggle = () => {
    if (isEditing) {
      setProfileData(mockProfileUser);
      setAdditionalInfo(mockAdditionalInfo);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", { profileData, additionalInfo });
    setIsEditing(false);
  };

  const getLocationString = () => {
    const locations = [];
    if (profileData.cities.length > 0) {
      locations.push(profileData.cities.map(c => c.name).join(", "));
    }
    if (profileData.countries.length > 0) {
      locations.push(profileData.countries.map(c => c.name).join(", "));
    }
    return locations.join(" • ") || "Локация не указана";
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 max-w-4xl">
        <Card className="mb-6 overflow-hidden">
          <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-500 to-blue-600">
            {profileData.cover_url ? (
              <img
                src={profileData.cover_url}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : null}
            {isEditing && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4 gap-2"
              >
                <Camera className="h-4 w-4" />
                Изменить обложку
              </Button>
            )}
          </div>

          <CardContent className="pt-0 px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-16 md:-mt-20">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                    <AvatarImage src={profileData.avatar_url || undefined} />
                    <AvatarFallback className="text-3xl">
                      {profileData.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="text-center md:text-left mb-4 md:mb-2">
                  {isEditing ? (
                    <Input
                      value={profileData.name || ""}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className="mb-2 text-xl font-bold"
                      placeholder="Имя"
                    />
                  ) : (
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <h1 className="text-2xl md:text-3xl font-bold">
                        {profileData.name}
                      </h1>
                      {profileData.badge?.includes("verified") && <VerifiedBadge />}
                      {profileData.badge?.includes("premium") && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                          Premium
                        </Badge>
                      )}
                    </div>
                  )}
                  {profileData.username && (
                    <p className="text-muted-foreground">@{profileData.username}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground justify-center md:justify-start">
                    <MapPin className="h-4 w-4" />
                    <span>{getLocationString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-center md:justify-end mb-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSaveChanges} size="sm" className="gap-2">
                      <Save className="h-4 w-4" />
                      Сохранить
                    </Button>
                    <Button onClick={handleEditToggle} variant="outline" size="sm" className="gap-2">
                      <X className="h-4 w-4" />
                      Отмена
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={handleEditToggle} variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Редактировать
                    </Button>
                    <Button variant="default" size="sm" className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Подписаться
                    </Button>
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <Textarea
                value={profileData.about || ""}
                onChange={(e) =>
                  setProfileData({ ...profileData, about: e.target.value })
                }
                placeholder="Расскажите о себе..."
                className="mt-4"
                rows={3}
              />
            ) : (
              profileData.about && (
                <p className="mt-4 text-muted-foreground whitespace-pre-wrap">
                  {profileData.about}
                </p>
              )
            )}
          </CardContent>
        </Card>

        <Tabs
          value={currentTab}
          onValueChange={(value) => setCurrentTab(value as ProfileTestTabs)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="posts" className="text-sm font-medium">
              Публикации
            </TabsTrigger>
            <TabsTrigger value="information" className="text-sm font-medium">
              Информация
            </TabsTrigger>
            <TabsTrigger value="members" className="text-sm font-medium">
              Участники
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Пока нет публикаций</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="information" className="mt-0">
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Контактная информация</h3>
                  <div className="space-y-3">
                    {additionalInfo.contact_info?.map((contact) => (
                      <div key={contact.id} className="flex items-center gap-3">
                        <Badge variant="outline">{contact.label}</Badge>
                        <span className="text-sm">{contact.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Опыт работы</h3>
                  <div className="space-y-4">
                    {additionalInfo.experience?.map((exp) => (
                      <div key={exp.id} className="border-l-2 border-blue-500 pl-4">
                        <h4 className="font-medium">{exp.position}</h4>
                        <p className="text-sm text-muted-foreground">{exp.company_name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(exp.start_date).getFullYear()} -{" "}
                          {exp.is_current ? "настоящее время" : new Date(exp.end_date!).getFullYear()}
                        </p>
                        {exp.description && (
                          <p className="text-sm mt-2">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Образование</h3>
                  <div className="space-y-4">
                    {additionalInfo.education?.map((edu) => (
                      <div key={edu.id} className="border-l-2 border-green-500 pl-4">
                        <h4 className="font-medium">{edu.institution_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {edu.degree} • {edu.field_of_study}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(edu.start_date).getFullYear()} -{" "}
                          {new Date(edu.end_date).getFullYear()}
                        </p>
                        {edu.description && (
                          <p className="text-sm mt-2">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Награды и достижения</h3>
                  <div className="space-y-4">
                    {additionalInfo.awards?.map((award) => (
                      <div key={award.id} className="border-l-2 border-amber-500 pl-4">
                        <h4 className="font-medium">{award.title}</h4>
                        <p className="text-sm text-muted-foreground">{award.issuer}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(award.date_received).toLocaleDateString("ru-RU")}
                        </p>
                        {award.description && (
                          <p className="text-sm mt-2">{award.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members" className="mt-0">
            <MembersTab
              members={mockMembers}
              stats={mockMembersStats}
              canManageMembers={true}
              onInviteMember={() => console.log("Invite member")}
              onRemoveMember={(id) => console.log("Remove member:", id)}
              onChangeRole={(id, role) => console.log("Change role:", id, role)}
              onApproveMember={(id) => console.log("Approve member:", id)}
              onRejectMember={(id) => console.log("Reject member:", id)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
