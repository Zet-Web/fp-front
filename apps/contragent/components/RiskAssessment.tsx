// Risk assessment section with recommendations

import { ShieldAlert, CheckCircle2, Download, FileText, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CompanyRiskAssessment } from '../types/company';

interface RiskAssessmentProps {
  risk: CompanyRiskAssessment;
}

export function RiskAssessment({ risk }: RiskAssessmentProps) {
  const handleDownloadReport = () => {
    alert('Демо-режим: функция скачивания отчета недоступна');
  };

  const handleDetailedAnalysis = () => {
    alert('Демо-режим: функция детального анализа недоступна');
  };

  const handleCreateContract = () => {
    alert('Демо-режим: функция создания договора недоступна');
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-blue-500" />
            Рекомендации по работе
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {risk.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{recommendation}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={handleDownloadReport}
              variant="outline"
              className="w-full justify-start"
            >
              <Download className="h-4 w-4 mr-2" />
              Скачать отчет
            </Button>
            <Button
              onClick={handleDetailedAnalysis}
              variant="outline"
              className="w-full justify-start"
            >
              <FileText className="h-4 w-4 mr-2" />
              Детальный анализ
            </Button>
            <Button
              onClick={handleCreateContract}
              variant="outline"
              className="w-full justify-start"
            >
              <FileCheck className="h-4 w-4 mr-2" />
              Создать договор
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
