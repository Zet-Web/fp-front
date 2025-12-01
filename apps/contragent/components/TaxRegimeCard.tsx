// Component displaying tax regime information

import { Receipt, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TaxRegime } from '../types/company';
import { formatDate } from '../lib/company-utils';

interface TaxRegimeCardProps {
  taxRegime: TaxRegime[] | undefined;
  isLoading: boolean;
}

function getTaxRegimeLabel(type: string): string {
  const labels: Record<string, string> = {
    'USN': 'УСН',
    'OSNO': 'ОСНО',
    'ENVD': 'ЕНВД',
    'ESHN': 'ЕСХН',
    'PSN': 'ПСН'
  };
  return labels[type] || type;
}

function getTaxRegimeName(type: string, name?: string): string {
  if (name) return name;

  const names: Record<string, string> = {
    'USN': 'Упрощённая система налогообложения',
    'OSNO': 'Общая система налогообложения',
    'ENVD': 'Единый налог на вменённый доход',
    'ESHN': 'Единый сельскохозяйственный налог',
    'PSN': 'Патентная система налогообложения'
  };
  return names[type] || 'Неизвестный режим';
}

export function TaxRegimeCard({ taxRegime, isLoading }: TaxRegimeCardProps) {
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-blue-500" />
            Налоговый режим
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-32" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!taxRegime || taxRegime.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-blue-500" />
            Налоговый режим
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">Данные о налоговом режиме недоступны</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentRegime = taxRegime.find(r => !r.date_to) || taxRegime[0];
  const hasHistory = taxRegime.length > 1;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-blue-500" />
          Налоговый режим
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-base px-3 py-1">
              {getTaxRegimeLabel(currentRegime.type)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Действующий
            </Badge>
          </div>

          <p className="text-sm font-medium">
            {getTaxRegimeName(currentRegime.type, currentRegime.name)}
          </p>

          {currentRegime.date_from && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>С {formatDate(currentRegime.date_from)}</span>
              {currentRegime.date_to && (
                <span>по {formatDate(currentRegime.date_to)}</span>
              )}
            </div>
          )}

          {hasHistory && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                История смены режимов: {taxRegime.length - 1} изменений
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
