// Split payment page for legal services with installment calculator

import { useState } from "react";
import {
  CreditCard,
  TrendingUp,
  Shield,
  Clock,
  Calculator,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentLinkGenerator } from "./components/PaymentLinkGenerator";
import { PlanSelector } from "./components/PlanSelector";
import { MethodSelector } from "./components/MethodSelector";
import { PaymentCalculation } from "./components/PaymentCalculation";
import { PaymentModal } from "./components/PaymentModal";
import { paymentPlans, paymentMethods } from "./lib/mock-data";
import { calculatePayment } from "./lib/payment-utils";
import { PaymentLink } from "./types/payment";

export default function SplitPage() {
  const [paymentLink, setPaymentLink] = useState<PaymentLink | null>(null);
  const [selectedPlan, setSelectedPlan] = useState(paymentPlans[0]);
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const calculation = paymentLink
    ? calculatePayment(paymentLink.amount, selectedPlan, selectedMethod)
    : null;

  const benefits = [
    {
      icon: TrendingUp,
      title: "Юрист получает деньги сразу",
      description: "Полная сумма поступает на счет моментально, без ожидания",
    },
    {
      icon: Clock,
      title: "Клиент платит частями",
      description: "Удобная рассрочка от 3 до 24 месяцев без переплат банку",
    },
    {
      icon: Shield,
      title: "Без залогов и справок",
      description: "Не требуется подтверждение дохода или обеспечение",
    },
    {
      icon: Calculator,
      title: "Прозрачный расчет",
      description: "Все комиссии и условия известны заранее",
    },
  ];

  const handlePaymentClick = () => {
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto md:px-4 md:py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-lg">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  Оплата юридических услуг в рассрочку
                </h1>
                <p className="text-muted-foreground">
                  Сервис для создания ссылок на оплату с возможностью рассрочки
                  для клиентов
                </p>
              </div>
            </div>
          </div>

          {/* Demo Alert */}
          <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <strong>Демо-режим:</strong> Все данные являются тестовыми.
              Реальные платежи не производятся.
            </AlertDescription>
          </Alert>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card
                  key={index}
                  className="shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg w-fit">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Payment Link Generator */}
          <PaymentLinkGenerator onLinkGenerated={setPaymentLink} />

          {/* Calculator Section */}
          {paymentLink && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center gap-2">
                <Calculator className="h-6 w-6 text-blue-500" />
                <h2 className="text-2xl font-bold">Калькулятор рассрочки</h2>
              </div>

              {/* Plan Selection */}
              <PlanSelector
                plans={paymentPlans}
                selectedPlan={selectedPlan}
                onSelectPlan={setSelectedPlan}
              />

              {/* Method Selection */}
              <MethodSelector
                methods={paymentMethods}
                selectedMethod={selectedMethod}
                onSelectMethod={setSelectedMethod}
              />

              {/* Calculation Results */}
              {calculation && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <PaymentCalculation calculation={calculation} />
                  </div>
                  <div className="lg:col-span-1">
                    <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
                      <CardContent className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold">
                          Готовы к оплате?
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Нажмите кнопку ниже для перехода к форме оплаты. В
                          демо-режиме используются тестовые данные.
                        </p>
                        <Button
                          onClick={handlePaymentClick}
                          className="w-full"
                          size="lg"
                        >
                          Перейти к оплате
                        </Button>
                        <div className="pt-4 border-t space-y-2 text-xs text-muted-foreground">
                          <p>✓ Безопасное соединение</p>
                          <p>✓ Защита данных по стандарту PCI DSS</p>
                          <p>✓ 3D Secure аутентификация</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Info Section */}
              <Card className="shadow-sm hover:shadow-md transition-shadow bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                    Как это работает
                  </h3>
                  <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    <p>
                      1. Юрист создает ссылку на оплату с указанием стоимости
                      услуги
                    </p>
                    <p>
                      2. Клиент выбирает удобный план рассрочки (от 3 до 24
                      месяцев)
                    </p>
                    <p>
                      3. Клиент оплачивает первый взнос, остальное — банку в
                      рассрочку
                    </p>
                    <p>4. Юрист получает полную сумму на свой счет сразу</p>
                    <p>
                      5. Клиент погашает задолженность перед банком по графику
                      платежей
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Initial State */}
          {!paymentLink && (
            <div className="text-center py-16 space-y-4">
              <div className="inline-block p-6 bg-muted rounded-full">
                <CreditCard className="h-16 w-16 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Начните с создания ссылки
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Укажите стоимость юридической услуги и создайте ссылку для
                  клиента. После этого вы сможете рассчитать условия рассрочки.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {calculation && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          amount={calculation.totalAmount}
        />
      )}
    </div>
  );
}
