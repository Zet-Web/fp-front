// Individual connection card component for list view with user details and actions

import { NetworkNode } from "../types/network";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { getStorageUrl } from "@/utils/getStorageUrl";

interface ConnectionCardProps {
  node: NetworkNode;
  onClick: () => void;
}

export function ConnectionCard({ node, onClick }: ConnectionCardProps) {
  const isEvent = node.nodeType === "event";
  const isCommunity = node.nodeType === "community";

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <button
            onClick={onClick}
            className="flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            {isEvent ? (
              node.coverImage ? (
                <img
                  src={getStorageUrl(node.coverImage)}
                  alt={node.name}
                  className="h-16 w-16 rounded-lg object-cover shadow-md"
                />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
              )
            ) : isCommunity ? (
              node.avatarUrl ? (
                <img
                  src={getStorageUrl(node.avatarUrl)}
                  alt={node.name}
                  className="h-16 w-16 rounded-lg object-cover shadow-md"
                />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-md">
                  <Users className="h-8 w-8 text-white" />
                </div>
              )
            ) : node.avatarUrl ? (
              <img
                src={getStorageUrl(node.avatarUrl)}
                alt={node.name}
                className="h-16 w-16 rounded-full object-cover shadow-md"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-lg">
                  {node.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <button
                  onClick={onClick}
                  className="text-left hover:text-blue-500 transition-colors"
                >
                  <h3 className="font-semibold text-base text-foreground truncate">
                    {node.name}
                  </h3>
                </button>
                {isEvent ? (
                  <div className="text-sm text-muted-foreground">
                    {node.category && (
                      <p className="truncate">{node.category}</p>
                    )}
                    {node.startDate && (
                      <p className="flex items-center gap-1 text-xs">
                        <Calendar className="h-3 w-3" />
                        {new Date(node.startDate).toLocaleDateString("ru-RU")}
                      </p>
                    )}
                  </div>
                ) : isCommunity ? (
                  <p className="text-sm text-muted-foreground truncate">
                    Сообщество
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground truncate">
                    @{node.username}
                  </p>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="flex-shrink-0"
                asChild
              >
                {isEvent ? (
                  <Link to={`/post/${node.postUrl}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Открыть
                  </Link>
                ) : isCommunity ? (
                  <Link to={`/${node.username}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Открыть
                  </Link>
                ) : (
                  <Link to={`/${node.username}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Открыть
                  </Link>
                )}
              </Button>
            </div>

            {!isEvent && !isCommunity && node.about && (
              <p className="text-sm text-foreground/80 line-clamp-2 mb-3">
                {node.about}
              </p>
            )}

            {!isEvent &&
              !isCommunity &&
              node.communities &&
              node.communities.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Общее:</p>
                  <div className="flex flex-wrap gap-1">
                    {node.communities.slice(0, 3).map((community, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {community}
                      </Badge>
                    ))}
                    {node.communities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{node.communities.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
