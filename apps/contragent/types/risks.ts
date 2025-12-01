// Type definitions for company risk assessment data from DataNewton API

export type RiskColor = 'NEGATIVE' | 'WARNING' | 'POSITIVE' | null;

export type RiskCategory = 'NEGATIVE_LISTS' | 'ONE_DAY_COMPANY' | 'OTHER_FACTS' | 'BANKRUPTCY';

export type RiskDetailValueType = 'string' | 'date' | 'boolean' | 'url';

export interface RiskDetailItem {
  name: string;
  value: string;
  value_type: RiskDetailValueType;
}

export interface RiskFlag {
  value: boolean;
  color: RiskColor;
  details: RiskDetailItem[][];
  name: string;
  type: RiskCategory;
  positive: boolean;
  comment: string;
  description: string;
}

export interface RisksData {
  ogrn: string;
  flags: RiskFlag[];
  available_count: number;
}

export interface RisksSummary {
  total: number;
  byCategory: Record<RiskCategory, number>;
  bySeverity: {
    negative: number;
    warning: number;
    positive: number;
  };
  overallLevel: 'low' | 'medium' | 'high' | 'critical';
}

export const RISK_CATEGORY_LABELS: Record<RiskCategory, string> = {
  NEGATIVE_LISTS: 'Негативные списки',
  ONE_DAY_COMPANY: 'Признаки однодневок',
  OTHER_FACTS: 'Иные факты',
  BANKRUPTCY: 'Сведения о банкротстве',
};

export const RISK_COLOR_CLASSES: Record<NonNullable<RiskColor>, string> = {
  NEGATIVE: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800',
  WARNING: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  POSITIVE: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800',
};
