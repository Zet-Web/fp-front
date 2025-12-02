// DataNewton API service for fetching corporate actions data from Fedresurs

import { CorporateActionsData } from '../types/corporate-actions';

const API_BASE_URL = 'https://api.datanewton.ru/v1/corporateActions';
const API_KEY = import.meta.env.VITE_DATANEWTON_API_KEY || '4myoXJbKx0eC';

export async function fetchCorporateActions(
  inn: string,
  ogrn: string,
  limit: number = 10
): Promise<CorporateActionsData> {
  try {
    const params = new URLSearchParams({
      key: API_KEY,
      ogrn: ogrn,
      offset: '0',
      limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`);

    if (response.status === 409) {
      throw new Error('Компания не найдена в базе данных');
    }

    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
    }

    const data: CorporateActionsData = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Некорректный формат данных от API');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Не удалось загрузить данные о корпоративных действиях');
  }
}
