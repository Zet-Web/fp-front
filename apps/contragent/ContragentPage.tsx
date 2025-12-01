// Contragent verification page for checking companies by INN with comprehensive due diligence

import { useState, useEffect } from 'react';
import { Building2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompanySearch } from './components/CompanySearch';
import { RiskHeader } from './components/RiskHeader';
import { CompanyDetails } from './components/CompanyDetails';
import { RiskAssessment } from './components/RiskAssessment';
import { FinancialMetricsPreview } from './components/FinancialMetricsPreview';
import { FinanceTabDetailed } from './components/FinanceTabDetailed';
import { RisksOverview } from './components/RisksOverview';
import { RisksTabDetailed } from './components/RisksTabDetailed';
import { Company, SearchHistoryItem } from './types/company';
import { BasicFinancialMetrics, DetailedFinancialData } from './types/finance';
import { RisksData, RisksSummary } from './types/risks';
import { fetchCompanyInfo, fetchCompanyFinance } from './lib/datanewton-api';
import { fetchCompanyRisks } from './lib/datanewton-risks-api';
import { mapDataNewtonToCompany } from './lib/datanewton-mapper';
import { mapToBasicFinancialMetrics, mapToDetailedFinancialData } from './lib/datanewton-finance-mapper';
import { mapToRisksSummary } from './lib/datanewton-risks-mapper';

export default function ContragentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('overview');

  const [financeLoading, setFinanceLoading] = useState(false);
  const [financeError, setFinanceError] = useState<string | null>(null);
  const [basicFinanceMetrics, setBasicFinanceMetrics] = useState<BasicFinancialMetrics | null>(null);
  const [detailedFinanceData, setDetailedFinanceData] = useState<DetailedFinancialData | null>(null);

  const [risksLoading, setRisksLoading] = useState(false);
  const [risksError, setRisksError] = useState<string | null>(null);
  const [risksData, setRisksData] = useState<RisksData | null>(null);
  const [risksSummary, setRisksSummary] = useState<RisksSummary | null>(null);

  const loadFinanceData = async (inn: string, ogrn: string) => {
    setFinanceLoading(true);
    setFinanceError(null);
    setBasicFinanceMetrics(null);
    setDetailedFinanceData(null);

    try {
      const financeResponse = await fetchCompanyFinance(inn, ogrn);

      const basicMetrics = mapToBasicFinancialMetrics(financeResponse);
      const detailedData = mapToDetailedFinancialData(financeResponse);

      setBasicFinanceMetrics(basicMetrics);
      setDetailedFinanceData(detailedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить финансовые данные';
      setFinanceError(errorMessage);
      console.error('Finance loading error:', err);
    } finally {
      setFinanceLoading(false);
    }
  };

  const loadRisksData = async (inn: string, ogrn: string) => {
    setRisksLoading(true);
    setRisksError(null);
    setRisksData(null);
    setRisksSummary(null);

    try {
      const risksResponse = await fetchCompanyRisks(inn, ogrn);
      const summary = mapToRisksSummary(risksResponse);

      setRisksData(risksResponse);
      setRisksSummary(summary);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить данные о рисках';
      setRisksError(errorMessage);
      console.error('Risks loading error:', err);
    } finally {
      setRisksLoading(false);
    }
  };

  const handleSearch = async (identifier: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentCompany(null);
    setBasicFinanceMetrics(null);
    setDetailedFinanceData(null);
    setFinanceError(null);
    setRisksData(null);
    setRisksSummary(null);
    setRisksError(null);
    setActiveTab('overview');

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

      setTimeout(() => {
        loadFinanceData(company.basicInfo.inn, company.basicInfo.ogrn);
        loadRisksData(company.basicInfo.inn, company.basicInfo.ogrn);
      }, 800);

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

  const handleViewFinanceDetails = () => {
    setActiveTab('finance');
  };

  const handleViewRisksDetails = () => {
    setActiveTab('risks');
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

          {/* Results with Tabs */}
          {currentCompany && !isLoading && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Risk Header - Hidden until proper risk calculation is implemented using real finance API data */}
              {/* <RiskHeader
                risk={currentCompany.riskAssessment}
                companyName={currentCompany.basicInfo.name}
              /> */}

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full md:w-[600px] grid-cols-3">
                  <TabsTrigger value="overview">Обзор</TabsTrigger>
                  <TabsTrigger value="finance">Финансы</TabsTrigger>
                  <TabsTrigger value="risks">Риски</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  {/* Company Details */}
                  <CompanyDetails company={currentCompany} />

                  {/* Financial Metrics Preview */}
                  <FinancialMetricsPreview
                    metrics={basicFinanceMetrics}
                    isLoading={financeLoading}
                    onViewDetails={handleViewFinanceDetails}
                  />

                  {/* Risks Overview */}
                  <RisksOverview
                    summary={risksSummary}
                    isLoading={risksLoading}
                    onViewDetails={handleViewRisksDetails}
                  />
                </TabsContent>

                <TabsContent value="finance" className="mt-6">
                  <FinanceTabDetailed
                    data={detailedFinanceData}
                    isLoading={financeLoading}
                    error={financeError}
                  />
                </TabsContent>

                <TabsContent value="risks" className="mt-6">
                  <RisksTabDetailed
                    data={risksData}
                    summary={risksSummary}
                    isLoading={risksLoading}
                    error={risksError}
                  />
                </TabsContent>
              </Tabs>
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
