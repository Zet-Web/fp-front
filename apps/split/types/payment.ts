// Type definitions for payment installment functionality

export interface PaymentPlan {
  id: string;
  name: string;
  duration: number; // 0 for full payment, otherwise months
  setupFee: number;
  discount?: number; // percentage for full payment
  description: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  feePercentage: number;
  processingTime: string;
}

export interface Bank {
  id: string;
  name: string;
  available: boolean;
}

export interface PaymentCalculation {
  originalAmount: number;
  setupFee: number;
  discount: number;
  monthlyPayment: number;
  processingFee: number;
  totalProcessingFees: number;
  totalAmount: number;
  planDuration: number;
}

export interface PaymentLink {
  id: string;
  amount: number;
  url: string;
  createdAt: string;
}

export interface PaymentFormData {
  bank: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardHolder: string;
}
