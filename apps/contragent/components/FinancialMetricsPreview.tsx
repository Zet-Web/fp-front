// Preview component showing key financial metrics on Overview tab

import { TrendingUp, TrendingDown, DollarSign, PieChart, Shield, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BasicFinancialMetrics } from '../types/finance';
import { formatCurrencyCompact, formatPercentage } from '../lib/format-utils';

interface FinancialMetricsPreviewProps {
  metrics: BasicFinancialMetrics | null;
  isLoading: boolean;
  onViewDetails: () => void;
}

function getReliabilityColor(score: number): string {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
  if (score >= 40) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

function getReliabilityLabel(score: number): string {
  if (score >= 80) return 'Высокая';
  if (score >= 60) return 'Средняя';
  if (score >= 40) return 'Низкая';
  return 'Критическая';
}

export function FinancialMetricsPreview({ metrics, isLoading, onViewDetails }: FinancialMetricsPreviewProps) {
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-500" />
            Финансовые показатели
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-500" />
            Финансовые показатели
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p>Финансовые отчеты недоступны</p>
            <p className="text-sm mt-1">Компания не предоставила данные</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { revenue, netProfit, totalAssets, reliabilityScore, profitMargin, debtRatio } = metrics;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-500" />
            Финансовые показатели
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onViewDetails} className="text-blue-500 hover:text-blue-600">
            Подробнее
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Revenue */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Выручка {revenue.year}</span>
            </div>
            <div className="font-semibold text-lg">{formatCurrencyCompact(revenue.value)}</div>
            {revenue.yoyPercentage && revenue.yoyPercentage !== '—' && (
              <div className="flex items-center gap-1">
                {parseFloat(revenue.yoyPercentage) >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={`text-xs ${parseFloat(revenue.yoyPercentage) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {revenue.yoyPercentage}
                </span>
              </div>
            )}
          </div>

          {/* Net Profit */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              <span>Чистая прибыль</span>
            </div>
            <div className={`font-semibold text-lg ${netProfit.value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrencyCompact(netProfit.value)}
            </div>
            {netProfit.yoyPercentage && netProfit.yoyPercentage !== '—' && (
              <div className="flex items-center gap-1">
                {parseFloat(netProfit.yoyPercentage) >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={`text-xs ${parseFloat(netProfit.yoyPercentage) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netProfit.yoyPercentage}
                </span>
              </div>
            )}
          </div>

          {/* Reliability Score */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Shield className="h-3 w-3" />
              <span>Надежность</span>
            </div>
            <div className={`font-semibold text-lg ${getReliabilityColor(reliabilityScore)}`}>
              {reliabilityScore.toFixed(0)}/100
            </div>
            <Badge variant="outline" className="text-xs">
              {getReliabilityLabel(reliabilityScore)}
            </Badge>
          </div>

          {/* Total Assets */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <PieChart className="h-3 w-3" />
              <span>Активы</span>
            </div>
            <div className="font-semibold text-lg">{formatCurrencyCompact(totalAssets.value)}</div>
            {totalAssets.yoyPercentage && totalAssets.yoyPercentage !== '—' && (
              <span className="text-xs text-muted-foreground">{totalAssets.yoyPercentage}</span>
            )}
          </div>

          {/* Profit Margin */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Рентабельность</span>
            </div>
            <div className={`font-semibold text-lg ${profitMargin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatPercentage(profitMargin)}
            </div>
            <span className="text-xs text-muted-foreground">Маржа</span>
          </div>

          {/* Debt Ratio */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <PieChart className="h-3 w-3" />
              <span>Долговая нагрузка</span>
            </div>
            <div className={`font-semibold text-lg ${debtRatio > 70 ? 'text-red-600 dark:text-red-400' : debtRatio > 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
              {formatPercentage(debtRatio)}
            </div>
            <span className="text-xs text-muted-foreground">Коэфф.</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
