// Contragent verification page for checking companies by INN with comprehensive due diligence

import { useState } from 'react';
import { Building2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CompanySearch } from './components/CompanySearch';
import { RiskHeader } from './components/RiskHeader';
import { CompanyDetails } from './components/CompanyDetails';
import { RiskAssessment } from './components/RiskAssessment';
import { Company, SearchHistoryItem } from './types/company';
import { fetchCompanyInfo } from './lib/datanewton-api';
import { mapDataNewtonToCompany } from './lib/datanewton-mapper';

export default function ContragentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  const handleSearch = async (identifier: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentCompany(null);

    try {
      const apiResponse = await fetchCompanyInfo(identifier);
      const company = mapDataNewtonToCompany(apiResponse);

      setCurrentCompany(company);

      const historyItem: SearchHistoryItem = {
        inn: company.basicInfo.inn,
        name: company.basicInfo.name,
        timestamp: new Date().toISOString()
      };

      setSearchHistory(prev => {
        const filtered = prev.filter(item => item.inn !== identifier);
        return [historyItem, ...filtered].slice(0, 5);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла неизвестная ошибка';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Проверка контрагентов</h1>
                <p className="text-muted-foreground">
                  Данные компаний и ИП по ИНН и ОГРН
                </p>
              </div>
            </div>
          </div>


          {/* Search */}
          <CompanySearch
            onSearch={handleSearch}
            isLoading={isLoading}
            searchHistory={searchHistory}
            onClearHistory={handleClearHistory}
          />

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-muted-foreground">Загрузка данных о компании...</p>
            </div>
          )}

          {/* Results */}
          {currentCompany && !isLoading && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Risk Header */}
              <RiskHeader
                risk={currentCompany.riskAssessment}
                companyName={currentCompany.basicInfo.name}
              />

              {/* Company Details */}
              <CompanyDetails company={currentCompany} />

              {/* Risk Assessment & Actions */}
              <RiskAssessment risk={currentCompany.riskAssessment} />
            </div>
          )}

          {/* Initial State */}
          {!currentCompany && !isLoading && !error && (
            <div className="text-center py-16 space-y-4">
              <div className="inline-block p-6 bg-muted rounded-full">
                <Building2 className="h-16 w-16 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Начните проверку</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Введите ИНН или ОГРН компании для получения подробной информации и оценки рисков
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
