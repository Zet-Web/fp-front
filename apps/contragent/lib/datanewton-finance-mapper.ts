// Mapper to transform DataNewton Finance API response to app-friendly types

import { DataNewtonFinanceResponse, FinanceReportRow } from './datanewton-api';
import {
  BasicFinancialMetrics,
  DetailedFinancialData,
  YearlyFinancialData,
  FinancialIndicator,
  FinancialRatios,
  BalanceSheetSection,
  BalanceSheetCategory,
  FinancialMetricBasic
} from '../types/finance';

function getIndicatorByCode(indicators: FinanceReportRow[], code: string): FinanceReportRow | undefined {
  return indicators.find(ind => ind.code === code);
}

function getLatestValue(sum: Record<string, number>, years: number[]): number {
  if (!years || years.length === 0) return 0;
  const latestYear = Math.max(...years);
  return sum[latestYear.toString()] || 0;
}

function calculateYoYChange(sum: Record<string, number>, years: number[]): { change: number; percentage: string } {
  if (!years || years.length < 2) return { change: 0, percentage: '—' };

  const sortedYears = [...years].sort((a, b) => b - a);
  const currentYear = sortedYears[0];
  const previousYear = sortedYears[1];

  const currentValue = sum[currentYear.toString()] || 0;
  const previousValue = sum[previousYear.toString()] || 0;

  const change = currentValue - previousValue;

  if (previousValue === 0) return { change, percentage: '—' };

  const percentage = ((change / previousValue) * 100).toFixed(1);
  return { change, percentage: `${parseFloat(percentage) > 0 ? '+' : ''}${percentage}%` };
}

function mapToFinancialMetricBasic(
  sum: Record<string, number>,
  years: number[]
): FinancialMetricBasic {
  if (!years || years.length === 0) {
    return { value: 0, year: new Date().getFullYear(), yoyPercentage: '—' };
  }

  const latestYear = Math.max(...years);
  const value = sum[latestYear.toString()] || 0;
  const { change, percentage } = calculateYoYChange(sum, years);

  return {
    value,
    year: latestYear,
    yoyChange: change,
    yoyPercentage: percentage
  };
}

export function mapToBasicFinancialMetrics(
  data: DataNewtonFinanceResponse
): BasicFinancialMetrics | null {
  try {
    const { fin_results, balances } = data;

    if (!fin_results || !balances) return null;

    const years = fin_results.years || [];
    if (years.length === 0) return null;

    const revenue = getIndicatorByCode(fin_results.indicators, '2110');
    const netProfit = getIndicatorByCode(fin_results.indicators, '2400');

    const assets = balances.assets;
    const liabilities = balances.liabilities;

    const revenueMetric = revenue ? mapToFinancialMetricBasic(revenue.sum, years) : { value: 0, year: years[0], yoyPercentage: '—' };
    const netProfitMetric = netProfit ? mapToFinancialMetricBasic(netProfit.sum, years) : { value: 0, year: years[0], yoyPercentage: '—' };
    const assetsMetric = mapToFinancialMetricBasic(assets.sum, balances.years);
    const liabilitiesMetric = mapToFinancialMetricBasic(liabilities.sum, balances.years);

    const latestAssets = assetsMetric.value;
    const latestLiabilities = liabilitiesMetric.value;
    const equity = latestAssets - latestLiabilities;

    const profitMargin = revenueMetric.value > 0 ? (netProfitMetric.value / revenueMetric.value) * 100 : 0;
    const debtRatio = latestAssets > 0 ? (latestLiabilities / latestAssets) * 100 : 0;

    let reliabilityScore = 100;
    if (netProfitMetric.value < 0) reliabilityScore -= 20;
    if (debtRatio > 70) reliabilityScore -= 15;
    if (debtRatio > 50) reliabilityScore -= 10;
    if (profitMargin < 5) reliabilityScore -= 10;
    reliabilityScore = Math.max(0, Math.min(100, reliabilityScore));

    return {
      revenue: revenueMetric,
      netProfit: netProfitMetric,
      totalAssets: assetsMetric,
      totalLiabilities: liabilitiesMetric,
      equity: {
        value: equity,
        year: assetsMetric.year,
        yoyPercentage: '—'
      },
      reliabilityScore,
      profitMargin,
      debtRatio
    };
  } catch (error) {
    console.error('Error mapping basic financial metrics:', error);
    return null;
  }
}

function mapBalanceSheetRow(row: FinanceReportRow): BalanceSheetCategory {
  const subCategories: BalanceSheetCategory[] = [];

  if (row.indicators && row.indicators.length > 0) {
    row.indicators.forEach(ind => {
      subCategories.push(mapBalanceSheetRow(ind));
    });
  }

  return {
    name: row.name,
    code: row.code,
    values: row.sum,
    subCategories: subCategories.length > 0 ? subCategories : undefined
  };
}

export function mapToDetailedFinancialData(
  data: DataNewtonFinanceResponse
): DetailedFinancialData | null {
  try {
    const { fin_results, balances } = data;

    if (!fin_results || !balances) return null;

    const years = [...(fin_results.years || [])].sort((a, b) => b - a);
    if (years.length === 0) return null;

    const yearlyData: YearlyFinancialData[] = years.map(year => {
      const yearStr = year.toString();

      const revenue = getIndicatorByCode(fin_results.indicators, '2110');
      const netProfit = getIndicatorByCode(fin_results.indicators, '2400');
      const grossProfit = getIndicatorByCode(fin_results.indicators, '2100');
      const costOfSales = getIndicatorByCode(fin_results.indicators, '2120');
      const managementExpenses = getIndicatorByCode(fin_results.indicators, '2220');

      return {
        year,
        revenue: revenue?.sum[yearStr] || 0,
        netProfit: netProfit?.sum[yearStr] || 0,
        grossProfit: grossProfit?.sum[yearStr] || 0,
        operatingExpenses: managementExpenses?.sum[yearStr] || 0,
        assets: balances.assets.sum[yearStr] || 0,
        liabilities: balances.liabilities.sum[yearStr] || 0,
        equity: (balances.assets.sum[yearStr] || 0) - (balances.liabilities.sum[yearStr] || 0),
        costOfSales: costOfSales?.sum[yearStr] || 0,
        managementExpenses: managementExpenses?.sum[yearStr] || 0
      };
    });

    const indicators: FinancialIndicator[] = fin_results.indicators.map(ind => ({
      name: ind.name,
      code: ind.code,
      values: ind.sum
    }));

    const latestData = yearlyData[0];
    const ratios: FinancialRatios = {
      currentRatio: 0,
      quickRatio: 0,
      debtToEquity: latestData.equity > 0 ? latestData.liabilities / latestData.equity : 0,
      debtToAssets: latestData.assets > 0 ? latestData.liabilities / latestData.assets : 0,
      returnOnAssets: latestData.assets > 0 ? (latestData.netProfit / latestData.assets) * 100 : 0,
      returnOnEquity: latestData.equity > 0 ? (latestData.netProfit / latestData.equity) * 100 : 0,
      grossMargin: latestData.revenue > 0 ? (latestData.grossProfit / latestData.revenue) * 100 : 0,
      netMargin: latestData.revenue > 0 ? (latestData.netProfit / latestData.revenue) * 100 : 0,
      assetTurnover: latestData.assets > 0 ? latestData.revenue / latestData.assets : 0
    };

    const assetsSection: BalanceSheetSection = {
      name: balances.assets.name,
      total: balances.assets.sum,
      categories: (balances.assets.indicators || []).map(ind => mapBalanceSheetRow(ind))
    };

    const liabilitiesSection: BalanceSheetSection = {
      name: balances.liabilities.name,
      total: balances.liabilities.sum,
      categories: (balances.liabilities.indicators || []).map(ind => mapBalanceSheetRow(ind))
    };

    return {
      years,
      yearlyData,
      indicators,
      ratios,
      balanceSheet: {
        assets: assetsSection,
        liabilities: liabilitiesSection
      }
    };
  } catch (error) {
    console.error('Error mapping detailed financial data:', error);
    return null;
  }
}
