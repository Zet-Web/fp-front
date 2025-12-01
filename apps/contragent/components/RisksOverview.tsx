// Overview component displaying summary of company risk assessment on main page

import { Shield, FileWarning, AlertTriangle, Info, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RisksSummary, RISK_CATEGORY_LABELS } from '../types/risks';
import { getRiskLevelColor, getRiskLevelLabel } from '../lib/risk-utils';

interface RisksOverviewProps {
  summary: RisksSummary | null;
  isLoading: boolean;
  onViewDetails: () => void;
}

export function RisksOverview({ summary, isLoading, onViewDetails }: RisksOverviewProps) {
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Оценка рисков
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return null;
  }

  const categoryData = [
    {
      type: 'NEGATIVE_LISTS' as const,
      icon: Shield,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
    },
    {
      type: 'ONE_DAY_COMPANY' as const,
      icon: FileWarning,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    },
    {
      type: 'OTHER_FACTS' as const,
      icon: Info,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      type: 'BANKRUPTCY' as const,
      icon: AlertTriangle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
  ];

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Оценка рисков
          </CardTitle>
          <Badge className={getRiskLevelColor(summary.overallLevel)}>
            {getRiskLevelLabel(summary.overallLevel)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div>
            <div className="text-sm text-muted-foreground">Всего активных рисков</div>
            <div className="text-2xl font-bold">{summary.total}</div>
          </div>
          <div className="flex gap-2">
            {summary.bySeverity.negative > 0 && (
              <Badge variant="outline" className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800">
                {summary.bySeverity.negative} критичных
              </Badge>
            )}
            {summary.bySeverity.warning > 0 && (
              <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
                {summary.bySeverity.warning} предупреждений
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categoryData.map(({ type, icon: Icon, color, bgColor }) => {
            const count = summary.byCategory[type];
            return (
              <div
                key={type}
                className={`p-3 rounded-lg border ${bgColor} transition-colors`}
              >
                <div className="flex items-start justify-between mb-2">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <span className="text-xl font-bold">{count}</span>
                </div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {RISK_CATEGORY_LABELS[type]}
                </div>
              </div>
            );
          })}
        </div>

        <Button
          onClick={onViewDetails}
          variant="outline"
          className="w-full"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Подробнее о рисках
        </Button>
      </CardContent>
    </Card>
  );
}
