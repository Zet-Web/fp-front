// Mapper functions for corporate actions data transformation

import { CorporateAction, CorporateActionsData } from '../types/corporate-actions';

export function getLatestActions(data: CorporateActionsData, count: number = 4): CorporateAction[] {
  return data.data
    .filter(action => !action.annuled && !action.locked)
    .sort((a, b) => new Date(b.datePublish).getTime() - new Date(a.datePublish).getTime())
    .slice(0, count);
}

export function groupActionsByType(actions: CorporateAction[]): Record<string, CorporateAction[]> {
  return actions.reduce((acc, action) => {
    const type = action.msgType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(action);
    return acc;
  }, {} as Record<string, CorporateAction[]>);
}

export function getActionCategoryCounts(data: CorporateActionsData): Record<string, number> {
  const activeActions = data.data.filter(action => !action.annuled && !action.locked);
  const grouped = groupActionsByType(activeActions);

  return Object.entries(grouped).reduce((acc, [type, actions]) => {
    acc[type] = actions.length;
    return acc;
  }, {} as Record<string, number>);
}
