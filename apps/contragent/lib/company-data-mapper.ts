// Mapper functions to convert DataNewton API response formats to app types

import { OkvedCode, TaxRegime, RosstatCodes, CompanyPredecessorSuccessor } from '../types/company';
import { DataNewtonResponse } from './datanewton-api';

export function mapOkvedCodes(okveds?: Array<{ main?: boolean; code: string; value: string; mode?: string }>): OkvedCode[] | undefined {
  if (!okveds || okveds.length === 0) return undefined;

  return okveds.map(okved => ({
    code: okved.code,
    name: okved.value,
    is_primary: okved.main
  }));
}

export function mapTaxRegime(taxModeInfo?: {
  publication_date?: string;
  eshn_sign?: boolean;
  usn_sign?: boolean;
  envd_sign?: boolean;
  srp_sign?: boolean;
  ausn_sign?: boolean;
  psn_sign?: boolean;
  npd_sign?: boolean;
  common_mode?: boolean;
}): TaxRegime[] | undefined {
  if (!taxModeInfo) return undefined;

  const regimes: TaxRegime[] = [];

  if (taxModeInfo.usn_sign) {
    regimes.push({
      type: 'УСН',
      name: 'Упрощённая система налогообложения',
      date_from: taxModeInfo.publication_date
    });
  }

  if (taxModeInfo.eshn_sign) {
    regimes.push({
      type: 'ЕСХН',
      name: 'Единый сельскохозяйственный налог',
      date_from: taxModeInfo.publication_date
    });
  }

  if (taxModeInfo.envd_sign) {
    regimes.push({
      type: 'ЕНВД',
      name: 'Единый налог на вменённый доход',
      date_from: taxModeInfo.publication_date
    });
  }

  if (taxModeInfo.psn_sign) {
    regimes.push({
      type: 'ПСН',
      name: 'Патентная система налогообложения',
      date_from: taxModeInfo.publication_date
    });
  }

  if (taxModeInfo.ausn_sign) {
    regimes.push({
      type: 'АУСН',
      name: 'Автоматизированная упрощённая система налогообложения',
      date_from: taxModeInfo.publication_date
    });
  }

  if (taxModeInfo.npd_sign) {
    regimes.push({
      type: 'НПД',
      name: 'Налог на профессиональный доход',
      date_from: taxModeInfo.publication_date
    });
  }

  if (taxModeInfo.common_mode) {
    regimes.push({
      type: 'ОСНО',
      name: 'Общая система налогообложения',
      date_from: taxModeInfo.publication_date
    });
  }

  return regimes.length > 0 ? regimes : undefined;
}

export function mapRosstatCodes(rosStatCodes?: {
  okpo?: string;
  okato?: string;
  oktmo?: string;
  okfs?: string;
  okogu?: string;
  okopf?: string;
}): RosstatCodes | undefined {
  if (!rosStatCodes) return undefined;

  return {
    okpo: rosStatCodes.okpo,
    okato: rosStatCodes.okato,
    oktmo: rosStatCodes.oktmo,
    okfs: rosStatCodes.okfs,
    okogu: rosStatCodes.okogu,
    okopf: rosStatCodes.okopf
  };
}

export function mapPredecessors(predecessors?: Array<{
  inn?: string;
  ogrn?: string;
  full_name?: string;
  limited?: boolean;
}>): CompanyPredecessorSuccessor[] | undefined {
  if (!predecessors || predecessors.length === 0) return undefined;

  return predecessors.map(pred => ({
    name: pred.full_name || 'Не указано',
    inn: pred.inn,
    ogrn: pred.ogrn
  }));
}

export function mapSuccessors(successors?: Array<{
  inn?: string;
  ogrn?: string;
  full_name?: string;
  fixed_date?: string;
  limited?: boolean;
}>): CompanyPredecessorSuccessor[] | undefined {
  if (!successors || successors.length === 0) return undefined;

  return successors.map(succ => ({
    name: succ.full_name || 'Не указано',
    inn: succ.inn,
    ogrn: succ.ogrn,
    date: succ.fixed_date
  }));
}
