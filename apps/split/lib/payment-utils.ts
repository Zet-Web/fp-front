// Utility functions for payment calculations and formatting

import { PaymentCalculation, PaymentPlan, PaymentMethod } from '../types/payment';

export const MIN_AMOUNT = 5000;

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const generatePaymentLink = (amount: number): string => {
  const id = Math.random().toString(36).substring(2, 12).toUpperCase();
  return `https://pay.example.ru/${id}`;
};

export const calculatePayment = (
  amount: number,
  plan: PaymentPlan,
  method: PaymentMethod
): PaymentCalculation => {
  if (plan.duration === 0) {
    // Full payment with discount
    const discount = amount * (plan.discount! / 100);
    const amountAfterDiscount = amount - discount;
    const processingFee = amountAfterDiscount * (method.feePercentage / 100);
    const totalAmount = amountAfterDiscount + processingFee;

    return {
      originalAmount: amount,
      setupFee: 0,
      discount,
      monthlyPayment: 0,
      processingFee,
      totalProcessingFees: processingFee,
      totalAmount,
      planDuration: 0
    };
  } else {
    // Installment payment
    const remainingAmount = amount - plan.setupFee;
    const monthlyPayment = remainingAmount / plan.duration;
    const processingFee = monthlyPayment * (method.feePercentage / 100);
    const totalProcessingFees = processingFee * plan.duration;
    const totalAmount = plan.setupFee + (monthlyPayment + processingFee) * plan.duration;

    return {
      originalAmount: amount,
      setupFee: plan.setupFee,
      discount: 0,
      monthlyPayment,
      processingFee,
      totalProcessingFees,
      totalAmount,
      planDuration: plan.duration
    };
  }
};

export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join(' ').substring(0, 19); // 16 digits + 3 spaces
};

export const formatExpiry = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
  }
  return cleaned;
};

export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  return cleaned.length === 16 && /^\d+$/.test(cleaned);
};

export const validateExpiry = (expiry: string): boolean => {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = parseInt(match[1]);
  const year = parseInt(match[2]);
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;

  if (month < 1 || month > 12) return false;
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
};

export const validateCVC = (cvc: string): boolean => {
  return /^\d{3}$/.test(cvc);
};

export const validateCardHolder = (name: string): boolean => {
  return name.trim().length >= 3 && /^[a-zA-Z\s]+$/.test(name);
};
