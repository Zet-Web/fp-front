// DataNewton API service for fetching company risk assessment data

import { RisksData } from '../types/risks';

const API_BASE_URL = 'https://api.datanewton.ru/v1/risks';
const API_KEY = import.meta.env.VITE_DATANEWTON_API_KEY || '4myoXJbKx0eC';

export async function fetchCompanyRisks(inn: string, ogrn: string): Promise<RisksData> {
  try {
    const params = new URLSearchParams({
      key: API_KEY,
      ogrn: ogrn,
    });

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`);

    if (response.status === 409) {
      throw new Error('Компания не найдена в базе данных');
    }

    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
    }

    const data: RisksData = await response.json();

    if (!data.flags || !Array.isArray(data.flags)) {
      throw new Error('Некорректный формат данных от API');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Не удалось загрузить данные о рисках');
  }
}
