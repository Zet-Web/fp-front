// Comprehensive risks tab showing all risk categories and detailed information

import { useState } from 'react';
import { Shield, AlertCircle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { RisksData, RisksSummary, RiskFlag, RiskCategory } from '../types/risks';
import { RiskCategorySection } from './RiskCategorySection';
import { RiskDetailModal } from './RiskDetailModal';
import { groupRisksByCategory } from '../lib/datanewton-risks-mapper';
import { getRiskLevelColor, getRiskLevelLabel, calculateRiskScore } from '../lib/risk-utils';

interface RisksTabDetailedProps {
  data: RisksData | null;
  summary: RisksSummary | null;
  isLoading: boolean;
  error: string | null;
}

export function RisksTabDetailed({ data, summary, isLoading, error }: RisksTabDetailedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<RiskFlag | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
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

  if (!data || !summary) {
    return (
      <div className="text-center py-16">
        <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Данные о рисках недоступны</p>
      </div>
    );
  }

  const groupedRisks = groupRisksByCategory(data.flags);
  const riskScore = calculateRiskScore(summary.bySeverity);

  const filteredGroupedRisks = Object.entries(groupedRisks).reduce(
    (acc, [category, risks]) => {
      const filtered = risks.filter(risk =>
        risk.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.comment.toLowerCase().includes(searchQuery.toLowerCase())
      );
      acc[category as RiskCategory] = filtered;
      return acc;
    },
    {} as Record<RiskCategory, RiskFlag[]>
  );

  const categories: RiskCategory[] = ['NEGATIVE_LISTS', 'ONE_DAY_COMPANY', 'OTHER_FACTS', 'BANKRUPTCY'];

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Общая оценка рисков
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-1">Уровень риска</div>
              <Badge className={`${getRiskLevelColor(summary.overallLevel)} text-base px-3 py-1`}>
                {getRiskLevelLabel(summary.overallLevel)}
              </Badge>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-1">Оценка надежности</div>
              <div className="text-2xl font-bold">{riskScore}/100</div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-1">Активные риски</div>
              <div className="flex items-center gap-2 flex-wrap">
                {summary.bySeverity.negative > 0 && (
                  <Badge variant="outline" className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200">
                    {summary.bySeverity.negative} критичных
                  </Badge>
                )}
                {summary.bySeverity.warning > 0 && (
                  <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 border-yellow-200">
                    {summary.bySeverity.warning} предупр.
                  </Badge>
                )}
                {summary.bySeverity.positive > 0 && (
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200">
                    {summary.bySeverity.positive} позитивных
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-sm text-blue-900 dark:text-blue-300">
            Оценка основана на анализе {data.flags.length} показателей безопасности и надежности компании
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Поиск по рискам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <RiskCategorySection
            key={category}
            category={category}
            risks={filteredGroupedRisks[category] || []}
            defaultOpen={category === 'NEGATIVE_LISTS'}
            onRiskClick={setSelectedRisk}
          />
        ))}
      </div>

      {selectedRisk && (
        <RiskDetailModal
          risk={selectedRisk}
          isOpen={!!selectedRisk}
          onClose={() => setSelectedRisk(null)}
        />
      )}
    </div>
  );
}
