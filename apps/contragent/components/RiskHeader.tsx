// Risk assessment header component displaying overall company risk level

import { AlertTriangle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getRiskColor, getRiskLabel, getRiskScoreColor } from '../lib/company-utils';
import { CompanyRiskAssessment } from '../types/company';

interface RiskHeaderProps {
  risk: CompanyRiskAssessment;
  companyName: string;
}

export function RiskHeader({ risk, companyName }: RiskHeaderProps) {
  const getRiskIcon = () => {
    switch (risk.level) {
      case 'low':
        return <CheckCircle className="h-8 w-8" />;
      case 'medium':
        return <AlertCircle className="h-8 w-8" />;
      case 'high':
        return <AlertTriangle className="h-8 w-8" />;
      case 'critical':
        return <XCircle className="h-8 w-8" />;
      default:
        return <AlertCircle className="h-8 w-8" />;
    }
  };

  return (
    <Card className={`p-6 shadow-md ${getRiskColor(risk.level)} border-2`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {getRiskIcon()}
            <div>
              <h2 className="text-xl font-semibold">{companyName}</h2>
              <Badge variant="secondary" className="mt-1">
                {getRiskLabel(risk.level)}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{risk.score}</div>
            <div className="text-sm opacity-75">из 100</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Оценка надежности</span>
            <span className="font-medium">{risk.score}%</span>
          </div>
          <div className="h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full ${getRiskScoreColor(risk.score)} transition-all duration-500`}
              style={{ width: `${risk.score}%` }}
            />
          </div>
        </div>

        {risk.factors.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Факторы риска:</h3>
            <ul className="space-y-1">
              {risk.factors.map((factor, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-current opacity-75">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
