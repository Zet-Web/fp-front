// Event Variant 2: Bold design with emphasis on visual hierarchy
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Globe, Sparkles, Check } from 'lucide-react';
import { mockEvents } from './event-mock-data';

export function EventVariant2() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const event = mockEvents[1];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-transparent rounded-lg border">
        <h2 className="text-xl font-bold">Event Management</h2>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} className="shadow-md">
          {showCreateForm ? 'View Events' : '+ Create Event'}
        </Button>
      </div>

      {showCreateForm ? (
        <Card className="shadow-md border-2">
          <CardHeader className="bg-gradient-to-r from-blue-500/5 to-transparent border-b">
            <CardTitle className="text-xl">New Event</CardTitle>
            <CardDescription>Create an engaging event for your audience</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title2" className="text-base font-medium">
                Event Title
              </Label>
              <Input id="title2" placeholder="Give your event a catchy title" className="h-11 border-2" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description2" className="text-base font-medium">
                Description
              </Label>
              <Textarea id="description2" placeholder="What's your event about?" rows={5} className="border-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventType2" className="text-base font-medium">
                  Format
                </Label>
                <Select defaultValue="online">
                  <SelectTrigger id="eventType2" className="h-11 border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span>Online</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="offline">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>In-Person</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="hybrid">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Hybrid</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category2" className="text-base font-medium">
                  Category
                </Label>
                <Select defaultValue="education">
                  <SelectTrigger id="category2" className="h-11 border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity2" className="text-base font-medium">
                  Capacity
                </Label>
                <Input id="capacity2" type="number" placeholder="Max attendees" className="h-11 border-2" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location2" className="text-base font-medium">
                Location or Meeting Link
              </Label>
              <Input id="location2" placeholder="Where will this event take place?" className="h-11 border-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate2" className="text-base font-medium">
                  Start Date & Time
                </Label>
                <Input id="startDate2" type="datetime-local" className="h-11 border-2" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate2" className="text-base font-medium">
                  End Date & Time
                </Label>
                <Input id="endDate2" type="datetime-local" className="h-11 border-2" />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1 shadow-md" size="lg">
                Publish Event
              </Button>
              <Button variant="outline" size="lg" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="shadow-md border-2 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0">
                      {event.category}
                    </Badge>
                    <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0">
                      <Globe className="w-3 h-3 mr-1" />
                      {event.eventType === 'online' ? 'Online' : event.eventType === 'offline' ? 'In-Person' : 'Hybrid'}
                    </Badge>
                  </div>
                  <h3 className="text-3xl font-bold">{event.title}</h3>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">{event.description}</p>

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Date</div>
                      <div className="font-medium">{new Date(event.startDate).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Time</div>
                      <div className="font-medium">{event.startTime} - {event.endTime}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Location</div>
                      <div className="font-medium line-clamp-1">{event.location}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Attendees</div>
                      <div className="font-medium">{event.attendees_count} registered</div>
                    </div>
                  </div>
                </div>
              </div>

              {event.is_registered ? (
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500/10 to-transparent border-2 border-green-500/20 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-green-600">You're Registered</div>
                    <div className="text-sm text-muted-foreground">We'll send you a reminder</div>
                  </div>
                </div>
              ) : (
                <Button className="w-full shadow-md" size="lg">
                  Register Now
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md border-2">
            <CardContent className="p-6">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                  <Check className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-2">You're In!</h3>
                  <p className="text-muted-foreground text-lg">
                    Successfully registered for the event
                  </p>
                </div>
                <div className="inline-block p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl border-2 border-blue-500/20">
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <span className="font-semibold">{new Date(event.startDate).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span className="font-semibold">{event.startTime}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1 shadow-md" size="lg">
                    Add to Calendar
                  </Button>
                  <Button variant="outline" className="flex-1" size="lg">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
