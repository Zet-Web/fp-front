import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserPlus,
  Search,
  Users,
  Clock,
  UserX,
  Check,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Member } from "./types";
import {
  fetchEventMembers,
  acceptMember,
  declineMember,
  removeMember,
  changeEventPrivacy,
  changeEventMembersVisibility,
} from "./api";
import {
  fetchProfileMembers,
  acceptProfileMember,
  declineProfileMember,
  removeProfileMember,
  changeProfileMembersVisibility,
  changeProfileMembershipPrivacy,
  getPendingProfileMemberRequests,
} from "../profile/api";
import { ProfileMember } from "../profile/types";
import { toast } from "sonner";
import { getStorageUrl } from "@/utils/getStorageUrl";

type VisibilityMode = "all" | "members" | "owner";
type AccessMode = "public" | "private";

// Mock types for Sent Invites (since backend doesn't support it yet)
interface SentInvite {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  invitedAt: string;
}

const mockSentInvites: SentInvite[] = [
  {
    id: "1",
    email: "jane@example.com",
    name: "Jane Doe",
    invitedAt: "2023-11-24T10:00:00Z",
  },
];

interface MembersProps {
  eventId?: number;
  profileId?: string;
  authorId: string;
  currentUserId?: string;
  defaultMembersVisibility: VisibilityMode;
  defaultPrivacy: AccessMode;
  updateKey?: number;
}

export function Members({
  eventId,
  profileId,
  authorId,
  currentUserId,
  defaultMembersVisibility,
  defaultPrivacy,
  updateKey,
}: MembersProps) {
  const isOwner = currentUserId === authorId;

  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentInvites, setSentInvites] = useState<SentInvite[]>(mockSentInvites);
  const [savingSettings, setSavingSettings] = useState(false);

  // Confirmation dialogs
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [deleteMemberDialogOpen, setDeleteMemberDialogOpen] = useState(false);
  const [deleteInviteDialogOpen, setDeleteInviteDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Member | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedInvite, setSelectedInvite] = useState<SentInvite | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  // Settings
  const [visibility, setVisibility] = useState<VisibilityMode>(
    defaultMembersVisibility
  );
  const [accessMode, setAccessMode] = useState<AccessMode>(defaultPrivacy);

  // Section visibility
  const [showAdmins, setShowAdmins] = useState(true);
  const [showMembers, setShowMembers] = useState(true);
  const [showJoinRequests, setShowJoinRequests] = useState(true);
  const [showSentInvites] = useState(false);

  const loadMembers = async () => {
    try {
      setLoading(true);
      if (profileId) {
        const profileMembers = await fetchProfileMembers(profileId);
        let pendingMembers: ProfileMember[] = [];
        if (isOwner) {
          pendingMembers = await getPendingProfileMemberRequests(profileId);
        }
        const allMembers = [...profileMembers, ...pendingMembers];
        // Convert ProfileMember to Member format
        const members: Member[] = allMembers.map((pm: ProfileMember) => ({
          id: 0,
          event_id: 0,
          profile_id: pm.profile.id,
          status:
            pm.status === "active"
              ? ("member" as const)
              : pm.status === "pending"
              ? ("pending" as const)
              : ("declined" as const),
          created_at: pm.created_at,
          profile: pm.profile,
        }));
        setAllMembers(members);
      } else if (eventId) {
        const data = await fetchEventMembers(eventId);
        setAllMembers(data);
      }
    } catch (error) {
      console.error("Failed to load members", error);
      toast.error("Не удалось загрузить участников");
    } finally {
      setLoading(false);
    }
  };

  const handleVisibilityChange = async (newVisibility: VisibilityMode) => {
    try {
      setSavingSettings(true);
      if (profileId) {
        await changeProfileMembersVisibility(newVisibility, profileId);
      } else if (eventId) {
        await changeEventMembersVisibility(eventId, newVisibility);
      }
      setVisibility(newVisibility);
      toast.success("Видимость участников обновлена");
    } catch (error) {
      console.error("Failed to update members visibility", error);
      toast.error("Не удалось обновить видимость участников");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAccessModeChange = async (newAccessMode: AccessMode) => {
    try {
      setSavingSettings(true);
      if (profileId) {
        await changeProfileMembershipPrivacy(newAccessMode, profileId);
      } else if (eventId) {
        await changeEventPrivacy(eventId, newAccessMode);
      }
      setAccessMode(newAccessMode);
      toast.success("Настройки доступа обновлены");
    } catch (error) {
      console.error("Failed to update event privacy", error);
      toast.error("Не удалось обновить настройки доступа");
    } finally {
      setSavingSettings(false);
    }
  };

  useEffect(() => {
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, profileId, updateKey]);

  const filterBySearch = (items: (Member | SentInvite)[]) => {
    if (!searchQuery) return items;
    return items.filter((item) => {
      if ("profile" in item) {
        // Member
        const name = item.profile.name.toLowerCase();
        const username = item.profile.username.toLowerCase();
        const query = searchQuery.toLowerCase();
        return name.includes(query) || username.includes(query);
      } else {
        // SentInvite
        const name = item.name.toLowerCase();
        const email = item.email.toLowerCase();
        const query = searchQuery.toLowerCase();
        return name.includes(query) || email.includes(query);
      }
    });
  };

  const handleAcceptRequest = (request: Member) => {
    setSelectedRequest(request);
    setAcceptDialogOpen(true);
  };

  const confirmAcceptRequest = async () => {
    if (selectedRequest) {
      try {
        if (profileId) {
          const profileMembers = await getPendingProfileMemberRequests(
            profileId
          );
          const member = profileMembers.find(
            (m: ProfileMember) =>
              m.profile.username === selectedRequest.profile.username
          );
          if (!member) throw new Error("Member not found");
          await acceptProfileMember(profileId, member.member_profile_id);
        } else if (eventId) {
          await acceptMember(eventId, selectedRequest.profile.username);
        }
        toast.success("Заявка принята");
        loadMembers();
      } catch {
        toast.error("Не удалось принять заявку");
      } finally {
        setAcceptDialogOpen(false);
        setSelectedRequest(null);
      }
    }
  };

  const handleRejectRequest = (request: Member) => {
    setSelectedRequest(request);
    setRejectDialogOpen(true);
  };

  const confirmRejectRequest = async () => {
    if (selectedRequest) {
      try {
        if (profileId) {
          const profileMembers = await fetchProfileMembers(profileId);
          const member = profileMembers.find(
            (m: ProfileMember) =>
              m.profile.username === selectedRequest.profile.username
          );
          if (!member) throw new Error("Member not found");
          await declineProfileMember(profileId, member.member_profile_id);
        } else if (eventId) {
          await declineMember(eventId, selectedRequest.profile.username);
        }
        toast.success("Заявка отклонена");
        loadMembers();
      } catch {
        toast.error("Не удалось отклонить заявку");
      } finally {
        setRejectDialogOpen(false);
        setSelectedRequest(null);
      }
    }
  };

  const handleDeleteMember = (member: Member) => {
    setSelectedMember(member);
    setDeleteMemberDialogOpen(true);
  };

  const confirmDeleteMember = async () => {
    if (selectedMember) {
      try {
        if (profileId) {
          const profileMembers = await fetchProfileMembers(profileId);
          const member = profileMembers.find(
            (m: ProfileMember) =>
              m.profile.username === selectedMember.profile.username
          );
          if (!member) throw new Error("Member not found");
          await removeProfileMember(profileId, member.member_profile_id);
        } else if (eventId) {
          await removeMember(eventId, selectedMember.profile.username);
        }
        toast.success("Участник удален");
        loadMembers();
      } catch {
        toast.error("Не удалось удалить участника");
      } finally {
        setDeleteMemberDialogOpen(false);
        setSelectedMember(null);
      }
    }
  };

  const handleDeleteInvite = (invite: SentInvite) => {
    setSelectedInvite(invite);
    setDeleteInviteDialogOpen(true);
  };

  const confirmDeleteInvite = () => {
    if (selectedInvite) {
      setSentInvites((prev) => prev.filter((i) => i.id !== selectedInvite.id));
      setDeleteInviteDialogOpen(false);
      setSelectedInvite(null);
    }
  };

  const admins = allMembers.filter((m) => m.profile_id === authorId);
  const membersList = allMembers.filter(
    (m) => m.status === "member" && m.profile_id !== authorId
  );
  const joinRequests = allMembers.filter((m) => m.status === "pending");

  const filteredAdmins = filterBySearch(admins) as Member[];
  const filteredMembers = filterBySearch(membersList) as Member[];
  const filteredJoinRequests = filterBySearch(joinRequests) as Member[];
  const filteredSentInvites = filterBySearch(sentInvites) as SentInvite[];

  const totalCount = admins.length + membersList.length;

  const MemberItem = ({ member, role }: { member: Member; role: string }) => (
    <div className="flex items-center gap-4 py-3">
      <Avatar className="w-12 h-12">
        <AvatarImage
          src={
            member.profile.avatar_url
              ? getStorageUrl(member.profile.avatar_url)
              : undefined
          }
          alt={member.profile.name}
        />
        <AvatarFallback className="text-sm">
          {member.profile.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-semibold truncate">{member.profile.name}</h3>
          <span className="text-sm text-muted-foreground">
            @{member.profile.username}
          </span>
          {member.profile.is_verified && (
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>
        {member.profile.job_title && (
          <p className="text-sm text-muted-foreground">
            {member.profile.job_title}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Badge
          variant={
            role === "Owner" || role === "Admin" ? "default" : "secondary"
          }
        >
          {role}
        </Badge>
        {isOwner && role !== "Owner" && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteMember(member)}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  );

  const JoinRequestItem = ({ request }: { request: Member }) => (
    <div className="flex items-center gap-4 py-3">
      <Avatar className="w-12 h-12">
        <AvatarImage
          src={request.profile.avatar_url}
          alt={request.profile.name}
        />
        <AvatarFallback className="text-sm">
          {request.profile.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-semibold truncate">{request.profile.name}</h3>
          <span className="text-sm text-muted-foreground">
            @{request.profile.username}
          </span>
        </div>
        {request.profile.job_title && (
          <p className="text-sm text-muted-foreground">
            {request.profile.job_title}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button size="sm" onClick={() => handleAcceptRequest(request)}>
          Принять
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleRejectRequest(request)}
        >
          <UserX className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const SentInviteItem = ({ invite }: { invite: SentInvite }) => (
    <div className="flex items-center gap-4 py-3">
      <Avatar className="w-12 h-12">
        <AvatarImage src={invite.avatar_url} alt={invite.name} />
        <AvatarFallback className="text-sm">
          {invite.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{invite.name}</h3>
        <p className="text-sm text-muted-foreground">{invite.email}</p>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline" className="gap-1">
          <Clock className="w-3 h-3" />
          Ожидание
        </Badge>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleDeleteInvite(invite)}
          className="h-8 w-8 p-0"
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Участники</h2>
          <Badge variant="outline" className="ml-2">
            {totalCount}
          </Badge>
        </div>
        {/* {isOwner && (
          <Button size="sm" className="gap-2">
            <UserPlus className="w-4 h-4" />
            Invite
          </Button>
        )} */}
      </div>

      {/* Settings */}
      {isOwner && (
        <div className="space-y-4 mb-6 bg-muted/50 rounded-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="visibility" className="text-sm font-medium">
                Кто видит участников
              </Label>
              <Select
                value={visibility}
                onValueChange={(v) =>
                  handleVisibilityChange(v as VisibilityMode)
                }
                disabled={savingSettings}
              >
                <SelectTrigger className="w-32" id="visibility">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="members">Участники</SelectItem>
                  <SelectItem value="owner">Владелец</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="access-mode" className="text-sm font-medium">
                Тип доступа
              </Label>
              <Select
                value={accessMode}
                onValueChange={(v) => handleAccessModeChange(v as AccessMode)}
                disabled={savingSettings}
              >
                <SelectTrigger className="w-32" id="access-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Публичный</SelectItem>
                  <SelectItem value="private">Приватный</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-sm font-medium">Показывать разделы</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-admins"
                  checked={showAdmins}
                  onCheckedChange={(checked) =>
                    setShowAdmins(checked as boolean)
                  }
                />
                <Label
                  htmlFor="show-admins"
                  className="text-sm font-normal cursor-pointer"
                >
                  Администраторы
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-members"
                  checked={showMembers}
                  onCheckedChange={(checked) =>
                    setShowMembers(checked as boolean)
                  }
                />
                <Label
                  htmlFor="show-members"
                  className="text-sm font-normal cursor-pointer"
                >
                  Участники
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-requests"
                  checked={showJoinRequests}
                  onCheckedChange={(checked) =>
                    setShowJoinRequests(checked as boolean)
                  }
                />
                <Label
                  htmlFor="show-requests"
                  className="text-sm font-normal cursor-pointer"
                >
                  Заявки на вступление
                </Label>
              </div>
              {/* <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-invites"
                  checked={showSentInvites}
                  onCheckedChange={(checked) =>
                    setShowSentInvites(checked as boolean)
                  }
                />
                <Label
                  htmlFor="show-invites"
                  className="text-sm font-normal cursor-pointer"
                >
                  Отправленные приглашения
                </Label>
              </div> */}
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Поиск участников..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Members List */}
      <div className="space-y-6">
        {/* Admins Section */}
        {showAdmins && filteredAdmins.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Администраторы</h3>
            </div>
            <div className="space-y-1">
              {filteredAdmins.map((admin) => (
                <MemberItem key={admin.id} member={admin} role="Owner" />
              ))}
            </div>
          </div>
        )}

        {showAdmins &&
          showMembers &&
          filteredAdmins.length > 0 &&
          filteredMembers.length > 0 && <Separator />}

        {/* Members Section */}
        {showMembers && filteredMembers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Участники</h3>
            </div>
            <div className="space-y-1">
              {filteredMembers.map((member) => (
                <MemberItem key={member.id} member={member} role="Member" />
              ))}
            </div>
          </div>
        )}

        {((showAdmins && filteredAdmins.length > 0) ||
          (showMembers && filteredMembers.length > 0)) &&
          showSentInvites &&
          filteredSentInvites.length > 0 && <Separator />}

        {/* Sent Invites Section */}
        {showSentInvites && filteredSentInvites.length > 0 && isOwner && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">
                Отправленные приглашения
              </h3>
            </div>
            <div className="space-y-1">
              {filteredSentInvites.map((invite) => (
                <SentInviteItem key={invite.id} invite={invite} />
              ))}
            </div>
          </div>
        )}

        {((showAdmins && filteredAdmins.length > 0) ||
          (showMembers && filteredMembers.length > 0) ||
          (showSentInvites && filteredSentInvites.length > 0)) &&
          showJoinRequests &&
          filteredJoinRequests.length > 0 && <Separator />}

        {/* Join Requests Section */}
        {showJoinRequests && filteredJoinRequests.length > 0 && isOwner && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold">Заявки на вступление</h3>
            </div>
            <div className="space-y-1">
              {filteredJoinRequests.map((request) => (
                <JoinRequestItem key={request.id} request={request} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredAdmins.length === 0 &&
          filteredMembers.length === 0 &&
          filteredJoinRequests.length === 0 &&
          filteredSentInvites.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Участники не найдены
            </div>
          )}
      </div>

      {/* Confirmation Dialogs */}
      <AlertDialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Принять заявку на вступление</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите принять заявку от{" "}
              <strong>{selectedRequest?.profile.name}</strong>? Пользователь
              станет участником.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAcceptRequest}>
              Принять
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Отклонить заявку на вступление</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите отклонить заявку от{" "}
              <strong>{selectedRequest?.profile.name}</strong>? Это действие
              нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRejectRequest}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Отклонить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteMemberDialogOpen}
        onOpenChange={setDeleteMemberDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить участника</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить{" "}
              <strong>{selectedMember?.profile.name}</strong> из списка
              участников? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteInviteDialogOpen}
        onOpenChange={setDeleteInviteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить приглашение</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить приглашение для{" "}
              <strong>{selectedInvite?.email}</strong>? Это действие нельзя
              отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteInvite}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
