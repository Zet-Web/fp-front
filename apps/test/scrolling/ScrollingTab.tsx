// Scrolling tabs variants showcasing different approaches for handling many tab options

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ScrollingTab() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Scrolling Tabs Variants</CardTitle>
          <p className="text-sm text-muted-foreground">Different approaches for handling many tab options</p>
        </CardHeader>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Variant 1: Horizontal Scroll with ScrollArea</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 pb-2">
              {Array.from({ length: 20 }, (_, i) => (
                <Button key={i} variant={i === 0 ? 'default' : 'outline'} className="shrink-0">
                  Tab {i + 1}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Variant 2: Native Tabs with Overflow Scroll</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tab1" className="w-full">
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-auto min-w-full">
                {Array.from({ length: 15 }, (_, i) => (
                  <TabsTrigger key={i} value={`tab${i + 1}`}>
                    Category {i + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <TabsContent value="tab1" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">Content for Tab 1</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Variant 3: Compact Pills with Scroll</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-2">
                {Array.from({ length: 25 }, (_, i) => (
                  <Badge key={i} variant={i === 0 ? 'default' : 'secondary'} className="cursor-pointer shrink-0 px-3 py-1.5">
                    Option {i + 1}
                  </Badge>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Variant 4: Grid Layout (Wrapping)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2">
            {Array.from({ length: 21 }, (_, i) => (
              <Button key={i} variant={i === 0 ? 'default' : 'outline'} size="sm">
                {i + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
