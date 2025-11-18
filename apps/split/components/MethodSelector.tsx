// Component for selecting payment method

import { CreditCard, Smartphone, Building2, Wallet, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PaymentMethod } from '../types/payment';

interface MethodSelectorProps {
  methods: PaymentMethod[];
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

const iconMap = {
  CreditCard,
  Smartphone,
  Building2,
  Wallet
};

export function MethodSelector({ methods, selectedMethod, onSelectMethod }: MethodSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Способ оплаты</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {methods.map((method) => {
          const isSelected = selectedMethod.id === method.id;
          const Icon = iconMap[method.icon as keyof typeof iconMap];

          return (
            <Card
              key={method.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? 'border-blue-500 border-2 bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:border-blue-300'
              }`}
              onClick={() => onSelectMethod(method)}
            >
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Icon className={`h-6 w-6 ${isSelected ? 'text-blue-500' : 'text-muted-foreground'}`} />
                  {isSelected && <Check className="h-5 w-5 text-blue-500" />}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{method.name}</h4>
                  <p className="text-xs text-muted-foreground">{method.processingTime}</p>
                  {method.feePercentage > 0 && (
                    <p className="text-xs text-orange-600 dark:text-orange-400">
                      +{method.feePercentage}% комиссия
                    </p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
