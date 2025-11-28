// Individual connection card component for list view with user details and actions

import { NetworkNode } from '../types/network';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
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
                  <h3 className="font-semibold text-base text-foreground">
                    {node.name} <span className="text-sm text-muted-foreground font-normal">(@{node.username})</span>
                  </h3>
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="flex-shrink-0"
                asChild
              >
                <Link to={`/${node.username}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Открыть
                </Link>
              </Button>
            </div>

            {node.about && (
              <p className="text-sm text-foreground/80 line-clamp-2 mb-3">
                {node.about}
              </p>
            )}

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
