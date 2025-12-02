// Preview component displaying latest corporate actions on main page

import { FileText, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CorporateActionsData } from '../types/corporate-actions';
import { CorporateActionCard } from './CorporateActionCard';
import { getLatestActions } from '../lib/corporate-actions-mapper';

interface CorporateActionsPreviewProps {
  data: CorporateActionsData | null;
  isLoading: boolean;
  onViewDetails: () => void;
}

export function CorporateActionsPreview({ data, isLoading, onViewDetails }: CorporateActionsPreviewProps) {
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Корпоративные действия
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Корпоративные действия
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Нет данных о корпоративных действиях
          </div>
        </CardContent>
      </Card>
    );
  }

  const latestActions = getLatestActions(data, 4);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Корпоративные действия
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Всего: {data.total}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {latestActions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Нет активных корпоративных действий
          </div>
        ) : (
          <>
            {latestActions.map((action) => (
              <CorporateActionCard
                key={action.guid}
                action={action}
                compact
              />
            ))}

            {data.total > 4 && (
              <Button
                onClick={onViewDetails}
                variant="outline"
                className="w-full mt-2"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Посмотреть все ({data.total})
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
