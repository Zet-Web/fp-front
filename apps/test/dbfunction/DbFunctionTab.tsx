// Tab component for testing database SQL functions
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { RefreshCw, Database } from 'lucide-react';

interface TestData {
  id: number;
  text: string;
  created_at: string;
}

export function DbFunctionTab() {
  const [data, setData] = useState<TestData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: result, error: rpcError } = await supabase.rpc('test_get_data');

      if (rpcError) {
        throw new Error(rpcError.message);
      }

      setData(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Database function error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Test DB Function</h2>
          <p className="text-muted-foreground">
            Calling SQL function: <code className="text-sm bg-muted px-2 py-1 rounded">test_get_data()</code>
          </p>
        </div>
        <Button onClick={fetchData} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {isLoading && !data.length && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-muted-foreground">Loading data...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && data.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No data found in test table</p>
            </div>
          </CardContent>
        </Card>
      )}

      {data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Results from public.test table ({data.length} rows)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                        ID: {item.id}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Database Function Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <span className="font-semibold">Function Name:</span>{' '}
            <code className="bg-background px-2 py-1 rounded">test_get_data</code>
          </div>
          <div>
            <span className="font-semibold">SQL Definition:</span>{' '}
            <code className="bg-background px-2 py-1 rounded">
              select * from public.test order by id;
            </code>
          </div>
          <div>
            <span className="font-semibold">Table:</span>{' '}
            <code className="bg-background px-2 py-1 rounded">public.test</code>
          </div>
          <div>
            <span className="font-semibold">Columns:</span>{' '}
            <code className="bg-background px-2 py-1 rounded">id, text, created_at</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
