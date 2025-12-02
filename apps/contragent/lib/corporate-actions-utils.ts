// Utility functions for corporate actions display and formatting

import { FileText, AlertCircle, Building2, Users, TrendingUp, TrendingDown, Info, type LucideIcon } from 'lucide-react';
import {
  CorporateActionType,
  CORPORATE_ACTION_TYPE_LABELS,
  CORPORATE_ACTION_CATEGORY_COLORS
} from '../types/corporate-actions';

export function getActionTypeLabel(type: CorporateActionType): string {
  return CORPORATE_ACTION_TYPE_LABELS[type] || type;
}

export function getActionColorClass(type: CorporateActionType): string {
  return CORPORATE_ACTION_CATEGORY_COLORS[type] || CORPORATE_ACTION_CATEGORY_COLORS.AnyOther;
}

export function getActionIcon(type: CorporateActionType): LucideIcon {
  const criticalActions = ['FirmLiquidation', 'FirmRegisterExclude', 'StopOfBusiness'];
  const warningActions = ['FirmReorganization', 'UnreliableInformation', 'FirmAuthorizedCapitalDecrease'];
  const positiveActions = ['FirmCreated', 'FirmAuthorizedCapitalIncrease'];
  const managementActions = ['FirmAuthoritiesChange', 'FirmMembersMeeting'];

  if (criticalActions.includes(type)) {
    return AlertCircle;
  } else if (warningActions.includes(type)) {
    return TrendingDown;
  } else if (positiveActions.includes(type)) {
    return TrendingUp;
  } else if (managementActions.includes(type)) {
    return Users;
  } else if (type.includes('Capital') || type.includes('Shares')) {
    return TrendingUp;
  } else {
    return FileText;
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function formatPublisherName(publisher: { type: string; data: { fullName?: string; fio?: string; name?: string } }): string {
  return publisher.data.fullName || publisher.data.fio || publisher.data.name || 'Неизвестно';
}
