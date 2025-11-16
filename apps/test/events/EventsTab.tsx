// Event design comparison tab showing multiple design variants for creating and displaying events
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventVariant1 } from './EventVariant1';
import { EventVariant2 } from './EventVariant2';
import { EventVariant3 } from './EventVariant3';

export function EventsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Event Design Variants Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="variant1" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="variant1">Variant 1</TabsTrigger>
              <TabsTrigger value="variant2">Variant 2</TabsTrigger>
              <TabsTrigger value="variant3">Variant 3</TabsTrigger>
            </TabsList>

            <TabsContent value="variant1" className="space-y-6">
              <EventVariant1 />
            </TabsContent>

            <TabsContent value="variant2" className="space-y-6">
              <EventVariant2 />
            </TabsContent>

            <TabsContent value="variant3" className="space-y-6">
              <EventVariant3 />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
