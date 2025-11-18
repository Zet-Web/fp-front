// Mock data for payment installment functionality

import { PaymentPlan, PaymentMethod, Bank } from '../types/payment';

export const paymentPlans: PaymentPlan[] = [
  {
    id: 'full',
    name: 'Полная оплата',
    duration: 0,
    setupFee: 0,
    discount: 10,
    description: 'Скидка 10% при полной оплате'
  },
  {
    id: '3months',
    name: '3 месяца',
    duration: 3,
    setupFee: 500,
    description: 'Комиссия за оформление 500 ₽'
  },
  {
    id: '6months',
    name: '6 месяцев',
    duration: 6,
    setupFee: 800,
    description: 'Комиссия за оформление 800 ₽'
  },
  {
    id: '12months',
    name: '12 месяцев',
    duration: 12,
    setupFee: 1200,
    description: 'Комиссия за оформление 1 200 ₽'
  },
  {
    id: '24months',
    name: '24 месяца',
    duration: 24,
    setupFee: 2000,
    description: 'Комиссия за оформление 2 000 ₽'
  }
];

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Банковская карта',
    icon: 'CreditCard',
    feePercentage: 2.5,
    processingTime: 'Мгновенно'
  },
  {
    id: 'sbp',
    name: 'СБП',
    icon: 'Smartphone',
    feePercentage: 0,
    processingTime: 'Мгновенно'
  },
  {
    id: 'transfer',
    name: 'Банковский перевод',
    icon: 'Building2',
    feePercentage: 0,
    processingTime: '1-3 рабочих дня'
  },
  {
    id: 'ewallet',
    name: 'Электронный кошелек',
    icon: 'Wallet',
    feePercentage: 3,
    processingTime: 'Мгновенно'
  }
];

export const banks: Bank[] = [
  { id: 'sberbank', name: 'Сбербанк', available: true },
  { id: 'vtb', name: 'ВТБ', available: true },
  { id: 'alfabank', name: 'Альфа-Банк', available: true },
  { id: 'tinkoff', name: 'Тинькофф', available: true },
  { id: 'gazprombank', name: 'Газпромбанк', available: false }
];
