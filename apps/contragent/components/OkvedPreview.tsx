// Preview component showing primary OKVED codes on Overview tab

import { FileText, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { OkvedCode } from '../types/company';

interface OkvedPreviewProps {
  okvedCodes: OkvedCode[] | undefined;
  isLoading: boolean;
  onViewDetails: () => void;
}

export function OkvedPreview({ okvedCodes, isLoading, onViewDetails }: OkvedPreviewProps) {
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Виды деятельности (ОКВЭД)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!okvedCodes || okvedCodes.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Виды деятельности (ОКВЭД)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">Данные о видах деятельности недоступны</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const primaryOkved = okvedCodes.filter(o => o.is_primary);
  const additionalOkved = okvedCodes.filter(o => !o.is_primary).slice(0, 2);
  const displayOkved = primaryOkved.length > 0 ? primaryOkved : okvedCodes.slice(0, 1);
  const hasMore = okvedCodes.length > (displayOkved.length + additionalOkved.length);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Виды деятельности (ОКВЭД)
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onViewDetails} className="text-blue-500 hover:text-blue-600">
            Подробнее
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayOkved.map((okved, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                  {okved.code}
                </Badge>
                {okved.is_primary && (
                  <Badge variant="outline" className="text-xs">
                    Основной
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {okved.name}
              </p>
            </div>
          ))}

          {additionalOkved.length > 0 && (
            <div className="pt-2 border-t space-y-2">
              {additionalOkved.map((okved, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Badge variant="secondary" className="text-xs mt-0.5">
                    {okved.code}
                  </Badge>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {okved.name}
                  </p>
                </div>
              ))}
            </div>
          )}

          {hasMore && (
            <div className="pt-2 text-center">
              <p className="text-xs text-muted-foreground">
                + еще {okvedCodes.length - (displayOkved.length + additionalOkved.length)} видов деятельности
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
