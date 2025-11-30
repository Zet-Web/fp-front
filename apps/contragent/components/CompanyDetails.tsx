// Component displaying detailed company information sections

import { Building2, Users, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Company } from '../types/company';
import { formatCurrency, formatNumber, formatDate, getStatusColor, getStatusLabel, getCreditRatingColor, calculateSuccessRate } from '../lib/company-utils';

interface CompanyDetailsProps {
  company: Company;
}

export function CompanyDetails({ company }: CompanyDetailsProps) {
  const { basicInfo, leadership, financials, legal } = company;
  const latestYear = financials.yearlyData[0] || { year: new Date().getFullYear(), revenue: 0, profit: 0, assets: 0 };
  const previousYear = financials.yearlyData[1] || { year: new Date().getFullYear() - 1, revenue: 0, profit: 0, assets: 0 };

  const calculateGrowth = (current: number, previous: number): string => {
    if (!previous) return '—';
    const growth = ((current - previous) / previous) * 100;
    return `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Basic Information */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            Основные сведения
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Статус:</div>
            <div className={`font-medium ${getStatusColor(basicInfo.status)}`}>
              {getStatusLabel(basicInfo.status)}
            </div>

            <div className="text-muted-foreground">ИНН:</div>
            <div className="font-medium">{basicInfo.inn}</div>

            <div className="text-muted-foreground">ОГРН:</div>
            <div className="font-medium">{basicInfo.ogrn}</div>

            <div className="text-muted-foreground">Регистрация:</div>
            <div className="font-medium">{formatDate(basicInfo.registrationDate)}</div>

            <div className="text-muted-foreground">Сотрудников:</div>
            <div className="font-medium">{formatNumber(basicInfo.employees)}</div>

            <div className="text-muted-foreground">Уставной капитал:</div>
            <div className="font-medium">{formatCurrency(basicInfo.capital)}</div>
          </div>

          <div className="pt-2 border-t">
            <div className="text-sm text-muted-foreground mb-1">Адрес:</div>
            <div className="text-sm flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <span>{basicInfo.address}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leadership */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Руководство
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Генеральный директор:</div>
            <div className="font-medium">{leadership.ceo}</div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1">Учредители:</div>
            <div className="space-y-1">
              {leadership.founders.map((founder, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{founder.name}</span>
                  <Badge variant="secondary">{founder.share}%</Badge>
                </div>
              ))}
            </div>
          </div>

          {leadership.beneficiaries.length > 0 && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">Бенефициары:</div>
              <div className="space-y-1">
                {leadership.beneficiaries.map((beneficiary, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{beneficiary.name}</span>
                    <Badge variant="secondary">{beneficiary.share}%</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Financial Indicators */}
      <Card className="shadow-sm hover:shadow-md transition-shadow md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Финансовые показатели
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Выручка {latestYear.year}</div>
              <div className="font-semibold">{formatCurrency(latestYear.revenue)}</div>
              <div className="text-xs text-muted-foreground">
                {calculateGrowth(latestYear.revenue, previousYear.revenue)}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Прибыль {latestYear.year}</div>
              <div className={`font-semibold ${latestYear.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(latestYear.profit)}
              </div>
              <div className="text-xs text-muted-foreground">
                {calculateGrowth(latestYear.profit, previousYear.profit)}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Активы</div>
              <div className="font-semibold">{formatCurrency(latestYear.assets)}</div>
              <div className="text-xs text-muted-foreground">
                {calculateGrowth(latestYear.assets, previousYear.assets)}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Обязательства</div>
              <div className="font-semibold">{formatCurrency(latestYear.liabilities)}</div>
              <div className="text-xs text-muted-foreground">
                {calculateGrowth(latestYear.liabilities, previousYear.liabilities)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Налоговая задолженность:</div>
              <div className={`font-semibold ${financials.taxDebt > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                {financials.taxDebt > 0 ? formatCurrency(financials.taxDebt) : 'Отсутствует'}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Кредитный рейтинг:</div>
              <div className={`font-semibold ${getCreditRatingColor(financials.creditRating)}`}>
                {financials.creditRating}
              </div>
            </div>
          </div>

          {(financials.taxDebt > 0 || legal.enforcementCases > 0) && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
              <div className="text-sm font-medium text-orange-800 dark:text-orange-400 mb-2">
                Обнаружены проблемы:
              </div>
              <ul className="space-y-1 text-sm text-orange-700 dark:text-orange-300">
                {financials.taxDebt > 0 && (
                  <li>• Имеется налоговая задолженность</li>
                )}
                {legal.enforcementCases > 0 && (
                  <li>• Есть исполнительные производства ({legal.enforcementCases})</li>
                )}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legal Information */}
      <Card className="shadow-sm hover:shadow-md transition-shadow md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-blue-500" />
            Судебная практика и лицензии
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Истец в судах:</div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Всего дел:</span>
                  <span className="font-medium">{legal.courtCases.asPlaintiff.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Выиграно:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {legal.courtCases.asPlaintiff.won}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Успешность:</span>
                  <Badge variant="secondary">
                    {calculateSuccessRate(legal.courtCases.asPlaintiff.won, legal.courtCases.asPlaintiff.total)}%
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-2">Ответчик в судах:</div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Всего дел:</span>
                  <span className="font-medium">{legal.courtCases.asDefendant.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Проиграно:</span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    {legal.courtCases.asDefendant.lost}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Успешность защиты:</span>
                  <Badge variant="secondary">
                    {calculateSuccessRate(
                      legal.courtCases.asDefendant.total - legal.courtCases.asDefendant.lost,
                      legal.courtCases.asDefendant.total
                    )}%
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {legal.licenses.length > 0 && (
            <div className="pt-2 border-t">
              <div className="text-sm text-muted-foreground mb-2">Лицензии:</div>
              <div className="space-y-2">
                {legal.licenses.map((license, index) => (
                  <div key={index} className="flex justify-between items-center text-sm bg-muted/50 p-2 rounded">
                    <div>
                      <div className="font-medium">{license.type}</div>
                      <div className="text-xs text-muted-foreground">№ {license.number}</div>
                    </div>
                    <Badge variant="outline">до {formatDate(license.validUntil)}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
