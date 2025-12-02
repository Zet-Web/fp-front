// Reusable card component for displaying individual corporate action

import { ExternalLink, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CorporateAction } from '../types/corporate-actions';
import { getActionTypeLabel, getActionColorClass, getActionIcon, truncateText, formatPublisherName } from '../lib/corporate-actions-utils';
import { formatDate } from '../lib/company-utils';

interface CorporateActionCardProps {
  action: CorporateAction;
  compact?: boolean;
  onClick?: () => void;
}

export function CorporateActionCard({ action, compact = false, onClick }: CorporateActionCardProps) {
  const Icon = getActionIcon(action.msgType);
  const colorClass = getActionColorClass(action.msgType);

  return (
    <Card
      className={`shadow-sm hover:shadow-md transition-all ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${colorClass}`}>
            <Icon className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <Badge variant="outline" className={`${colorClass} mb-2`}>
                  {getActionTypeLabel(action.msgType)}
                </Badge>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(action.datePublish)}
                </div>
              </div>
              {action.messageUrl && (
                <a
                  href={action.messageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            {!compact && (
              <>
                <div className="text-sm mb-2">
                  <span className="text-muted-foreground">Публикатор: </span>
                  <span className="font-medium">{formatPublisherName(action.publisher)}</span>
                </div>

                {action.text && (
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {truncateText(action.text, compact ? 150 : 300)}
                  </div>
                )}

                {action.notaryInfo && (
                  <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                    Нотариус: {action.notaryInfo.name}
                    {action.notaryInfo.title && ` (${action.notaryInfo.title})`}
                  </div>
                )}

                {(action.annuled || action.locked) && (
                  <div className="mt-2 flex gap-2">
                    {action.annuled && (
                      <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-xs">
                        Аннулировано
                      </Badge>
                    )}
                    {action.locked && (
                      <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-xs">
                        Заблокировано
                      </Badge>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
