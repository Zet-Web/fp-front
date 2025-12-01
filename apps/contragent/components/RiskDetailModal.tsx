// Modal component for displaying detailed risk information

import { ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RiskFlag, RISK_CATEGORY_LABELS } from '../types/risks';
import { getRiskColorClass, getRiskIcon, formatRiskDetail } from '../lib/risk-utils';

interface RiskDetailModalProps {
  risk: RiskFlag;
  isOpen: boolean;
  onClose: () => void;
}

export function RiskDetailModal({ risk, isOpen, onClose }: RiskDetailModalProps) {
  const Icon = getRiskIcon(risk.color);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {risk.description}
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className={getRiskColorClass(risk.color)}>
                {risk.color || 'Нейтральный'}
              </Badge>
              <Badge variant="secondary">
                {RISK_CATEGORY_LABELS[risk.type]}
              </Badge>
              {risk.positive && (
                <Badge variant="outline" className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400">
                  Позитивный фактор
                </Badge>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {risk.comment && (
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm font-medium mb-2">Описание</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {risk.comment}
                </p>
              </div>
            )}

            {risk.details && risk.details.length > 0 && (
              <div className="space-y-3">
                <div className="text-sm font-medium">Дополнительная информация</div>
                {risk.details.map((detailGroup, groupIndex) => (
                  <div
                    key={groupIndex}
                    className="p-4 rounded-lg border bg-card"
                  >
                    <div className="space-y-2">
                      {detailGroup.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-start gap-3">
                          <span className="text-sm text-muted-foreground min-w-[120px] font-medium">
                            {detail.name}:
                          </span>
                          {detail.value_type === 'url' ? (
                            <a
                              href={detail.value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                            >
                              Открыть ссылку
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-sm flex-1">
                              {formatRiskDetail(detail)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-4 rounded-lg bg-muted/50 text-xs text-muted-foreground">
              <div className="font-medium mb-1">Техническая информация</div>
              <div className="space-y-1">
                <div>Код риска: {risk.name}</div>
                <div>Категория: {RISK_CATEGORY_LABELS[risk.type]}</div>
                <div>Статус: {risk.value ? 'Активен' : 'Не активен'}</div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
