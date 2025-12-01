// Type definitions for financial data structures

export interface FinancialMetricBasic {
  value: number;
  year: number;
  yoyChange?: number;
  yoyPercentage?: string;
}

export interface BasicFinancialMetrics {
  revenue: FinancialMetricBasic;
  netProfit: FinancialMetricBasic;
  totalAssets: FinancialMetricBasic;
  totalLiabilities: FinancialMetricBasic;
  equity: FinancialMetricBasic;
  reliabilityScore: number;
  profitMargin: number;
  debtRatio: number;
}

export interface YearlyFinancialData {
  year: number;
  revenue: number;
  netProfit: number;
  grossProfit: number;
  operatingExpenses: number;
  assets: number;
  liabilities: number;
  equity: number;
  costOfSales: number;
  managementExpenses: number;
}

export interface FinancialIndicator {
  name: string;
  code: string;
  values: Record<string, number>;
}

export interface FinancialRatios {
  currentRatio: number;
  quickRatio: number;
  debtToEquity: number;
  debtToAssets: number;
  returnOnAssets: number;
  returnOnEquity: number;
  grossMargin: number;
  netMargin: number;
  assetTurnover: number;
}

export interface DetailedFinancialData {
  years: number[];
  yearlyData: YearlyFinancialData[];
  indicators: FinancialIndicator[];
  ratios: FinancialRatios;
  balanceSheet: {
    assets: BalanceSheetSection;
    liabilities: BalanceSheetSection;
  };
}

export interface BalanceSheetSection {
  name: string;
  total: Record<string, number>;
  categories: BalanceSheetCategory[];
}

export interface BalanceSheetCategory {
  name: string;
  code: string;
  values: Record<string, number>;
  subCategories?: BalanceSheetCategory[];
}

export interface FinanceLoadingState {
  isLoading: boolean;
  error: string | null;
  data: DetailedFinancialData | null;
}
