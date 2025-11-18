// Mock data for payment installment functionality

import { PaymentPlan, PaymentMethod, Bank } from '../types/payment';

export const paymentPlans: PaymentPlan[] = [
  {
    id: 'full',
    name: 'Полная оплата',
    duration: 0,
    setupFee: 0,
    discount: 0,
    description: 'Оплата полной суммы сразу'
  },
  {
    id: '3months',
    name: '3 месяца',
    duration: 3,
    setupFee: 0,
    description: 'Рассрочка на 3 месяца без переплат'
  },
  {
    id: '6months',
    name: '6 месяцев',
    duration: 6,
    setupFee: 0,
    description: 'Рассрочка на 6 месяцев без переплат'
  },
  {
    id: '12months',
    name: '12 месяцев',
    duration: 12,
    setupFee: 0,
    description: 'Рассрочка на 12 месяцев без переплат'
  },
  {
    id: '24months',
    name: '24 месяца',
    duration: 24,
    setupFee: 0,
    description: 'Рассрочка на 24 месяца без переплат'
  }
];

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Банковская карта',
    icon: 'CreditCard',
    feePercentage: 0,
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
    feePercentage: 0,
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
