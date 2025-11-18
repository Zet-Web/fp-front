// Utility functions for company data formatting and calculations

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ru-RU').format(num);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

export const calculateSuccessRate = (won: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((won / total) * 100);
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'text-green-600 dark:text-green-400';
    case 'liquidating':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'liquidated':
      return 'text-red-600 dark:text-red-400';
    case 'reorganizing':
      return 'text-blue-600 dark:text-blue-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'active':
      return 'Действующая';
    case 'liquidating':
      return 'В процессе ликвидации';
    case 'liquidated':
      return 'Ликвидирована';
    case 'reorganizing':
      return 'В процессе реорганизации';
    default:
      return status;
  }
};

export const getRiskColor = (level: string): string => {
  switch (level) {
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'high':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    case 'critical':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  }
};

export const getRiskLabel = (level: string): string => {
  switch (level) {
    case 'low':
      return 'Низкий риск';
    case 'medium':
      return 'Средний риск';
    case 'high':
      return 'Высокий риск';
    case 'critical':
      return 'Критический риск';
    default:
      return level;
  }
};

export const getCreditRatingColor = (rating: string): string => {
  if (['AAA', 'AA', 'A'].includes(rating)) {
    return 'text-green-600 dark:text-green-400';
  } else if (['BBB', 'BB'].includes(rating)) {
    return 'text-yellow-600 dark:text-yellow-400';
  } else if (['B', 'CCC'].includes(rating)) {
    return 'text-orange-600 dark:text-orange-400';
  } else {
    return 'text-red-600 dark:text-red-400';
  }
};

export const getRiskScoreColor = (score: number): string => {
  if (score >= 80) {
    return 'bg-green-500';
  } else if (score >= 60) {
    return 'bg-yellow-500';
  } else if (score >= 40) {
    return 'bg-orange-500';
  } else {
    return 'bg-red-500';
  }
};
