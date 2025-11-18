// Search component for finding companies by INN or name

import { useState } from 'react';
import { Search, History, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CompanySearchProps {
  onSearch: (inn: string) => void;
  isLoading: boolean;
  searchHistory: Array<{ inn: string; name: string; timestamp: string }>;
}

const demoExamples = [
  { inn: '7707083893', name: 'ПАО "Сбербанк"' },
  { inn: '7728168971', name: 'ООО "Яндекс"' },
  { inn: '5007017140', name: 'Проблемная компания' }
];

export function CompanySearch({ onSearch, isLoading, searchHistory }: CompanySearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleQuickSearch = (inn: string) => {
    setSearchQuery(inn);
    onSearch(inn);
  };

  return (
    <Card className="p-4 shadow-sm hover:shadow-md transition-shadow">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Введите ИНН или название компании..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading || !searchQuery.trim()}>
            {isLoading ? 'Поиск...' : 'Проверить'}
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Примеры для проверки:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {demoExamples.map((example) => (
              <Button
                key={example.inn}
                variant="outline"
                size="sm"
                onClick={() => handleQuickSearch(example.inn)}
                disabled={isLoading}
                className="text-xs"
              >
                {example.name}
              </Button>
            ))}
          </div>
        </div>

        {searchHistory.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <History className="h-4 w-4" />
              <span>Последние проверки:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.slice(0, 5).map((item, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={() => handleQuickSearch(item.inn)}
                >
                  {item.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </form>
    </Card>
  );
}
