// Universal members management UI for profiles, events, quizzes, and chats
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MoreVertical, UserPlus, Shield, Crown, UserX, Check, X } from "lucide-react";
import { Member, MemberRole, MemberStatus, MembersStats, MemberFilterType } from "./member-types";

interface MembersTabProps {
  members: Member[];
  stats: MembersStats;
  canManageMembers?: boolean;
  onInviteMember?: () => void;
  onRemoveMember?: (memberId: string) => void;
  onChangeRole?: (memberId: string, newRole: MemberRole) => void;
  onApproveMember?: (memberId: string) => void;
  onRejectMember?: (memberId: string) => void;
}

export function MembersTab({
  members,
  stats,
  canManageMembers = false,
  onInviteMember,
  onRemoveMember,
  onChangeRole,
  onApproveMember,
  onRejectMember,
}: MembersTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<MemberFilterType>("all");

  const getRoleBadge = (role: MemberRole) => {
    const roleConfig = {
      [MemberRole.owner]: { label: "Владелец", icon: Crown, variant: "default" as const },
      [MemberRole.admin]: { label: "Администратор", icon: Shield, variant: "secondary" as const },
      [MemberRole.moderator]: { label: "Модератор", icon: Shield, variant: "outline" as const },
      [MemberRole.member]: { label: "Участник", icon: null, variant: "outline" as const },
      [MemberRole.pending]: { label: "Ожидает", icon: null, variant: "outline" as const },
      [MemberRole.invited]: { label: "Приглашён", icon: null, variant: "outline" as const },
    };

    const config = roleConfig[role];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        {Icon && <Icon className="h-3 w-3" />}
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: MemberStatus) => {
    const statusConfig = {
      [MemberStatus.active]: { label: "Активен", className: "bg-green-500/10 text-green-500" },
      [MemberStatus.pending]: { label: "Ожидает", className: "bg-yellow-500/10 text-yellow-500" },
      [MemberStatus.invited]: { label: "Приглашён", className: "bg-blue-500/10 text-blue-500" },
      [MemberStatus.blocked]: { label: "Заблокирован", className: "bg-red-500/10 text-red-500" },
      [MemberStatus.left]: { label: "Вышел", className: "bg-gray-500/10 text-gray-500" },
    };

    const config = statusConfig[status];
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.username?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterType === "all" ||
      (filterType === "active" && member.status === MemberStatus.active) ||
      (filterType === "pending" && member.status === MemberStatus.pending) ||
      (filterType === "admins" && (member.role === MemberRole.admin || member.role === MemberRole.owner));

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Участники</CardTitle>
            {canManageMembers && onInviteMember && (
              <Button onClick={onInviteMember} size="sm" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Пригласить
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Всего</div>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <div className="text-2xl font-bold text-green-500">{stats.active}</div>
              <div className="text-sm text-muted-foreground">Активных</div>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Ожидают</div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <div className="text-2xl font-bold text-blue-500">{stats.admins}</div>
              <div className="text-sm text-muted-foreground">Админов</div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по имени или username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={filterType} onValueChange={(v) => setFilterType(v as MemberFilterType)}>
              <TabsList>
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="active">Активные</TabsTrigger>
                <TabsTrigger value="pending">Ожидают</TabsTrigger>
                <TabsTrigger value="admins">Админы</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "Участники не найдены" : "Нет участников"}
              </div>
            ) : (
              filteredMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <UserAvatar
                        src={member.avatar_url}
                        alt={member.name}
                        size="md"
                        className="flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium truncate">{member.name}</h3>
                          {member.badge?.includes("verified") && <VerifiedBadge />}
                          {member.badge?.includes("premium") && (
                            <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                              Premium
                            </Badge>
                          )}
                        </div>
                        {member.username && (
                          <p className="text-sm text-muted-foreground truncate">@{member.username}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {getRoleBadge(member.role)}
                          {getStatusBadge(member.status)}
                          <span className="text-xs text-muted-foreground">
                            Вступил {new Date(member.joined_at).toLocaleDateString("ru-RU")}
                          </span>
                        </div>
                      </div>

                      {canManageMembers && member.role !== MemberRole.owner && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {member.status === MemberStatus.pending && (
                              <>
                                {onApproveMember && (
                                  <DropdownMenuItem onClick={() => onApproveMember(member.id)}>
                                    <Check className="h-4 w-4 mr-2" />
                                    Одобрить
                                  </DropdownMenuItem>
                                )}
                                {onRejectMember && (
                                  <DropdownMenuItem onClick={() => onRejectMember(member.id)}>
                                    <X className="h-4 w-4 mr-2" />
                                    Отклонить
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                              </>
                            )}
                            {onChangeRole && member.status === MemberStatus.active && (
                              <>
                                {member.role !== MemberRole.admin && (
                                  <DropdownMenuItem onClick={() => onChangeRole(member.id, MemberRole.admin)}>
                                    <Shield className="h-4 w-4 mr-2" />
                                    Сделать админом
                                  </DropdownMenuItem>
                                )}
                                {member.role === MemberRole.admin && (
                                  <DropdownMenuItem onClick={() => onChangeRole(member.id, MemberRole.member)}>
                                    Снять права админа
                                  </DropdownMenuItem>
                                )}
                                {member.role !== MemberRole.moderator && (
                                  <DropdownMenuItem onClick={() => onChangeRole(member.id, MemberRole.moderator)}>
                                    Сделать модератором
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                              </>
                            )}
                            {onRemoveMember && (
                              <DropdownMenuItem
                                onClick={() => onRemoveMember(member.id)}
                                className="text-destructive"
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Удалить
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
