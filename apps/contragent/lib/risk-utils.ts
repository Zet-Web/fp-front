// Utility functions for risk assessment display and formatting

import {
  AlertTriangle,
  XCircle,
  CheckCircle,
  Shield,
  Building,
  FileWarning,
  Info,
  type LucideIcon
} from 'lucide-react';
import { RiskColor, RiskCategory, RiskDetailItem, RISK_COLOR_CLASSES } from '../types/risks';
import { formatDate } from './company-utils';

export function getRiskColorClass(color: RiskColor): string {
  if (!color) return 'bg-gray-100 dark:bg-gray-800/20 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700';
  return RISK_COLOR_CLASSES[color];
}

export function getRiskIcon(color: RiskColor): LucideIcon {
  switch (color) {
    case 'NEGATIVE':
      return XCircle;
    case 'WARNING':
      return AlertTriangle;
    case 'POSITIVE':
      return CheckCircle;
    default:
      return Info;
  }
}

export function getCategoryIcon(type: RiskCategory): LucideIcon {
  switch (type) {
    case 'NEGATIVE_LISTS':
      return Shield;
    case 'ONE_DAY_COMPANY':
      return FileWarning;
    case 'BANKRUPTCY':
      return AlertTriangle;
    case 'OTHER_FACTS':
      return Info;
    default:
      return Building;
  }
}

export function formatRiskDetail(detail: RiskDetailItem): string {
  switch (detail.value_type) {
    case 'date':
      return formatDate(detail.value);
    case 'boolean':
      return detail.value === 'true' ? 'Да' : 'Нет';
    case 'url':
      return detail.value;
    case 'string':
    default:
      return detail.value;
  }
}

export function getRiskLevelColor(level: 'low' | 'medium' | 'high' | 'critical'): string {
  switch (level) {
    case 'critical':
      return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
    case 'high':
      return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20';
    case 'medium':
      return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
    case 'low':
      return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
  }
}

export function getRiskLevelLabel(level: 'low' | 'medium' | 'high' | 'critical'): string {
  switch (level) {
    case 'critical':
      return 'Критический';
    case 'high':
      return 'Высокий';
    case 'medium':
      return 'Средний';
    case 'low':
      return 'Низкий';
  }
}

export function calculateRiskScore(summary: { negative: number; warning: number; positive: number }): number {
  let score = 100;

  score -= summary.negative * 15;
  score -= summary.warning * 5;
  score += summary.positive * 3;

  return Math.max(0, Math.min(100, score));
}
