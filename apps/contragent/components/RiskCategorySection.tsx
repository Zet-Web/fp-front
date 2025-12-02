// Reusable component for displaying risks grouped by category

import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RiskFlag, RiskCategory, RISK_CATEGORY_LABELS } from '../types/risks';
import { getRiskColorClass, getRiskIcon, getCategoryIcon, formatRiskDetail } from '../lib/risk-utils';

interface RiskCategorySectionProps {
  category: RiskCategory;
  risks: RiskFlag[];
  defaultOpen?: boolean;
  onRiskClick?: (risk: RiskFlag) => void;
}

export function RiskCategorySection({
  category,
  risks,
  defaultOpen = false,
  onRiskClick,
}: RiskCategorySectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const CategoryIcon = getCategoryIcon(category);
  const activeRisks = risks.filter(r => r.value);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer group">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CategoryIcon className="h-5 w-5 text-blue-500" />
                {RISK_CATEGORY_LABELS[category]}
                <Badge variant="secondary" className="ml-2">
                  {activeRisks.length}
                </Badge>
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-3">
            {activeRisks.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                Рисков в данной категории не обнаружено
              </div>
            ) : (
              activeRisks.map((risk, index) => {
                const Icon = getRiskIcon(risk.color);
                return (
                  <div
                    key={`${risk.name}-${index}`}
                    className={`p-3 rounded-lg border ${getRiskColorClass(risk.color)} transition-all hover:shadow-sm cursor-pointer`}
                    onClick={() => onRiskClick?.(risk)}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-start gap-2 flex-1">
                        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm line-clamp-2">
                            {risk.description}
                          </div>
                        </div>
                      </div>
                      {risk.positive && (
                        <Badge variant="outline" className="flex-shrink-0 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-xs">
                          Позитивный
                        </Badge>
                      )}
                    </div>

                    {risk.comment && (
                      <div className="text-xs text-muted-foreground mt-2 line-clamp-3">
                        {risk.comment}
                      </div>
                    )}

                    {risk.details && risk.details.length > 0 && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        {risk.details.map((detailGroup, groupIndex) => (
                          <div key={groupIndex} className="space-y-1">
                            {detailGroup.map((detail, detailIndex) => {
                              // Skip external DataNewton URLs
                              if (detail.value_type === 'url' && detail.value.includes('datanewton.ru')) {
                                return null;
                              }
                              return (
                                <div key={detailIndex} className="flex items-start gap-2 text-xs">
                                  <span className="text-muted-foreground min-w-[80px]">
                                    {detail.name}:
                                  </span>
                                  {detail.value_type === 'url' ? (
                                    <a
                                      href={detail.value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Ссылка
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  ) : (
                                    <span className="font-medium flex-1">
                                      {formatRiskDetail(detail)}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
