// Comprehensive tab displaying all corporate actions with filtering and search

import { useState } from 'react';
import { FileText, AlertCircle, Search, ExternalLink, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CorporateActionsData, CorporateAction } from '../types/corporate-actions';
import { CorporateActionCard } from './CorporateActionCard';
import { getActionTypeLabel, getActionColorClass, formatPublisherName } from '../lib/corporate-actions-utils';
import { formatDate } from '../lib/company-utils';

interface CorporateActionsTabDetailedProps {
  data: CorporateActionsData | null;
  isLoading: boolean;
  error: string | null;
}

export function CorporateActionsTabDetailed({ data, isLoading, error }: CorporateActionsTabDetailedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<CorporateAction | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Данные о корпоративных действиях недоступны</p>
      </div>
    );
  }

  const filteredActions = data.data.filter(action =>
    getActionTypeLabel(action.msgType).toLowerCase().includes(searchQuery.toLowerCase()) ||
    action.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    formatPublisherName(action.publisher).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeActions = filteredActions.filter(a => !a.annuled && !a.locked);
  const archivedActions = filteredActions.filter(a => a.annuled || a.locked);

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Статистика
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-1">Всего сообщений</div>
              <div className="text-2xl font-bold">{data.total}</div>
            </div>

            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
              <div className="text-sm text-muted-foreground mb-1">Активные</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{activeActions.length}</div>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-950/20">
              <div className="text-sm text-muted-foreground mb-1">Архивные</div>
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{archivedActions.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Поиск по типу, тексту или публикатору..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredActions.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Нет корпоративных действий, соответствующих поиску</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeActions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Активные сообщения</h3>
              <div className="space-y-3">
                {activeActions.map((action) => (
                  <CorporateActionCard
                    key={action.guid}
                    action={action}
                    onClick={() => setSelectedAction(action)}
                  />
                ))}
              </div>
            </div>
          )}

          {archivedActions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-muted-foreground">Архивные сообщения</h3>
              <div className="space-y-3 opacity-60">
                {archivedActions.map((action) => (
                  <CorporateActionCard
                    key={action.guid}
                    action={action}
                    onClick={() => setSelectedAction(action)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedAction && (
        <Dialog open={!!selectedAction} onOpenChange={() => setSelectedAction(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Детали корпоративного действия
              </DialogTitle>
              <DialogDescription>
                <Badge variant="outline" className={getActionColorClass(selectedAction.msgType)}>
                  {getActionTypeLabel(selectedAction.msgType)}
                </Badge>
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Дата публикации
                    </div>
                    <div className="font-medium">{formatDate(selectedAction.datePublish)}</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Номер сообщения</div>
                    <div className="font-medium">№ {selectedAction.number}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Публикатор
                  </div>
                  <div className="font-medium">{formatPublisherName(selectedAction.publisher)}</div>
                  {selectedAction.publisher.data.inn && (
                    <div className="text-sm text-muted-foreground">ИНН: {selectedAction.publisher.data.inn}</div>
                  )}
                </div>

                {selectedAction.text && (
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-sm font-medium mb-2">Текст сообщения</div>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedAction.text}
                    </div>
                  </div>
                )}

                {selectedAction.participants.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Участники</div>
                    <div className="space-y-2">
                      {selectedAction.participants.map((participant, idx) => (
                        <div key={idx} className="p-3 rounded-lg border bg-card text-sm">
                          <div className="font-medium">{formatPublisherName(participant)}</div>
                          {participant.role && (
                            <div className="text-muted-foreground">Роль: {participant.role}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAction.notaryInfo && (
                  <div className="p-3 rounded-lg border bg-card">
                    <div className="text-sm font-medium mb-1">Нотариус</div>
                    <div className="text-sm">{selectedAction.notaryInfo.name}</div>
                    {selectedAction.notaryInfo.title && (
                      <div className="text-xs text-muted-foreground">{selectedAction.notaryInfo.title}</div>
                    )}
                  </div>
                )}

                {selectedAction.messageUrl && (
                  <a
                    href={selectedAction.messageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Открыть на Федресурсе
                  </a>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
