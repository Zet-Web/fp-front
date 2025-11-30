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
  'WORKERS_COUNT_BLOCK'
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
