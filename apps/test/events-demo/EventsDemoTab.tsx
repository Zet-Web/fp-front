// Demo tab showcasing event creation and display UI components
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventFormCard } from "../../../shared-src/event/EventFormCard";
import { EventDisplayCard } from "../../../shared-src/event/EventDisplayCard";
import {
  EventResponse,
  EventType,
} from "../../../shared-src/event/event-types";

const mockEventData: EventResponse = {
  eventTypes: ["online", "offline"] as EventType[],
  location: {
    city: "San Francisco",
    address: "123 Tech Street",
  },
  startDate: "2025-12-15",
  startTime: "14:00",
  endDate: "2025-12-15",
  endTime: "18:00",
  website: "https://example.com/event",
  category: "conference",
  memberLimit: 100,
};

export function EventsDemoTab() {
  const [eventData, setEventData] = useState<EventResponse>({
    eventTypes: [],
    startDate: "",
    startTime: "",
    category: "conference",
  });

  const [showForm, setShowForm] = useState(true);

  const handleSave = () => {
    console.log("Event data to save:", eventData);
    alert("Event data logged to console");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Event UI Components Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="form" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="form">Create Form</TabsTrigger>
              <TabsTrigger value="display">Display Full</TabsTrigger>
              <TabsTrigger value="compact">Display Compact</TabsTrigger>
            </TabsList>

            <TabsContent value="form" className="space-y-6 mt-6">
              <EventFormCard
                defaultEventFormValues={eventData}
                onFormValuesChange={setEventData}
              />
              <div className="flex gap-2">
                <Button onClick={handleSave}>Save Event (Console Log)</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEventData({
                      eventTypes: [],
                      startDate: "",
                      startTime: "",
                      category: "conference",
                    });
                  }}
                >
                  Reset Form
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="display" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Full Event Display</CardTitle>
                </CardHeader>
                <CardContent>
                  <EventDisplayCard eventData={mockEventData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compact" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compact Event Display (for PostCard)</CardTitle>
                </CardHeader>
                <CardContent>
                  <EventDisplayCard eventData={mockEventData} compact />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            To use event functionality in your post creation flow:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>User selects "Event" as post type in EditablePostCard</li>
            <li>EventFormCard appears below the main post fields</li>
            <li>User fills in event details (type, location, dates, etc.)</li>
            <li>
              On save, event data is passed along with post data to the backend
            </li>
            <li>
              In feed, PostCard displays event info using EventDisplayCard
              (compact mode)
            </li>
            <li>
              In full post view, FullPostCard displays complete event details
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
