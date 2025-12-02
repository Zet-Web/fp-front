// Comprehensive Requisites tab showing all company registration and classification details

import { Building2, FileText, Hash, Calendar, ArrowUpDown, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Company } from '../types/company';
import { formatDate } from '../lib/company-utils';

interface RequisitesTabDetailedProps {
  company: Company;
}

export function RequisitesTabDetailed({ company }: RequisitesTabDetailedProps) {
  const { basicInfo } = company;

  return (
    <div className="space-y-4">
      {/* Main Registration Data */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            Основные реквизиты
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Полное наименование</div>
              <div className="font-medium">{basicInfo.name}</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Организационно-правовая форма</div>
              <div className="font-medium">{basicInfo.opf || 'Не указано'}</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">ИНН</div>
              <div className="font-mono font-medium">{basicInfo.inn}</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">КПП</div>
              <div className="font-mono font-medium">{basicInfo.kpp || 'Не указано'}</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">ОГРН</div>
              <div className="font-mono font-medium">{basicInfo.ogrn}</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Дата регистрации</div>
              <div className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {formatDate(basicInfo.registrationDate)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Уставной капитал</div>
              <div className="font-medium">{basicInfo.capital.toLocaleString('ru-RU')} ₽</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Статус</div>
              <Badge variant={basicInfo.status === 'active' ? 'default' : 'destructive'}>
                {basicInfo.status === 'active' ? 'Действующее' : 'Неактивное'}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Юридический адрес
            </div>
            <div className="font-medium">{basicInfo.address}</div>
          </div>
        </CardContent>
      </Card>

      {/* Rosstat Codes */}
      {basicInfo.rosstatCodes && (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-blue-500" />
              Коды Росстата
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {basicInfo.rosstatCodes.okpo && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">ОКПО</div>
                  <div className="font-mono font-medium">{basicInfo.rosstatCodes.okpo}</div>
                </div>
              )}

              {basicInfo.rosstatCodes.okato && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">ОКАТО</div>
                  <div className="font-mono font-medium">{basicInfo.rosstatCodes.okato}</div>
                </div>
              )}

              {basicInfo.rosstatCodes.oktmo && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">ОКТМО</div>
                  <div className="font-mono font-medium">{basicInfo.rosstatCodes.oktmo}</div>
                </div>
              )}

              {basicInfo.rosstatCodes.okfs && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">ОКФС</div>
                  <div className="font-mono font-medium">{basicInfo.rosstatCodes.okfs}</div>
                </div>
              )}

              {basicInfo.rosstatCodes.okogu && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">ОКОГУ</div>
                  <div className="font-mono font-medium">{basicInfo.rosstatCodes.okogu}</div>
                </div>
              )}

              {basicInfo.rosstatCodes.okopf && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">ОКОПФ</div>
                  <div className="font-mono font-medium">{basicInfo.rosstatCodes.okopf}</div>
                </div>
              )}
            </div>

            {!Object.values(basicInfo.rosstatCodes).some(code => code) && (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">Коды Росстата недоступны</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Full OKVED List */}
      {basicInfo.okved && basicInfo.okved.length > 0 && (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Виды деятельности (ОКВЭД)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {basicInfo.okved.map((okved, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                      {okved.code}
                    </Badge>
                    {okved.is_primary && (
                      <Badge variant="outline" className="text-xs">
                        Основной вид деятельности
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed">{okved.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tax Regime History */}
      {basicInfo.taxRegime && basicInfo.taxRegime.length > 0 && (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              История налоговых режимов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {basicInfo.taxRegime.map((regime, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={!regime.date_to ? 'default' : 'secondary'} className={!regime.date_to ? 'bg-green-500 hover:bg-green-600' : ''}>
                        {regime.type}
                      </Badge>
                      {!regime.date_to && (
                        <Badge variant="outline" className="text-xs">
                          Действующий
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {regime.date_from && formatDate(regime.date_from)}
                      {regime.date_to && ` — ${formatDate(regime.date_to)}`}
                    </div>
                  </div>
                  <p className="text-sm">{regime.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Predecessors and Successors */}
      {((basicInfo.predecessors && basicInfo.predecessors.length > 0) || (basicInfo.successors && basicInfo.successors.length > 0)) && (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5 text-blue-500" />
              Правопреемство
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {basicInfo.predecessors && basicInfo.predecessors.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Правопредшественники</div>
                <div className="space-y-2">
                  {basicInfo.predecessors.map((pred, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <div className="font-medium">{pred.name}</div>
                      <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                        {pred.inn && <span>ИНН: {pred.inn}</span>}
                        {pred.ogrn && <span>ОГРН: {pred.ogrn}</span>}
                        {pred.date && <span>Дата: {formatDate(pred.date)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {basicInfo.successors && basicInfo.successors.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Правопреемники</div>
                <div className="space-y-2">
                  {basicInfo.successors.map((succ, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <div className="font-medium">{succ.name}</div>
                      <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                        {succ.inn && <span>ИНН: {succ.inn}</span>}
                        {succ.ogrn && <span>ОГРН: {succ.ogrn}</span>}
                        {succ.date && <span>Дата: {formatDate(succ.date)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
