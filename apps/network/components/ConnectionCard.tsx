// Individual connection card component for list view with user details and actions

import { NetworkNode } from '../types/network';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Eye, Users } from 'lucide-react';
import { getConnectionTypeBadgeColor, getConnectionTypeLabel } from '../lib/network-utils';
import { Link } from 'react-router-dom';

interface ConnectionCardProps {
  node: NetworkNode;
  mutualConnections?: number;
  onClick: () => void;
}

export function ConnectionCard({ node, mutualConnections, onClick }: ConnectionCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <button
            onClick={onClick}
            className="flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            {node.avatarUrl ? (
              <img
                src={node.avatarUrl}
                alt={node.name}
                className="h-16 w-16 rounded-full object-cover shadow-md"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-lg">
                  {node.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
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
                <p className="text-sm text-muted-foreground truncate">
                  @{node.username}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  asChild
                >
                  <Link to={`/${node.username}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                {node.role !== 'Сообщество' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {node.role && (
              <p className="text-sm text-muted-foreground mb-2">
                {node.role}
                {node.company && ` • ${node.company}`}
              </p>
            )}

            {node.about && (
              <p className="text-sm text-foreground/80 line-clamp-2 mb-3">
                {node.about}
              </p>
            )}

            <div className="flex flex-wrap gap-2 items-center">
              {node.connectionType.slice(0, 3).map((type, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={`${getConnectionTypeBadgeColor(type)} text-white text-xs`}
                >
                  {getConnectionTypeLabel(type)}
                </Badge>
              ))}

              {node.connectionType.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{node.connectionType.length - 3}
                </Badge>
              )}

              {mutualConnections && mutualConnections > 0 && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {mutualConnections} общих
                </Badge>
              )}

              {node.level > 1 && (
                <Badge variant="outline" className="text-xs">
                  Уровень {node.level}
                </Badge>
              )}
            </div>

            {node.communities.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Сообщества:</p>
                <div className="flex flex-wrap gap-1">
                  {node.communities.slice(0, 3).map((community, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs"
                    >
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
