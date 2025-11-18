// Type definitions for company verification and due diligence data

export interface CompanyBasicInfo {
  name: string;
  inn: string;
  ogrn: string;
  address: string;
  status: 'active' | 'liquidating' | 'liquidated' | 'reorganizing';
  registrationDate: string;
  employees: number;
  capital: number;
}

export interface CompanyLeadership {
  ceo: string;
  founders: Array<{
    name: string;
    share: number;
  }>;
  beneficiaries: Array<{
    name: string;
    share: number;
  }>;
}

export interface CompanyFinancials {
  yearlyData: Array<{
    year: number;
    revenue: number;
    profit: number;
    assets: number;
    liabilities: number;
  }>;
  taxDebt: number;
  creditRating: string;
}

export interface CompanyLegal {
  courtCases: {
    asPlaintiff: {
      total: number;
      won: number;
    };
    asDefendant: {
      total: number;
      lost: number;
    };
  };
  enforcementCases: number;
  bankruptcyStatus: 'none' | 'pending' | 'completed';
  licenses: Array<{
    type: string;
    number: string;
    validUntil: string;
  }>;
}

export interface CompanyRiskAssessment {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  factors: string[];
  recommendations: string[];
}

export interface Company {
  basicInfo: CompanyBasicInfo;
  leadership: CompanyLeadership;
  financials: CompanyFinancials;
  legal: CompanyLegal;
  riskAssessment: CompanyRiskAssessment;
}

export interface SearchHistoryItem {
  inn: string;
  name: string;
  timestamp: string;
}
