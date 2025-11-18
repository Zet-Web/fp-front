// Component displaying payment calculation breakdown

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PaymentCalculation as PaymentCalc } from '../types/payment';
import { formatCurrency } from '../lib/payment-utils';

interface PaymentCalculationProps {
  calculation: PaymentCalc;
}

export function PaymentCalculation({ calculation }: PaymentCalculationProps) {
  const isFullPayment = calculation.planDuration === 0;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Расчет платежа</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Стоимость услуги:</span>
            <span className="font-medium">{formatCurrency(calculation.originalAmount)}</span>
          </div>

          {!isFullPayment && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ежемесячный платеж:</span>
              <span className="font-medium">{formatCurrency(calculation.monthlyPayment)}</span>
            </div>
          )}

          <div className="pt-3 border-t">
            <div className="flex justify-between">
              <span className="font-semibold">Итого к оплате:</span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(calculation.totalAmount)}
              </span>
            </div>
            {!isFullPayment && (
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {calculation.planDuration} платежей по {formatCurrency(calculation.monthlyPayment)}
              </p>
            )}
          </div>
        </div>

        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">
            {isFullPayment
              ? 'Оплата полной суммы без дополнительных комиссий'
              : `Рассрочка на ${calculation.planDuration} месяцев без переплат и комиссий`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
