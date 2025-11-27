import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  UserPlus,
  Search,
  Users,
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
import { ProfileMember } from "./types";
import {
  fetchProfileMembers,
  acceptProfileMember,
  declineProfileMember,
  removeProfileMember,
  getPendingProfileMemberRequests,
} from "./api";
import { toast } from "sonner";
import { getStorageUrl } from "@/utils/getStorageUrl";
import { useAuthContext } from "@/components/auth-provider";

interface PublicProfileMembersProps {
  profileId: string;
  ownerId: string;
  updateKey?: number;
}

export function PublicProfileMembers({
  profileId,
  ownerId,
  updateKey,
}: PublicProfileMembersProps) {
  const { profile } = useAuthContext();
  const currentProfileId = profile?.id;

  const [allMembers, setAllMembers] = useState<ProfileMember[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ProfileMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Confirmation dialogs
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [deleteMemberDialogOpen, setDeleteMemberDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ProfileMember | null>(
    null
  );
  const [selectedMember, setSelectedMember] = useState<ProfileMember | null>(
    null
  );

  const [searchQuery, setSearchQuery] = useState("");

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await fetchProfileMembers(profileId);
      setAllMembers(data);

      if (isOwner) {
        const pending = await getPendingProfileMemberRequests(profileId);
        setPendingRequests(pending);
      }
    } catch (error) {
      console.error("Failed to load members", error);
      toast.error("Не удалось загрузить участников");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId, updateKey]);

  const filterBySearch = (items: ProfileMember[]) => {
    if (!searchQuery) return items;
    return items.filter((item) => {
      const name = item.profile.name.toLowerCase();
      const username = item.profile.username.toLowerCase();
      const query = searchQuery.toLowerCase();
      return name.includes(query) || username.includes(query);
    });
  };

  const handleAcceptRequest = (request: ProfileMember) => {
    setSelectedRequest(request);
    setAcceptDialogOpen(true);
  };

  const confirmAcceptRequest = async () => {
    if (selectedRequest) {
      try {
        await acceptProfileMember(profileId, selectedRequest.member_profile_id);
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

  const handleRejectRequest = (request: ProfileMember) => {
    setSelectedRequest(request);
    setRejectDialogOpen(true);
  };

  const confirmRejectRequest = async () => {
    if (selectedRequest) {
      try {
        await declineProfileMember(
          profileId,
          selectedRequest.member_profile_id
        );
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

  const handleDeleteMember = (member: ProfileMember) => {
    setSelectedMember(member);
    setDeleteMemberDialogOpen(true);
  };

  const confirmDeleteMember = async () => {
    if (selectedMember) {
      try {
        await removeProfileMember(profileId, selectedMember.member_profile_id);
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

  const ownerMembers = allMembers.filter(
    (m) => m.member_profile_id === ownerId
  );
  const regularMembers = allMembers.filter(
    (m) => m.member_profile_id !== ownerId
  );

  const filteredOwners = filterBySearch(ownerMembers);
  const filteredMembers = filterBySearch(regularMembers);
  const filteredPendingRequests = filterBySearch(pendingRequests);

  const totalCount = allMembers.length;

  const isOwner = currentProfileId === ownerId;

  console.log("isOwner", isOwner, currentProfileId, ownerId);

  const MemberItem = ({
    member,
    role,
  }: {
    member: ProfileMember;
    role: string;
  }) => (
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
            role === "Владелец" || role === "Администратор"
              ? "default"
              : "secondary"
          }
        >
          {role}
        </Badge>
        {isOwner && role !== "Владелец" && (
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

  const PendingRequestItem = ({ request }: { request: ProfileMember }) => (
    <div className="flex items-center gap-4 py-3">
      <Avatar className="w-12 h-12">
        <AvatarImage
          src={
            request.profile.avatar_url
              ? getStorageUrl(request.profile.avatar_url)
              : undefined
          }
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
      </div>

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
        {/* Owners Section */}
        {filteredOwners.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Владелец</h3>
            </div>
            <div className="space-y-1">
              {filteredOwners.map((owner) => (
                <MemberItem
                  key={owner.member_profile_id}
                  member={owner}
                  role="Владелец"
                />
              ))}
            </div>
          </div>
        )}

        {filteredOwners.length > 0 && filteredMembers.length > 0 && (
          <Separator />
        )}

        {/* Members Section */}
        {filteredMembers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Участники</h3>
            </div>
            <div className="space-y-1">
              {filteredMembers.map((member) => (
                <MemberItem
                  key={member.member_profile_id}
                  member={member}
                  role="Участник"
                />
              ))}
            </div>
          </div>
        )}

        {(filteredOwners.length > 0 || filteredMembers.length > 0) &&
          filteredPendingRequests.length > 0 &&
          isOwner && <Separator />}

        {/* Pending Requests Section */}
        {filteredPendingRequests.length > 0 && isOwner && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold">Заявки на вступление</h3>
            </div>
            <div className="space-y-1">
              {filteredPendingRequests.map((request) => (
                <PendingRequestItem
                  key={request.member_profile_id}
                  request={request}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredOwners.length === 0 &&
          filteredMembers.length === 0 &&
          filteredPendingRequests.length === 0 && (
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
    </div>
  );
}
