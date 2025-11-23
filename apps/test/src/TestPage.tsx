// Testing page for UI components and features, hidden from search engines
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Profile2Tab } from '../profile2/Profile2Tab';
import { Quiz3Tab } from '../quiz3/Quiz3Tab';
import { EventsTab } from '../events/EventsTab';
import { EventsDemoTab } from '../events-demo/EventsDemoTab';
import { DateSelectorsDemo } from '../date-selectors/DateSelectorsDemo';
import { ProfileWithMembers } from '../profile-with-members/ProfileWithMembers';
 
const tabMap: Record<string, string> = {
  '1': 'profile',
  '2': 'profile2',
  '4': 'quiz3',
  '5': 'events',
  '6': 'events-demo',
  '7': 'date-selectors'
};

export function TestPage() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialTab = tabParam ? (tabMap[tabParam] || 'profile') : 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabMap[tabParam] || 'profile');
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
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="profile2">Profile 2</TabsTrigger>
          <TabsTrigger value="quiz3">Quiz Variants</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="events-demo">Events Demo</TabsTrigger>
          <TabsTrigger value="date-selectors">Date Selectors</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileWithMembers />
        </TabsContent>

        <TabsContent value="profile2">
          <Profile2Tab />
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

        <TabsContent value="date-selectors">
          <DateSelectorsDemo />
        </TabsContent>
      </Tabs>
    </div>
  );
}
