// Mock company data for demonstration purposes

import { Company } from '../types/company';

export const mockCompanies: Record<string, Company> = {
  '7707083893': {
    basicInfo: {
      name: 'ПАО "Сбербанк России"',
      inn: '7707083893',
      ogrn: '1027700132195',
      address: 'г. Москва, ул. Вавилова, д. 19',
      status: 'active',
      registrationDate: '1991-06-20',
      employees: 234000,
      capital: 67760844000
    },
    leadership: {
      ceo: 'Греф Герман Оскарович',
      founders: [
        { name: 'Центральный банк РФ', share: 50.0 },
        { name: 'Прочие акционеры', share: 50.0 }
      ],
      beneficiaries: [
        { name: 'Центральный банк РФ', share: 50.0 }
      ]
    },
    financials: {
      yearlyData: [
        { year: 2023, revenue: 4827000000, profit: 1330000000, assets: 41610000000, liabilities: 38350000000 },
        { year: 2022, revenue: 4420000000, profit: 310000000, assets: 38990000000, liabilities: 36140000000 },
        { year: 2021, revenue: 3820000000, profit: 1260000000, assets: 35640000000, liabilities: 32980000000 }
      ],
      taxDebt: 0,
      creditRating: 'AAA'
    },
    legal: {
      courtCases: {
        asPlaintiff: { total: 1847, won: 1623 },
        asDefendant: { total: 892, lost: 234 }
      },
      enforcementCases: 0,
      bankruptcyStatus: 'none',
      licenses: [
        { type: 'Банковская лицензия', number: '1481', validUntil: '2025-12-31' },
        { type: 'Лицензия профучастника', number: '045-02894-100000', validUntil: '2025-12-31' }
      ]
    },
    riskAssessment: {
      level: 'low',
      score: 92,
      factors: [
        'Стабильное финансовое положение',
        'Положительная кредитная история',
        'Отсутствие задолженностей'
      ],
      recommendations: [
        'Компания является надежным партнером',
        'Рекомендуется к сотрудничеству без ограничений'
      ]
    }
  },
  '7728168971': {
    basicInfo: {
      name: 'ООО "Яндекс"',
      inn: '7728168971',
      ogrn: '1027700229193',
      address: 'г. Москва, ул. Льва Толстого, д. 16',
      status: 'active',
      registrationDate: '2000-10-13',
      employees: 18000,
      capital: 130000000
    },
    leadership: {
      ceo: 'Кудрина Елена Леонидовна',
      founders: [
        { name: 'Yandex N.V.', share: 100.0 }
      ],
      beneficiaries: [
        { name: 'Аркадий Волож', share: 48.3 },
        { name: 'Институциональные инвесторы', share: 51.7 }
      ]
    },
    financials: {
      yearlyData: [
        { year: 2023, revenue: 672000000, profit: 42000000, assets: 580000000, liabilities: 320000000 },
        { year: 2022, revenue: 598000000, profit: 38000000, assets: 520000000, liabilities: 290000000 },
        { year: 2021, revenue: 482000000, profit: 56000000, assets: 440000000, liabilities: 245000000 }
      ],
      taxDebt: 0,
      creditRating: 'AA'
    },
    legal: {
      courtCases: {
        asPlaintiff: { total: 234, won: 198 },
        asDefendant: { total: 156, lost: 42 }
      },
      enforcementCases: 0,
      bankruptcyStatus: 'none',
      licenses: [
        { type: 'Лицензия на обработку персональных данных', number: '77-20-002345', validUntil: '2026-03-15' }
      ]
    },
    riskAssessment: {
      level: 'low',
      score: 88,
      factors: [
        'Устойчивый рост выручки',
        'Стабильная прибыль',
        'Хорошая репутация'
      ],
      recommendations: [
        'Надежный партнер в IT-сегменте',
        'Рекомендуется к долгосрочному сотрудничеству'
      ]
    }
  },
  '5007017140': {
    basicInfo: {
      name: 'ООО "Проблемная Компания"',
      inn: '5007017140',
      ogrn: '1125007001234',
      address: 'Московская обл., г. Химки, ул. Промышленная, д. 5',
      status: 'active',
      registrationDate: '2012-03-15',
      employees: 45,
      capital: 10000000
    },
    leadership: {
      ceo: 'Иванов Иван Иванович',
      founders: [
        { name: 'Иванов Иван Иванович', share: 60.0 },
        { name: 'Петров Петр Петрович', share: 40.0 }
      ],
      beneficiaries: [
        { name: 'Иванов Иван Иванович', share: 60.0 },
        { name: 'Петров Петр Петрович', share: 40.0 }
      ]
    },
    financials: {
      yearlyData: [
        { year: 2023, revenue: 85000000, profit: -12000000, assets: 45000000, liabilities: 58000000 },
        { year: 2022, revenue: 120000000, profit: -8000000, assets: 62000000, liabilities: 54000000 },
        { year: 2021, revenue: 156000000, profit: 5000000, assets: 78000000, liabilities: 48000000 }
      ],
      taxDebt: 2500000,
      creditRating: 'B'
    },
    legal: {
      courtCases: {
        asPlaintiff: { total: 45, won: 12 },
        asDefendant: { total: 89, lost: 67 }
      },
      enforcementCases: 18,
      bankruptcyStatus: 'none',
      licenses: []
    },
    riskAssessment: {
      level: 'high',
      score: 34,
      factors: [
        'Отрицательная рентабельность 2 года подряд',
        'Наличие налоговой задолженности',
        'Превышение обязательств над активами',
        'Многочисленные проигранные судебные дела',
        'Исполнительные производства'
      ],
      recommendations: [
        'Высокий риск неисполнения обязательств',
        'Рекомендуется предоплата или банковская гарантия',
        'Не рекомендуется долгосрочное сотрудничество',
        'Требуется дополнительная проверка финансовой устойчивости'
      ]
    }
  }
};

export const getCompanyByInn = (inn: string): Company | null => {
  return mockCompanies[inn] || null;
};

export const searchCompaniesByName = (query: string): Array<{ inn: string; name: string }> => {
  const results: Array<{ inn: string; name: string }> = [];

  Object.values(mockCompanies).forEach(company => {
    if (company.basicInfo.name.toLowerCase().includes(query.toLowerCase())) {
      results.push({
        inn: company.basicInfo.inn,
        name: company.basicInfo.name
      });
    }
  });

  return results;
};
