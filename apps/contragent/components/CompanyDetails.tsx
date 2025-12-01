// Component displaying detailed company information sections

import { Building2, Users, Calendar, MapPin, Mail, Phone, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Company } from '../types/company';
import { formatCurrency, formatNumber, formatDate, getStatusColor, getStatusLabel, getCreditRatingColor, calculateSuccessRate } from '../lib/company-utils';
import { DataNewtonResponse } from '../lib/datanewton-api';

interface CompanyDetailsProps {
  company: Company;
  apiResponse?: DataNewtonResponse;
}

export function CompanyDetails({ company, apiResponse }: CompanyDetailsProps) {
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

          {leadership.founders.length > 0 && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">Учредители:</div>
              <div className="space-y-2">
                {leadership.founders.map((founder, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{founder.name}</div>
                        {founder.inn && (
                          <div className="text-xs text-muted-foreground">ИНН {founder.inn}</div>
                        )}
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {founder.share.toFixed(founder.share < 0.01 ? 3 : 2)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {leadership.beneficiaries.length > 0 && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">Бенефициары:</div>
              <div className="space-y-2">
                {leadership.beneficiaries.map((beneficiary, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{beneficiary.name}</div>
                        {beneficiary.inn && (
                          <div className="text-xs text-muted-foreground">ИНН {beneficiary.inn}</div>
                        )}
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {beneficiary.share.toFixed(beneficiary.share < 0.01 ? 3 : 2)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {apiResponse?.company?.contacts && (
            <div className="pt-2 border-t">
              <div className="text-sm text-muted-foreground mb-2">Контакты:</div>
              <div className="space-y-1.5">
                {apiResponse.company.contacts.emails && apiResponse.company.contacts.emails.length > 0 && (
                  <div className="flex items-start gap-2 text-xs">
                    <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      {apiResponse.company.contacts.emails.slice(0, 2).map((email, i) => (
                        <a
                          key={i}
                          href={`mailto:${email.value}`}
                          className="text-blue-500 hover:underline block"
                        >
                          {email.value}
                        </a>
                      ))}
                      {apiResponse.company.contacts.emails.length > 2 && (
                        <span className="text-muted-foreground">+ ещё {apiResponse.company.contacts.emails.length - 2}</span>
                      )}
                    </div>
                  </div>
                )}
                {apiResponse.company.contacts.phones && apiResponse.company.contacts.phones.length > 0 && (
                  <div className="flex items-start gap-2 text-xs">
                    <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      {apiResponse.company.contacts.phones.slice(0, 2).map((phone, i) => (
                        <a
                          key={i}
                          href={`tel:${phone.value}`}
                          className="text-blue-500 hover:underline block"
                        >
                          {phone.value}
                        </a>
                      ))}
                      {apiResponse.company.contacts.phones.length > 2 && (
                        <span className="text-muted-foreground">+ ещё {apiResponse.company.contacts.phones.length - 2}</span>
                      )}
                    </div>
                  </div>
                )}
                {apiResponse.company.contacts.websites && apiResponse.company.contacts.websites.length > 0 && (
                  <div className="flex items-start gap-2 text-xs">
                    <Globe className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      {apiResponse.company.contacts.websites.slice(0, 2).map((website, i) => (
                        <a
                          key={i}
                          href={website.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline block"
                        >
                          {website.value.replace(/^https?:\/\//, '')}
                        </a>
                      ))}
                      {apiResponse.company.contacts.websites.length > 2 && (
                        <span className="text-muted-foreground">+ ещё {apiResponse.company.contacts.websites.length - 2}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
