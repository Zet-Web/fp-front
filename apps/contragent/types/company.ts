// Type definitions for company verification and due diligence data

export interface OkvedCode {
  code: string;
  name: string;
  is_primary?: boolean;
}

export interface TaxRegime {
  type: string;
  name: string;
  date_from?: string;
  date_to?: string;
}

export interface RosstatCodes {
  okpo?: string;
  okato?: string;
  oktmo?: string;
  okfs?: string;
  okogu?: string;
  okopf?: string;
}

export interface CompanyPredecessorSuccessor {
  name: string;
  inn?: string;
  ogrn?: string;
  date?: string;
}

export interface CompanyBasicInfo {
  name: string;
  inn: string;
  ogrn: string;
  kpp?: string;
  address: string;
  status: 'active' | 'liquidating' | 'liquidated' | 'reorganizing';
  registrationDate: string;
  employees: number;
  capital: number;
  okved?: OkvedCode[];
  taxRegime?: TaxRegime[];
  rosstatCodes?: RosstatCodes;
  opf?: string;
  predecessors?: CompanyPredecessorSuccessor[];
  successors?: CompanyPredecessorSuccessor[];
}

export interface CompanyLeadership {
  ceo: string;
  founders: Array<{
    name: string;
    share: number;
    inn?: string;
  }>;
  beneficiaries: Array<{
    name: string;
    share: number;
    inn?: string;
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
