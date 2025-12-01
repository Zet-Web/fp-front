// Stacked bar chart showing Assets vs Liabilities over years

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Download } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { YearlyFinancialData } from '../types/finance';

interface BalanceSheetChartProps {
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

export function BalanceSheetChart({ yearlyData }: BalanceSheetChartProps) {
  const sortedData = [...yearlyData].sort((a, b) => a.year - b.year);

  const chartData = sortedData.map(item => ({
    year: item.year,
    assets: item.assets,
    liabilities: item.liabilities,
    equity: item.equity
  }));

  const handleDownload = () => {
    const csv = [
      ['Год', 'Активы', 'Обязательства', 'Капитал'],
      ...chartData.map(row => [
        row.year,
        row.assets,
        row.liabilities,
        row.equity
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'balance_sheet.csv';
    link.click();
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-blue-500" />
            Структура баланса
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
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
              />
              <Bar
                dataKey="assets"
                name="Активы"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="liabilities"
                name="Обязательства"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="equity"
                name="Капитал"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-muted-foreground">Активы</span>
            </div>
            <div className="font-semibold">{formatCurrency(chartData[chartData.length - 1]?.assets || 0)}</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-muted-foreground">Обязательства</span>
            </div>
            <div className="font-semibold">{formatCurrency(chartData[chartData.length - 1]?.liabilities || 0)}</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-muted-foreground">Капитал</span>
            </div>
            <div className={`font-semibold ${(chartData[chartData.length - 1]?.equity || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(chartData[chartData.length - 1]?.equity || 0)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
