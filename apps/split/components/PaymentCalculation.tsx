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
        <CardTitle className="flex items-center justify-between">
          <span>Расчет платежа</span>
          {isFullPayment && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Скидка 10%
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Стоимость услуги:</span>
            <span className="font-medium">{formatCurrency(calculation.originalAmount)}</span>
          </div>

          {isFullPayment ? (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Скидка (10%):</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  -{formatCurrency(calculation.discount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Комиссия обработки:</span>
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  +{formatCurrency(calculation.processingFee)}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Комиссия за оформление:</span>
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  +{formatCurrency(calculation.setupFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ежемесячный платеж:</span>
                <span className="font-medium">{formatCurrency(calculation.monthlyPayment)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Комиссия за платеж:</span>
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  +{formatCurrency(calculation.processingFee)} × {calculation.planDuration}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Всего комиссий:</span>
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  {formatCurrency(calculation.totalProcessingFees)}
                </span>
              </div>
            </>
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
                {calculation.planDuration} платежей по {formatCurrency(calculation.monthlyPayment + calculation.processingFee)}
              </p>
            )}
          </div>
        </div>

        {isFullPayment ? (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              Вы экономите {formatCurrency(calculation.discount)} при полной оплате!
            </p>
          </div>
        ) : (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Рассрочка на {calculation.planDuration} месяцев. Переплата составит{' '}
              {formatCurrency(calculation.totalAmount - calculation.originalAmount)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
