// Modal dialog displaying detailed information about a network node

import { NetworkNode } from '../types/network';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, MessageCircle, Users } from 'lucide-react';
import { getConnectionTypeBadgeColor, getConnectionTypeLabel } from '../lib/network-utils';
import { Link } from 'react-router-dom';

interface NodeDetailModalProps {
  node: NetworkNode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NodeDetailModal({ node, open, onOpenChange }: NodeDetailModalProps) {
  if (!node) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Информация о соединении</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center text-center py-4">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg mb-4">
            <span className="text-white font-semibold text-2xl">
              {node.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>

          <h2 className="text-xl font-bold text-foreground mb-1">
            {node.name}
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            @{node.username}
          </p>

          {node.role && (
            <p className="text-sm text-muted-foreground mb-4">
              {node.role}
              {node.company && ` • ${node.company}`}
            </p>
          )}

          {node.about && (
            <p className="text-sm text-foreground/80 mb-4 text-center">
              {node.about}
            </p>
          )}

          <div className="w-full space-y-4">
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
                      className={`${getConnectionTypeBadgeColor(type)} text-white text-xs`}
                    >
                      {getConnectionTypeLabel(type)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {node.communities.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 text-left">
                  Сообщества:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {node.communities.map((community, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs"
                    >
                      {community}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {node.level > 1 && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Соединение {node.level} уровня</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-6 w-full">
            <Button
              variant="default"
              className="flex-1 bg-blue-500 hover:bg-blue-600"
              asChild
            >
              <Link to={`/${node.username}`}>
                <Eye className="h-4 w-4 mr-2" />
                Открыть профиль
              </Link>
            </Button>

            {node.role !== 'Сообщество' && (
              <Button variant="outline" className="flex-1">
                <MessageCircle className="h-4 w-4 mr-2" />
                Написать
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
