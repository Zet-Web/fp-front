// DataNewton API service for fetching company information by INN or OGRN

const API_BASE_URL = 'https://api.datanewton.ru/v1/counterparty';
const API_KEY = import.meta.env.VITE_DATANEWTON_API_KEY || '4myoXJbKx0eC';

const DEFAULT_FILTERS = [
  'OWNER_BLOCK',
  'ADDRESS_BLOCK',
  'MANAGER_BLOCK',
  'OKVED_BLOCK',
  'CONTACT_BLOCK',
  'NEGATIVE_LISTS_BLOCK',
  'WORKERS_COUNT_BLOCK',
  'ROSSTAT_BLOCK'
].join(',');

export interface DataNewtonResponse {
  inn: string;
  ogrn: string;
  individual?: {
    fio: string;
    registration_date: string;
    years_from_registration: number;
    status: {
      status_eng_short: string;
      status_rus_short: string;
      active_status: boolean;
    };
    dissolved_date?: string;
  };
  company?: {
    kpp: string;
    opf: string;
    company_names: {
      short_name: string;
      full_name: string;
    };
    address: {
      line_address: string;
    };
    registration_date: string;
    years_from_registration: number;
    managers?: Array<{
      fio: string;
      position: string;
    }>;
    status: {
      status_eng_short: string;
      status_rus_short: string;
      active_status: boolean;
    };
    dissolved_date?: string;
    owners?: {
      fl?: Array<{
        name: string;
        share: string;
        inn?: string;
      }>;
    };
    charter_capital?: string;
    workers_count?: Record<string, number>;
    contacts?: {
      emails?: Array<{ value: string }>;
      phones?: Array<{ value: string }>;
      websites?: Array<{ value: string }>;
    };
    negative_lists?: {
      disqualified_persons?: boolean;
      unreliable_information?: boolean;
      mass_address?: boolean;
      mass_manager?: boolean;
      mass_founder?: boolean;
      illegal_rewards?: boolean;
      in_sanctions_list?: boolean;
    };
    okveds?: Array<{
      main?: boolean;
      code: string;
      value: string;
      mode?: string;
    }>;
    tax_mode_info?: {
      publication_date?: string;
      eshn_sign?: boolean;
      usn_sign?: boolean;
      envd_sign?: boolean;
      srp_sign?: boolean;
      ausn_sign?: boolean;
      psn_sign?: boolean;
      npd_sign?: boolean;
      common_mode?: boolean;
    };
    ros_stat_codes?: {
      okpo?: string;
      okato?: string;
      oktmo?: string;
      okfs?: string;
      okogu?: string;
      okopf?: string;
    };
    predecessors?: Array<{
      inn?: string;
      ogrn?: string;
      full_name?: string;
      limited?: boolean;
    }>;
    successors?: Array<{
      inn?: string;
      ogrn?: string;
      full_name?: string;
      fixed_date?: string;
      limited?: boolean;
    }>;
  };
  contacts?: {
    emails?: Array<{ value: string }>;
    phones?: Array<{ value: string }>;
    websites?: Array<{ value: string }>;
  };
  negative_lists?: {
    disqualified_persons?: boolean;
    unreliable_information?: boolean;
    mass_address?: boolean;
    mass_manager?: boolean;
    mass_founder?: boolean;
  };
  available_count?: number;
}

export async function fetchCompanyByInn(inn: string): Promise<DataNewtonResponse> {
  const url = new URL(API_BASE_URL);
  url.searchParams.append('key', API_KEY);
  url.searchParams.append('inn', inn);
  url.searchParams.append('filters', DEFAULT_FILTERS);

  const response = await fetch(url.toString());

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error('Компания не найдена в базе данных');
    }
    throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function fetchCompanyByOgrn(ogrn: string): Promise<DataNewtonResponse> {
  const url = new URL(API_BASE_URL);
  url.searchParams.append('key', API_KEY);
  url.searchParams.append('ogrn', ogrn);
  url.searchParams.append('filters', DEFAULT_FILTERS);

  const response = await fetch(url.toString());

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error('Компания не найдена в базе данных');
    }
    throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function fetchCompanyInfo(identifier: string): Promise<DataNewtonResponse> {
  const innPattern = /^\d{10}$|^\d{12}$/;
  const ogrnPattern = /^\d{13}$|^\d{15}$/;

  if (innPattern.test(identifier)) {
    return fetchCompanyByInn(identifier);
  } else if (ogrnPattern.test(identifier)) {
    return fetchCompanyByOgrn(identifier);
  } else {
    throw new Error('Неверный формат ИНН или ОГРН');
  }
}

export interface FinanceReportRow {
  name: string;
  code: string;
  sum: Record<string, number>;
  indicators?: FinanceReportRow[];
  childrenMap?: Record<string, FinanceReportRow>;
  row_num?: number;
}

export interface FinanceBalances {
  okud: string;
  years: number[];
  assets: FinanceReportRow;
  liabilities: FinanceReportRow;
  indicators?: FinanceReportRow[];
}

export interface FinanceResults {
  okud: string;
  years: number[];
  indicators: FinanceReportRow[];
}

export interface MoneyFlow {
  okud: string | null;
  years?: number[];
  indicators?: FinanceReportRow[];
}

export interface DataNewtonFinanceResponse {
  balances: FinanceBalances;
  fin_results: FinanceResults;
  money_flow: MoneyFlow;
  available_count: number;
}

export async function fetchCompanyFinance(inn?: string, ogrn?: string): Promise<DataNewtonFinanceResponse> {
  if (!inn && !ogrn) {
    throw new Error('Требуется ИНН или ОГРН');
  }

  const url = new URL('https://api.datanewton.ru/v1/finance');
  url.searchParams.append('key', API_KEY);

  if (inn) {
    url.searchParams.append('inn', inn);
  } else if (ogrn) {
    url.searchParams.append('ogrn', ogrn);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error('Финансовые отчеты не найдены');
    }
    throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
