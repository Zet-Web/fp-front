// Detailed finance tab with comprehensive financial analysis

import { DollarSign, TrendingUp, PieChart, BarChart3, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DetailedFinancialData } from '../types/finance';

interface FinanceTabDetailedProps {
  data: DetailedFinancialData | null;
  isLoading: boolean;
  error: string | null;
}

function formatCurrency(value: number): string {
  if (value === 0) return '0 ₽';

  const absValue = Math.abs(value);
  if (absValue >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)} млрд ₽`;
  } else if (absValue >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)} млн ₽`;
  } else if (absValue >= 1_000) {
    return `${(value / 1_000).toFixed(2)} тыс ₽`;
  }
  return `${value.toFixed(0)} ₽`;
}

function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function FinanceTabDetailed({ data, isLoading, error }: FinanceTabDetailedProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
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
      <div className="text-center py-12">
        <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Финансовые данные недоступны</h3>
        <p className="text-muted-foreground">
          Компания не предоставила финансовую отчетность
        </p>
      </div>
    );
  }

  const latestData = data.yearlyData[0];
  const { ratios } = data;

  return (
    <div className="space-y-6">
      {/* Financial Overview Dashboard */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Финансовый обзор
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Выручка {latestData.year}</div>
              <div className="font-semibold text-xl">{formatCurrency(latestData.revenue)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Чистая прибыль</div>
              <div className={`font-semibold text-xl ${latestData.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(latestData.netProfit)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Валовая прибыль</div>
              <div className={`font-semibold text-xl ${latestData.grossProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(latestData.grossProfit)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Себестоимость</div>
              <div className="font-semibold text-xl">{formatCurrency(latestData.costOfSales)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Активы</div>
              <div className="font-semibold text-xl">{formatCurrency(latestData.assets)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Обязательства</div>
              <div className="font-semibold text-xl">{formatCurrency(latestData.liabilities)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Капитал</div>
              <div className={`font-semibold text-xl ${latestData.equity >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(latestData.equity)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Операц. расходы</div>
              <div className="font-semibold text-xl">{formatCurrency(latestData.operatingExpenses)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Ratios */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-blue-500" />
            Финансовые коэффициенты
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Рентабельность активов (ROA)</div>
              <div className={`font-semibold ${ratios.returnOnAssets >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatPercentage(ratios.returnOnAssets)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Рентабельность капитала (ROE)</div>
              <div className={`font-semibold ${ratios.returnOnEquity >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatPercentage(ratios.returnOnEquity)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Валовая маржа</div>
              <div className="font-semibold">{formatPercentage(ratios.grossMargin)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Чистая маржа</div>
              <div className={`font-semibold ${ratios.netMargin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatPercentage(ratios.netMargin)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Долг/Собств. капитал</div>
              <div className={`font-semibold ${ratios.debtToEquity > 2 ? 'text-red-600 dark:text-red-400' : ratios.debtToEquity > 1 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                {ratios.debtToEquity.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Долг/Активы</div>
              <div className={`font-semibold ${ratios.debtToAssets > 0.7 ? 'text-red-600 dark:text-red-400' : ratios.debtToAssets > 0.5 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                {ratios.debtToAssets.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multi-Year Performance Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Динамика показателей по годам
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-muted-foreground">Показатель</th>
                  {data.years.map(year => (
                    <th key={year} className="text-right py-2 font-medium text-muted-foreground">
                      {year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2 font-medium">Выручка</td>
                  {data.yearlyData.map(yearData => (
                    <td key={yearData.year} className="text-right py-2">
                      {formatCurrency(yearData.revenue)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 font-medium">Чистая прибыль</td>
                  {data.yearlyData.map(yearData => (
                    <td key={yearData.year} className={`text-right py-2 ${yearData.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {formatCurrency(yearData.netProfit)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 font-medium">Активы</td>
                  {data.yearlyData.map(yearData => (
                    <td key={yearData.year} className="text-right py-2">
                      {formatCurrency(yearData.assets)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 font-medium">Обязательства</td>
                  {data.yearlyData.map(yearData => (
                    <td key={yearData.year} className="text-right py-2">
                      {formatCurrency(yearData.liabilities)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 font-medium">Капитал</td>
                  {data.yearlyData.map(yearData => (
                    <td key={yearData.year} className={`text-right py-2 ${yearData.equity >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {formatCurrency(yearData.equity)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for Future Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            График финансовых показателей
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>График будет реализован на следующем этапе</p>
              <p className="text-sm">Данные готовы для визуализации</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
