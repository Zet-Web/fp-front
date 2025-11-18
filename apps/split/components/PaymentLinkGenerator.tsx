// Component for generating payment links

import { useState } from 'react';
import { Link2, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MIN_AMOUNT, formatCurrency, generatePaymentLink } from '../lib/payment-utils';
import { PaymentLink } from '../types/payment';

interface PaymentLinkGeneratorProps {
  onLinkGenerated: (link: PaymentLink) => void;
}

export function PaymentLinkGenerator({ onLinkGenerated }: PaymentLinkGeneratorProps) {
  const [amount, setAmount] = useState<string>('');
  const [generatedLink, setGeneratedLink] = useState<PaymentLink | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>('');

  const handleGenerateLink = () => {
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount < MIN_AMOUNT) {
      setError(`Минимальная сумма: ${formatCurrency(MIN_AMOUNT)}`);
      return;
    }

    setError('');
    const link: PaymentLink = {
      id: Math.random().toString(36).substring(2, 12).toUpperCase(),
      amount: numAmount,
      url: generatePaymentLink(numAmount),
      createdAt: new Date().toISOString()
    };

    setGeneratedLink(link);
    onLinkGenerated(link);
  };

  const handleCopyLink = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-blue-500" />
          Генератор ссылки на оплату
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Стоимость услуги</Label>
          <div className="flex gap-2">
            <Input
              id="amount"
              type="number"
              placeholder={`Минимум ${formatCurrency(MIN_AMOUNT)}`}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              min={MIN_AMOUNT}
            />
            <Button onClick={handleGenerateLink} className="shrink-0">
              Создать ссылку
            </Button>
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>

        {generatedLink && (
          <div className="space-y-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  Ссылка создана
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  ID: {generatedLink.id}
                </p>
              </div>
              <p className="text-lg font-semibold text-green-900 dark:text-green-100">
                {formatCurrency(generatedLink.amount)}
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                value={generatedLink.url}
                readOnly
                className="bg-white dark:bg-gray-950"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
