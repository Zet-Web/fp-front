// Network statistics dashboard showing connection metrics and insights

import { NetworkStats as NetworkStatsType } from '../types/network';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, UserCheck, TrendingUp, Globe } from 'lucide-react';

interface NetworkStatsProps {
  stats: NetworkStatsType;
}

export function NetworkStats({ stats }: NetworkStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Всего соединений
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalConnections}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Прямые связи
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stats.directConnections}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Взаимные связи
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stats.mutualConnections}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-pink-500/10 flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-pink-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Новые за месяц
              </p>
              <p className="text-2xl font-bold text-foreground">
                +{stats.newThisMonth}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow md:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            Топ сообществ
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          {stats.topCommunities.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Нет активных сообществ
            </p>
          ) : (
            <div className="space-y-3">
              {stats.topCommunities.map((community, index) => (
                <div key={community.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 flex-shrink-0">
                      <span className="text-xs font-semibold text-blue-500">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-foreground truncate">
                      {community.name}
                    </span>
                  </div>
                  <Badge variant="secondary" className="ml-2 flex-shrink-0">
                    {community.count}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow md:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Распределение по типам</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(stats.connectionsByType)
              .filter(([_, count]) => count > 0)
              .map(([type, count]) => (
                <div
                  key={type}
                  className="flex items-center justify-between p-2 rounded-md bg-accent/50"
                >
                  <span className="text-sm text-muted-foreground capitalize">
                    {getTypeLabel(type)}
                  </span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    direct: 'Прямые',
    following: 'Подписки',
    follower: 'Подписчики',
    community: 'Сообщества',
    mutual: 'Взаимные',
    colleague: 'Коллеги',
    client: 'Клиенты',
    partner: 'Партнёры',
  };
  return labels[type] || type;
}
