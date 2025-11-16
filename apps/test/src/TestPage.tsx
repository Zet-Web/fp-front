// Testing page for UI components and features, hidden from search engines
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollingTab } from '../scrolling/ScrollingTab';
import { Profile2Tab } from '../profile2/Profile2Tab';
import { TypographyTab } from '../typography/TypographyTab';
import { Quiz3Tab } from '../quiz3/Quiz3Tab';
import { EventsTab } from '../events/EventsTab';
import { EventsDemoTab } from '../events-demo/EventsDemoTab';

const tabMap: Record<string, string> = {
  '1': 'scrolling',
  '2': 'profile2',
  '3': 'typography',
  '4': 'quiz3',
  '5': 'events',
  '6': 'events-demo'
};

export function TestPage() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialTab = tabParam ? (tabMap[tabParam] || 'scrolling') : 'scrolling';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabMap[tabParam] || 'scrolling');
    }
  }, [tabParam]);

  useEffect(() => {
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    const metaGooglebot = document.createElement('meta');
    metaGooglebot.name = 'googlebot';
    metaGooglebot.content = 'noindex, nofollow';
    document.head.appendChild(metaGooglebot);

    return () => {
      document.head.removeChild(metaRobots);
      document.head.removeChild(metaGooglebot);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-6 h-auto">
          <TabsTrigger value="scrolling">Scrolling Tabs</TabsTrigger>
          <TabsTrigger value="profile2">Profile 2</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="quiz3">Quiz Variants</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="events-demo">Events Demo</TabsTrigger>
        </TabsList>

        <TabsContent value="scrolling">
          <ScrollingTab />
        </TabsContent>

        <TabsContent value="profile2">
          <Profile2Tab />
        </TabsContent>

        <TabsContent value="typography">
          <TypographyTab />
        </TabsContent>

        <TabsContent value="quiz3">
          <Quiz3Tab />
        </TabsContent>

        <TabsContent value="events">
          <EventsTab />
        </TabsContent>

        <TabsContent value="events-demo">
          <EventsDemoTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
