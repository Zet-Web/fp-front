// Component for displaying event information in posts
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Globe,
  Link as LinkIcon,
  UserPlus,
  LogOut,
  Loader2,
} from "lucide-react";
import { EventResponse, EVENT_TYPE_LABELS } from "./event-types";
import { useState, useEffect } from "react";
import { useAuthContext } from "@/components/auth-provider";
import { Members } from "../members/Members";
import {
  joinEvent,
  leaveEvent,
  getMyJoinStatus,
  MemberStatus,
} from "../members/api";
import { toast } from "sonner";

interface EventDisplayCardProps {
  eventData: EventResponse;
  compact?: boolean;
}

export function EventDisplayCard({
  eventData,
  compact = false,
}: EventDisplayCardProps) {
  const { profile, isAuthenticated } = useAuthContext();
  const [joinStatus, setJoinStatus] = useState<MemberStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [updateKey, setUpdateKey] = useState(0);

  const isOwner = profile?.id === eventData.authorId;

  useEffect(() => {
    if (isAuthenticated && eventData.id) {
      fetchStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, eventData.id]);

  const fetchStatus = async () => {
    if (!eventData.id) return;
    try {
      setLoadingStatus(true);
      const res = await getMyJoinStatus(eventData.id);
      setJoinStatus(res.status);
    } catch (error) {
      console.error("Failed to fetch join status", error);
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleJoin = async () => {
    if (!eventData.id) return;
    try {
      setActionLoading(true);
      await joinEvent(eventData.id);
      toast.success(
        eventData.privacy === "private"
          ? "Заявка отправлена"
          : "Вы присоединились к мероприятию"
      );
      fetchStatus();
      setUpdateKey((prev) => prev + 1);
    } catch (error) {
      toast.error("Не удалось присоединиться");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!eventData.id) return;
    try {
      setActionLoading(true);
      await leaveEvent(eventData.id);
      toast.success("Вы покинули мероприятие");
      fetchStatus();
      setUpdateKey((prev) => prev + 1);
    } catch (error) {
      toast.error("Не удалось покинуть мероприятие");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getCategoryLabel = (category: string) => {
    return category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const showLocationFields = eventData.eventTypes.includes("offline");
  const showMembers =
    eventData.membersEnabled &&
    (isOwner ||
      eventData.membersVisibility === "all" ||
      (eventData.membersVisibility === "members" && joinStatus === "member"));

  const renderActionButtons = () => {
    if (!isAuthenticated || !eventData.id || !eventData.membersEnabled)
      return null;
    if (loadingStatus) return <Loader2 className="w-4 h-4 animate-spin" />;

    if (joinStatus === "member") {
      return (
        <div className="flex gap-2 mt-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLeave}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                Покинуть мероприятие
              </>
            )}
          </Button>
        </div>
      );
    }

    if (joinStatus === "pending") {
      return (
        <Button variant="secondary" size="sm" className="w-full mt-4" disabled>
          <Clock className="w-4 h-4 mr-2" />
          Заявка на рассмотрении
        </Button>
      );
    }

    if (joinStatus === "can_join" || joinStatus === "submit_join") {
      return (
        <Button
          size="sm"
          className="w-full mt-4"
          onClick={handleJoin}
          disabled={actionLoading}
        >
          {actionLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <UserPlus className="w-4 h-4 mr-2" />
          )}
          {joinStatus === "submit_join"
            ? "Подать заявку"
            : "Присоединиться к мероприятию"}
        </Button>
      );
    }

    return null;
  };

  if (compact) {
    return (
      <div className="space-y-3 pt-3 border-t">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="gap-1">
            <Calendar className="w-3 h-3" />
            {getCategoryLabel(eventData.category)}
          </Badge>
          {eventData.eventTypes.map((type) => (
            <Badge key={type} className="bg-blue-500 hover:bg-blue-600 gap-1">
              <Globe className="w-3 h-3" />
              {EVENT_TYPE_LABELS[type]}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">{formatDate(eventData.startDate)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">
              {eventData.startTime}
              {eventData.endTime && ` - ${eventData.endTime}`}
            </span>
          </div>

          {showLocationFields && eventData.location?.city && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="truncate">{eventData.location.city.name}</span>
            </div>
          )}

          {eventData.memberLimit && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>До {eventData.memberLimit} участников</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">
              {getCategoryLabel(eventData.category)}
            </Badge>
            {eventData.eventTypes.map((type) => (
              <Badge key={type} className="bg-blue-500 hover:bg-blue-600">
                {EVENT_TYPE_LABELS[type]}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-blue-500" />
            <div>
              <div className="font-medium">Дата начала</div>
              <div className="text-muted-foreground">
                {formatDate(eventData.startDate)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-blue-500" />
            <div>
              <div className="font-medium">Время</div>
              <div className="text-muted-foreground">
                {eventData.startTime}
                {eventData.endTime && ` - ${eventData.endTime}`}
              </div>
            </div>
          </div>

          {eventData.endDate && (
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-blue-500" />
              <div>
                <div className="font-medium">Дата завершения</div>
                <div className="text-muted-foreground">
                  {formatDate(eventData.endDate)}
                </div>
              </div>
            </div>
          )}

          {showLocationFields && eventData.location?.city && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-blue-500" />
              <div>
                <div className="font-medium">Локация</div>
                <div className="text-muted-foreground">
                  {eventData.location.city.name}
                  {eventData.location.address &&
                    `, ${eventData.location.address}`}
                </div>
              </div>
            </div>
          )}

          {eventData.website && (
            <div className="flex items-center gap-3 text-sm md:col-span-2">
              <LinkIcon className="w-4 h-4 text-blue-500" />
              <div>
                <div className="font-medium">Сайт</div>
                <a
                  href={eventData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline truncate block"
                >
                  {eventData.website}
                </a>
              </div>
            </div>
          )}

          {eventData.memberLimit && (
            <div className="flex items-center gap-3 text-sm">
              <Users className="w-4 h-4 text-blue-500" />
              <div>
                <div className="font-medium">Всего</div>
                <div className="text-muted-foreground">
                  До {eventData.memberLimit} участников
                </div>
              </div>
            </div>
          )}
        </div>

        {eventData.membersEnabled &&
          !showMembers &&
          eventData.membersVisibility === "members" && (
            <div className="flex items-center justify-center gap-3 text-sm">
              <div className="text-muted-foreground">
                Список участников доступен после вступления
              </div>
            </div>
          )}

        {showMembers && eventData.id && eventData.authorId && (
          <Members
            eventId={eventData.id}
            authorId={eventData.authorId}
            currentUserId={profile?.id}
            updateKey={updateKey}
            defaultMembersVisibility={eventData.membersVisibility}
            defaultPrivacy={eventData.privacy}
          />
        )}

        {renderActionButtons()}
      </CardContent>
    </Card>
  );
}
