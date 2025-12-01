// Area chart showing profit margins and profitability metrics over years

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Download } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { YearlyFinancialData } from '../types/finance';

interface ProfitabilityChartProps {
  yearlyData: YearlyFinancialData[];
}

function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function ProfitabilityChart({ yearlyData }: ProfitabilityChartProps) {
  const sortedData = [...yearlyData].sort((a, b) => a.year - b.year);

  const chartData = sortedData.map(item => {
    const grossMargin = item.revenue > 0 ? (item.grossProfit / item.revenue) * 100 : 0;
    const netMargin = item.revenue > 0 ? (item.netProfit / item.revenue) * 100 : 0;
    const operatingMargin = item.revenue > 0 ? ((item.revenue - item.costOfSales - item.operatingExpenses) / item.revenue) * 100 : 0;

    return {
      year: item.year,
      grossMargin,
      netMargin,
      operatingMargin
    };
  });

  const handleDownload = () => {
    const csv = [
      ['Год', 'Валовая маржа (%)', 'Операционная маржа (%)', 'Чистая маржа (%)'],
      ...chartData.map(row => [
        row.year,
        row.grossMargin.toFixed(2),
        row.operatingMargin.toFixed(2),
        row.netMargin.toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'profitability_margins.csv';
    link.click();
  };

  const latestData = chartData[chartData.length - 1];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Рентабельность и маржинальность
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-1" />
            CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorGrossMargin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorOperatingMargin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorNetMargin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="year"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={formatPercentage}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
                formatter={(value: number) => formatPercentage(value)}
                labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
              />
              <Area
                type="monotone"
                dataKey="grossMargin"
                name="Валовая маржа"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorGrossMargin)"
              />
              <Area
                type="monotone"
                dataKey="operatingMargin"
                name="Операционная маржа"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorOperatingMargin)"
              />
              <Area
                type="monotone"
                dataKey="netMargin"
                name="Чистая маржа"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorNetMargin)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {latestData && (
          <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-muted-foreground">Валовая маржа</span>
              </div>
              <div className="font-semibold">{formatPercentage(latestData.grossMargin)}</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 bg-amber-500 rounded"></div>
                <span className="text-muted-foreground">Операционная маржа</span>
              </div>
              <div className="font-semibold">{formatPercentage(latestData.operatingMargin)}</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-muted-foreground">Чистая маржа</span>
              </div>
              <div className={`font-semibold ${latestData.netMargin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatPercentage(latestData.netMargin)}
              </div>
            </div>
          </div>
        )}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Валовая маржа:</strong> доля валовой прибыли в выручке •
            <strong className="ml-2">Операционная маржа:</strong> эффективность основной деятельности •
            <strong className="ml-2">Чистая маржа:</strong> итоговая прибыльность бизнеса
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
