// Modal for payment form with three-step flow

import { useState } from 'react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { banks } from '../lib/mock-data';
import { formatCardNumber, formatExpiry, validateCardNumber, validateExpiry, validateCVC, validateCardHolder, formatCurrency } from '../lib/payment-utils';
import { PaymentFormData } from '../types/payment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

type Step = 'form' | 'processing' | 'success';

export function PaymentModal({ isOpen, onClose, amount }: PaymentModalProps) {
  const [step, setStep] = useState<Step>('form');
  const [formData, setFormData] = useState<PaymentFormData>({
    bank: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    cardHolder: ''
  });
  const [errors, setErrors] = useState<Partial<PaymentFormData>>({});

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    let formattedValue = value;

    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cvc') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3);
    } else if (field === 'cardHolder') {
      formattedValue = value.toUpperCase();
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentFormData> = {};

    if (!formData.bank) newErrors.bank = 'Выберите банк';
    if (!validateCardNumber(formData.cardNumber)) newErrors.cardNumber = 'Неверный номер карты';
    if (!validateExpiry(formData.expiry)) newErrors.expiry = 'Неверная дата';
    if (!validateCVC(formData.cvc)) newErrors.cvc = 'Неверный CVC';
    if (!validateCardHolder(formData.cardHolder)) newErrors.cardHolder = 'Неверное имя';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setStep('processing');

    // Simulate payment processing
    setTimeout(() => {
      setStep('success');
    }, 3000);
  };

  const handleClose = () => {
    setStep('form');
    setFormData({
      bank: '',
      cardNumber: '',
      expiry: '',
      cvc: '',
      cardHolder: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>
              {step === 'form' && 'Оплата'}
              {step === 'processing' && 'Обработка платежа'}
              {step === 'success' && 'Платеж успешен'}
            </span>
        </DialogHeader>

        {step === 'form' && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                К оплате: <span className="font-semibold">{formatCurrency(amount)}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank">Банк</Label>
              <Select value={formData.bank} onValueChange={(value) => handleInputChange('bank', value)}>
                <SelectTrigger id="bank">
                  <SelectValue placeholder="Выберите банк" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id} disabled={!bank.available}>
                      {bank.name} {!bank.available && '(недоступен)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bank && <p className="text-xs text-red-600 dark:text-red-400">{errors.bank}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Номер карты</Label>
              <Input
                id="cardNumber"
                placeholder="0000 0000 0000 0000"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                maxLength={19}
              />
              {errors.cardNumber && <p className="text-xs text-red-600 dark:text-red-400">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="expiry">Срок действия</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={(e) => handleInputChange('expiry', e.target.value)}
                  maxLength={5}
                />
                {errors.expiry && <p className="text-xs text-red-600 dark:text-red-400">{errors.expiry}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  type="password"
                  value={formData.cvc}
                  onChange={(e) => handleInputChange('cvc', e.target.value)}
                  maxLength={3}
                />
                {errors.cvc && <p className="text-xs text-red-600 dark:text-red-400">{errors.cvc}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardHolder">Имя владельца</Label>
              <Input
                id="cardHolder"
                placeholder="IVAN IVANOV"
                value={formData.cardHolder}
                onChange={(e) => handleInputChange('cardHolder', e.target.value)}
              />
              {errors.cardHolder && <p className="text-xs text-red-600 dark:text-red-400">{errors.cardHolder}</p>}
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Оплатить {formatCurrency(amount)}
            </Button>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
            <p className="text-lg font-medium">Обработка платежа...</p>
            <p className="text-sm text-muted-foreground">Пожалуйста, подождите</p>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
              <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-lg font-medium">Платеж успешно обработан!</p>
            <p className="text-sm text-muted-foreground text-center">
              Оплата на сумму {formatCurrency(amount)} успешно завершена
            </p>
            <Button onClick={handleClose} className="w-full">
              Закрыть
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
