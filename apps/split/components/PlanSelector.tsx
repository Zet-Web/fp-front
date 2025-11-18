// Component for selecting payment plan

import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PaymentPlan } from '../types/payment';

interface PlanSelectorProps {
  plans: PaymentPlan[];
  selectedPlan: PaymentPlan;
  onSelectPlan: (plan: PaymentPlan) => void;
}

export function PlanSelector({ plans, selectedPlan, onSelectPlan }: PlanSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Выберите план оплаты</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {plans.map((plan) => {
          const isSelected = selectedPlan.id === plan.id;
          return (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? 'border-blue-500 border-2 bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:border-blue-300'
              }`}
              onClick={() => onSelectPlan(plan)}
            >
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{plan.name}</h4>
                  {isSelected && <Check className="h-5 w-5 text-blue-500" />}
                </div>
                <p className="text-xs text-muted-foreground">{plan.description}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
