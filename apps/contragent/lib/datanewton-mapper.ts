// Mapper to transform DataNewton API response to app Company type

import { Company, CompanyBasicInfo, CompanyLeadership, CompanyFinancials, CompanyLegal, CompanyRiskAssessment } from '../types/company';
import { DataNewtonResponse } from './datanewton-api';

function mapStatus(statusShort: string): CompanyBasicInfo['status'] {
  switch (statusShort.toLowerCase()) {
    case 'active':
      return 'active';
    case 'liquidating':
      return 'liquidating';
    case 'liquidated':
      return 'liquidated';
    case 'reorganizing':
      return 'reorganizing';
    default:
      return 'active';
  }
}

function calculateRiskAssessment(data: DataNewtonResponse): CompanyRiskAssessment {
  const factors: string[] = [];
  let score = 100;

  const status = data.company?.status || data.individual?.status;
  if (!status?.active_status) {
    factors.push('Компания ликвидирована или в процессе ликвидации');
    score -= 40;
  }

  const negativeLists = data.company?.negative_lists || data.negative_lists;
  if (negativeLists) {
    if (negativeLists.disqualified_persons) {
      factors.push('Присутствуют дисквалифицированные лица');
      score -= 25;
    }
    if (negativeLists.unreliable_information) {
      factors.push('Недостоверные сведения в ЕГРЮЛ');
      score -= 20;
    }
    if (negativeLists.mass_address) {
      factors.push('Массовый адрес регистрации');
      score -= 15;
    }
    if (negativeLists.mass_manager) {
      factors.push('Массовый руководитель');
      score -= 15;
    }
    if (negativeLists.mass_founder) {
      factors.push('Массовый учредитель');
      score -= 10;
    }
  }

  const capital = parseFloat(data.company?.charter_capital || '0');
  if (capital < 10000) {
    factors.push('Низкий уставный капитал');
    score -= 5;
  }

  const yearsFromRegistration = data.company?.years_from_registration || data.individual?.years_from_registration || 0;
  if (yearsFromRegistration < 1) {
    factors.push('Компания зарегистрирована менее года назад');
    score -= 10;
  }

  score = Math.max(0, Math.min(100, score));

  let level: CompanyRiskAssessment['level'];
  if (score >= 80) level = 'low';
  else if (score >= 60) level = 'medium';
  else if (score >= 40) level = 'high';
  else level = 'critical';

  const recommendations: string[] = [];
  if (level === 'low') {
    recommendations.push('Компания не имеет критических рисков');
    recommendations.push('Рекомендуется стандартная проверка документов');
  } else if (level === 'medium') {
    recommendations.push('Требуется дополнительная проверка');
    recommendations.push('Запросите финансовую отчетность за последний год');
  } else if (level === 'high') {
    recommendations.push('Высокий риск сотрудничества');
    recommendations.push('Рекомендуется провести углубленную проверку');
    recommendations.push('Рассмотрите альтернативных контрагентов');
  } else {
    recommendations.push('Критический уровень риска');
    recommendations.push('Не рекомендуется заключение сделки');
    recommendations.push('Обратитесь к юристу перед принятием решения');
  }

  return {
    level,
    score,
    factors: factors.length > 0 ? factors : ['Не обнаружено критических факторов риска'],
    recommendations
  };
}

export function mapDataNewtonToCompany(data: DataNewtonResponse): Company {
  const isIndividual = !!data.individual;
  const companyData = data.company;
  const individualData = data.individual;

  const basicInfo: CompanyBasicInfo = {
    name: isIndividual
      ? individualData!.fio
      : (companyData?.company_names?.short_name || companyData?.company_names?.full_name || 'Неизвестно'),
    inn: data.inn,
    ogrn: data.ogrn,
    kpp: companyData?.kpp,
    address: companyData?.address?.line_address || 'Адрес не указан',
    status: mapStatus((companyData?.status || individualData?.status)?.status_eng_short || 'active'),
    registrationDate: companyData?.registration_date || individualData?.registration_date || '',
    employees: getLatestWorkersCount(companyData?.workers_count),
    capital: parseFloat(companyData?.charter_capital || '0'),
    okved: companyData?.okved,
    taxRegime: companyData?.tax_system,
    rosstatCodes: companyData?.rosstat,
    opf: companyData?.opf,
    predecessors: companyData?.predecessors,
    successors: companyData?.successors
  };

  const leadership: CompanyLeadership = {
    ceo: companyData?.managers?.[0]?.fio || 'Не указано',
    founders: (companyData?.owners?.fl || []).map(owner => ({
      name: owner.name,
      share: parseFloat(owner.share) || 0
    })),
    beneficiaries: (companyData?.owners?.fl || [])
      .filter(owner => parseFloat(owner.share) > 25)
      .map(owner => ({
        name: owner.name,
        share: parseFloat(owner.share) || 0
      }))
  };

  const financials: CompanyFinancials = {
    yearlyData: [
      { year: new Date().getFullYear() - 1, revenue: 0, profit: 0, assets: 0 },
      { year: new Date().getFullYear() - 2, revenue: 0, profit: 0, assets: 0 }
    ],
    taxDebt: 0,
    creditRating: 'N/A'
  };

  const legal: CompanyLegal = {
    courtCases: {
      asPlaintiff: { total: 0, won: 0 },
      asDefendant: { total: 0, lost: 0 }
    },
    enforcementCases: 0,
    bankruptcyStatus: 'none',
    licenses: []
  };

  const riskAssessment = calculateRiskAssessment(data);

  return {
    basicInfo,
    leadership,
    financials,
    legal,
    riskAssessment
  };
}

function getLatestWorkersCount(workersCount?: Record<string, number>): number {
  if (!workersCount || Object.keys(workersCount).length === 0) {
    return 0;
  }

  const years = Object.keys(workersCount).sort().reverse();
  return workersCount[years[0]] || 0;
}
