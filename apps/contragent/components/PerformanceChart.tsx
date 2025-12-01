// Multi-line chart showing Revenue, Net Profit, and other financial metrics over years

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Download } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { YearlyFinancialData } from '../types/finance';

interface PerformanceChartProps {
  yearlyData: YearlyFinancialData[];
}

function formatCurrency(value: number): string {
  const absValue = Math.abs(value);
  if (absValue >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)} млрд ₽`;
  } else if (absValue >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)} млн ₽`;
  } else if (absValue >= 1_000) {
    return `${(value / 1_000).toFixed(0)} тыс ₽`;
  }
  return `${value.toFixed(0)} ₽`;
}

export function PerformanceChart({ yearlyData }: PerformanceChartProps) {
  const [visibleLines, setVisibleLines] = useState({
    revenue: true,
    netProfit: true,
    grossProfit: true,
    costOfSales: false
  });

  const sortedData = [...yearlyData].sort((a, b) => a.year - b.year);

  const chartData = sortedData.map(item => ({
    year: item.year,
    revenue: item.revenue,
    netProfit: item.netProfit,
    grossProfit: item.grossProfit,
    costOfSales: item.costOfSales
  }));

  const toggleLine = (lineKey: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({
      ...prev,
      [lineKey]: !prev[lineKey]
    }));
  };

  const handleDownload = () => {
    const csv = [
      ['Год', 'Выручка', 'Чистая прибыль', 'Валовая прибыль', 'Себестоимость'],
      ...chartData.map(row => [
        row.year,
        row.revenue,
        row.netProfit,
        row.grossProfit,
        row.costOfSales
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'financial_performance.csv';
    link.click();
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Динамика финансовых показателей
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={visibleLines.revenue ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleLine('revenue')}
            >
              Выручка
            </Badge>
            <Badge
              variant={visibleLines.netProfit ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleLine('netProfit')}
            >
              Чистая прибыль
            </Badge>
            <Badge
              variant={visibleLines.grossProfit ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleLine('grossProfit')}
            >
              Валовая прибыль
            </Badge>
            <Badge
              variant={visibleLines.costOfSales ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleLine('costOfSales')}
            >
              Себестоимость
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="ml-2"
            >
              <Download className="h-4 w-4 mr-1" />
              CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="year"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
                formatter={(value: number) => formatCurrency(value)}
                labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              {visibleLines.revenue && (
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Выручка"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
              {visibleLines.netProfit && (
                <Line
                  type="monotone"
                  dataKey="netProfit"
                  name="Чистая прибыль"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
              {visibleLines.grossProfit && (
                <Line
                  type="monotone"
                  dataKey="grossProfit"
                  name="Валовая прибыль"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
              {visibleLines.costOfSales && (
                <Line
                  type="monotone"
                  dataKey="costOfSales"
                  name="Себестоимость"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-muted-foreground text-center">
          Нажмите на метки выше, чтобы показать/скрыть линии на графике
        </div>
      </CardContent>
    </Card>
  );
}
