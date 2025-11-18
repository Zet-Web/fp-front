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
      name: 'ООО "ТехСтрой"',
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
  },
  '7743001840': {
    basicInfo: {
      name: 'ПАО "МТС"',
      inn: '7743001840',
      ogrn: '1027700149124',
      address: 'г. Москва, ул. Марксистская, д. 4',
      status: 'active',
      registrationDate: '1993-09-16',
      employees: 28500,
      capital: 13925000000
    },
    leadership: {
      ceo: 'Корня Вячеслав Константинович',
      founders: [
        { name: 'АФК "Система"', share: 50.9 },
        { name: 'Прочие акционеры', share: 49.1 }
      ],
      beneficiaries: [
        { name: 'АФК "Система"', share: 50.9 }
      ]
    },
    financials: {
      yearlyData: [
        { year: 2023, revenue: 548000000, profit: 68000000, assets: 824000000, liabilities: 456000000 },
        { year: 2022, revenue: 512000000, profit: 62000000, assets: 786000000, liabilities: 432000000 },
        { year: 2021, revenue: 488000000, profit: 58000000, assets: 752000000, liabilities: 410000000 }
      ],
      taxDebt: 0,
      creditRating: 'AA'
    },
    legal: {
      courtCases: {
        asPlaintiff: { total: 456, won: 389 },
        asDefendant: { total: 312, lost: 78 }
      },
      enforcementCases: 0,
      bankruptcyStatus: 'none',
      licenses: [
        { type: 'Лицензия на телематические услуги', number: '177782', validUntil: '2026-06-30' },
        { type: 'Лицензия на услуги связи', number: '177783', validUntil: '2026-06-30' }
      ]
    },
    riskAssessment: {
      level: 'low',
      score: 90,
      factors: [
        'Крупный оператор связи с устойчивой позицией на рынке',
        'Стабильная динамика финансовых показателей',
        'Диверсифицированный портфель услуг'
      ],
      recommendations: [
        'Надежный партнер с хорошей деловой репутацией',
        'Рекомендуется к сотрудничеству'
      ]
    }
  },
  '7707049388': {
    basicInfo: {
      name: 'ООО "Рога и Копыта Групп"',
      inn: '7707049388',
      ogrn: '1157746530912',
      address: 'г. Москва, Проспект Мира, д. 101',
      status: 'active',
      registrationDate: '2015-05-20',
      employees: 156,
      capital: 50000000
    },
    leadership: {
      ceo: 'Корейко Александр Иванович',
      founders: [
        { name: 'Корейко Александр Иванович', share: 70.0 },
        { name: 'Балаганов Паниковский и Ко', share: 30.0 }
      ],
      beneficiaries: [
        { name: 'Корейко Александр Иванович', share: 70.0 },
        { name: 'Балаганов Паниковский и Ко', share: 30.0 }
      ]
    },
    financials: {
      yearlyData: [
        { year: 2023, revenue: 285000000, profit: 28000000, assets: 198000000, liabilities: 124000000 },
        { year: 2022, revenue: 242000000, profit: 22000000, assets: 176000000, liabilities: 118000000 },
        { year: 2021, revenue: 198000000, profit: 18000000, assets: 154000000, liabilities: 98000000 }
      ],
      taxDebt: 0,
      creditRating: 'BBB'
    },
    legal: {
      courtCases: {
        asPlaintiff: { total: 67, won: 54 },
        asDefendant: { total: 43, lost: 12 }
      },
      enforcementCases: 0,
      bankruptcyStatus: 'none',
      licenses: [
        { type: 'Лицензия на оптовую торговлю', number: '77-45-009821', validUntil: '2027-08-15' }
      ]
    },
    riskAssessment: {
      level: 'medium',
      score: 72,
      factors: [
        'Положительная динамика роста',
        'Умеренный уровень долговой нагрузки',
        'Относительно короткая история деятельности'
      ],
      recommendations: [
        'Компания демонстрирует стабильный рост',
        'Рекомендуется сотрудничество с умеренным контролем',
        'Желательна предоплата для крупных сделок'
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
