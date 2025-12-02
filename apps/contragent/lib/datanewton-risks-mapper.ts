// Mapper to transform DataNewton Risks API response to app-friendly types

import { RisksData, RisksSummary, RiskFlag, RiskCategory } from '../types/risks';

export function mapToRisksSummary(data: RisksData): RisksSummary {
  const activeFlags = data.flags.filter(flag => flag.value === true);

  const byCategory: Record<RiskCategory, number> = {
    NEGATIVE_LISTS: 0,
    ONE_DAY_COMPANY: 0,
    OTHER_FACTS: 0,
    BANKRUPTCY: 0,
  };

  let negative = 0;
  let warning = 0;
  let positive = 0;

  activeFlags.forEach(flag => {
    byCategory[flag.type] = (byCategory[flag.type] || 0) + 1;

    if (flag.color === 'NEGATIVE') {
      negative++;
    } else if (flag.color === 'WARNING') {
      warning++;
    } else if (flag.color === 'POSITIVE') {
      positive++;
    }
  });

  const overallLevel = calculateOverallRiskLevel(negative, warning, positive);

  return {
    total: activeFlags.length,
    byCategory,
    bySeverity: {
      negative,
      warning,
      positive,
    },
    overallLevel,
  };
}

export function calculateOverallRiskLevel(
  negative: number,
  warning: number,
  positive: number
): 'low' | 'medium' | 'high' | 'critical' {
  if (negative >= 5) return 'critical';
  if (negative >= 3 || (negative >= 1 && warning >= 3)) return 'high';
  if (negative >= 1 || warning >= 2) return 'medium';
  return 'low';
}

export function groupRisksByCategory(flags: RiskFlag[]): Record<RiskCategory, RiskFlag[]> {
  const grouped: Record<RiskCategory, RiskFlag[]> = {
    NEGATIVE_LISTS: [],
    ONE_DAY_COMPANY: [],
    OTHER_FACTS: [],
    BANKRUPTCY: [],
  };

  flags.forEach(flag => {
    if (grouped[flag.type]) {
      grouped[flag.type].push(flag);
    }
  });

  return grouped;
}

export function sortRisksByPriority(flags: RiskFlag[]): RiskFlag[] {
  const priorityOrder: Record<string, number> = {
    NEGATIVE: 1,
    WARNING: 2,
    POSITIVE: 3,
  };

  return [...flags].sort((a, b) => {
    const aPriority = a.color ? priorityOrder[a.color] || 4 : 4;
    const bPriority = b.color ? priorityOrder[b.color] || 4 : 4;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    if (a.value !== b.value) {
      return a.value ? -1 : 1;
    }

    return 0;
  });
}
