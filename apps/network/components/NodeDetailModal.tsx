// Modal dialog displaying detailed information about a network node

import { NetworkNode } from "../types/network";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Users, Calendar } from "lucide-react";
import {
  getConnectionTypeBadgeColor,
  getConnectionTypeLabel,
} from "../lib/network-utils";
import { Link } from "react-router-dom";
import { getStorageUrl } from "@/utils/getStorageUrl";

interface NodeDetailModalProps {
  node: NetworkNode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NodeDetailModal({
  node,
  open,
  onOpenChange,
}: NodeDetailModalProps) {
  if (!node) return null;

  const isEvent = node.nodeType === "event";
  const isCommunity = node.nodeType === "community";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Информация</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center text-center py-4">
          {/* Image/Icon */}
          {isEvent ? (
            node.coverImage ? (
              <img
                src={getStorageUrl(node.coverImage)}
                alt={node.name}
                className="h-20 w-full rounded-lg object-cover shadow-lg mb-4"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg mb-4">
                <Calendar className="h-10 w-10 text-white" />
              </div>
            )
          ) : isCommunity ? (
            node.avatarUrl ? (
              <img
                src={getStorageUrl(node.avatarUrl)}
                alt={node.name}
                className="h-20 w-20 rounded-lg object-cover shadow-lg mb-4"
              />
            ) : (
              <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg mb-4">
                <Users className="h-10 w-10 text-white" />
              </div>
            )
          ) : node.avatarUrl ? (
            <img
              src={getStorageUrl(node.avatarUrl)}
              alt={node.name}
              className="h-20 w-20 rounded-full object-cover shadow-lg mb-4"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg mb-4">
              <span className="text-white font-semibold text-2xl">
                {node.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            </div>
          )}

          {/* Name */}
          <h2 className="text-xl font-bold text-foreground mb-1">
            {node.name}
          </h2>

          {/* Username (users only) */}
          {!isEvent && !isCommunity && node.username && (
            <p className="text-sm text-muted-foreground mb-4">
              @{node.username}
            </p>
          )}

          {/* Community label */}
          {isCommunity && (
            <p className="text-sm text-muted-foreground mb-4">Сообщество</p>
          )}

          {/* Category and dates (events only) */}
          {isEvent && (
            <div className="text-sm text-muted-foreground mb-4 space-y-1">
              {node.category && <p className="font-medium">{node.category}</p>}
              {node.startDate && (
                <p className="flex items-center justify-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(node.startDate).toLocaleDateString("ru-RU")}
                  {node.endDate &&
                    ` - ${new Date(node.endDate).toLocaleDateString("ru-RU")}`}
                </p>
              )}
            </div>
          )}

          {/* Role and company (users only) */}
          {!isEvent && !isCommunity && node.role && (
            <p className="text-sm text-muted-foreground mb-4">
              {node.role}
              {node.company && ` • ${node.company}`}
            </p>
          )}

          {/* About (users only) */}
          {!isEvent && !isCommunity && node.about && (
            <p className="text-sm text-foreground/80 mb-4 text-center">
              {node.about}
            </p>
          )}

          <div className="w-full space-y-4">
            {/* Connection types */}
            {node.connectionType.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 text-left">
                  Тип связи:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {node.connectionType.map((type, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className={`${getConnectionTypeBadgeColor(
                        type
                      )} text-white text-xs`}
                    >
                      {getConnectionTypeLabel(type)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Communities (users only) */}
            {!isEvent &&
              !isCommunity &&
              node.communities &&
              node.communities.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 text-left">
                    Сообщества:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {node.communities.map((community, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {community}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            {/* Connection level */}
            {node.level > 1 && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Контакт {node.level} уровня</span>
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="flex gap-2 mt-6 w-full">
            <Button
              variant="default"
              className="flex-1 bg-blue-500 hover:bg-blue-600"
              asChild
            >
              {isEvent ? (
                <Link to={`/post/${node.postUrl}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Открыть мероприятие
                </Link>
              ) : isCommunity ? (
                <Link to={`/${node.username}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Открыть сообщество
                </Link>
              ) : (
                <Link to={`/${node.username}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Открыть профиль
                </Link>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
