// Event Variant 3: Modern design with gradient accents and visual cards
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Video, Building2, Zap, CircleCheck, Plus, X } from 'lucide-react';
import { mockEvents } from './event-mock-data';

export function EventVariant3() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [tags, setTags] = useState<string[]>(['technology', 'networking']);
  const event = mockEvents[2];

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Events</h2>
            <p className="text-blue-50">Create and manage your events</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-white text-blue-600 hover:bg-blue-50 shadow-md"
          >
            {showCreateForm ? 'Back to Events' : 'Create New'}
          </Button>
        </div>
      </Card>

      {showCreateForm ? (
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-500/5 to-transparent border-b pb-6">
            <CardTitle className="text-2xl">Create Event</CardTitle>
            <CardDescription className="text-base">
              Set up your event and invite participants
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="title3" className="text-base font-semibold">
                Event Title *
              </Label>
              <Input
                id="title3"
                placeholder="e.g., Tech Innovation Summit 2025"
                className="h-12 text-base border-2 focus:border-blue-500"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="description3" className="text-base font-semibold">
                Event Description *
              </Label>
              <Textarea
                id="description3"
                placeholder="Tell people what your event is about..."
                rows={5}
                className="text-base border-2 focus:border-blue-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="eventType3" className="text-base font-semibold">
                  Event Format *
                </Label>
                <Select defaultValue="hybrid">
                  <SelectTrigger id="eventType3" className="h-12 border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">
                      <div className="flex items-center gap-2 py-1">
                        <Video className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="font-medium">Online Event</div>
                          <div className="text-xs text-muted-foreground">Virtual meeting</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="offline">
                      <div className="flex items-center gap-2 py-1">
                        <Building2 className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="font-medium">In-Person Event</div>
                          <div className="text-xs text-muted-foreground">Physical location</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="hybrid">
                      <div className="flex items-center gap-2 py-1">
                        <Zap className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="font-medium">Hybrid Event</div>
                          <div className="text-xs text-muted-foreground">Both online & offline</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="category3" className="text-base font-semibold">
                  Category *
                </Label>
                <Select defaultValue="networking">
                  <SelectTrigger id="category3" className="h-12 border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="location3" className="text-base font-semibold">
                Location / Meeting Link *
              </Label>
              <Input
                id="location3"
                placeholder="Address or video call link"
                className="h-12 text-base border-2 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="startDateTime3" className="text-base font-semibold">
                  Start Date & Time *
                </Label>
                <Input
                  id="startDateTime3"
                  type="datetime-local"
                  className="h-12 border-2 focus:border-blue-500"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="endDateTime3" className="text-base font-semibold">
                  End Date & Time *
                </Label>
                <Input
                  id="endDateTime3"
                  type="datetime-local"
                  className="h-12 border-2 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="capacity3" className="text-base font-semibold">
                Maximum Attendees (Optional)
              </Label>
              <Input
                id="capacity3"
                type="number"
                placeholder="Leave empty for unlimited"
                className="h-12 text-base border-2 focus:border-blue-500"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Tags
              </Label>
              <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg border-2 min-h-[60px]">
                {tags.map((tag) => (
                  <Badge key={tag} className="px-3 py-1 text-sm">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                <button
                  onClick={() => addTag('new-tag')}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-muted-foreground hover:text-foreground border-2 border-dashed rounded-full"
                >
                  <Plus className="w-3 h-3" />
                  Add tag
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button className="flex-1 h-12 shadow-lg text-base" size="lg">
                Create Event
              </Button>
              <Button
                variant="outline"
                className="h-12 text-base border-2"
                size="lg"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="shadow-lg border-0 overflow-hidden hover:shadow-xl transition-all">
            <div className="relative h-32 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
              <div className="absolute top-4 left-6 flex gap-2">
                <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-0 text-white">
                  {event.category}
                </Badge>
                <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-0 text-white">
                  {event.eventType === 'online' ? <Video className="w-3 h-3 mr-1" /> : event.eventType === 'offline' ? <Building2 className="w-3 h-3 mr-1" /> : <Zap className="w-3 h-3 mr-1" />}
                  {event.eventType === 'online' ? 'Online' : event.eventType === 'offline' ? 'In-Person' : 'Hybrid'}
                </Badge>
              </div>
            </div>

            <CardContent className="p-6 space-y-5 -mt-8 relative">
              <div className="bg-background rounded-xl p-5 shadow-lg border-2">
                <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">Date</span>
                  </div>
                  <p className="font-semibold">{new Date(event.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">Time</span>
                  </div>
                  <p className="font-semibold">{event.startTime} - {event.endTime}</p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">Location</span>
                  </div>
                  <p className="font-semibold line-clamp-1">{event.location}</p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">Attendees</span>
                  </div>
                  <p className="font-semibold">{event.attendees_count} joined</p>
                </div>
              </div>

              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="px-3 py-1">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {event.is_registered ? (
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500/10 via-green-500/5 to-transparent border-2 border-green-500/30 rounded-xl">
                  <div className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                    <CircleCheck className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-green-600">Already Registered</div>
                    <div className="text-sm text-muted-foreground">You're confirmed for this event</div>
                  </div>
                </div>
              ) : (
                <Button className="w-full h-12 shadow-lg text-base" size="lg">
                  Register for Event
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 overflow-hidden">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md shadow-2xl mb-4">
                  <CircleCheck className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-bold mb-2">Registration Successful!</h3>
                <p className="text-green-50 text-lg">You're all set for the event</p>
              </div>
            </div>

            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-2 border-blue-500/20 text-center">
                  <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground mb-1">Event Date</div>
                  <div className="font-bold">{new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>

                <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-2 border-blue-500/20 text-center">
                  <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground mb-1">Start Time</div>
                  <div className="font-bold">{event.startTime}</div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-muted/30 border-2 border-dashed text-center">
                <MapPin className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-sm text-muted-foreground mb-1">Location</div>
                <div className="font-semibold">{event.location}</div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 h-12 shadow-lg" size="lg">
                  <Calendar className="w-5 h-5 mr-2" />
                  Add to Calendar
                </Button>
                <Button variant="outline" className="h-12 border-2" size="lg">
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
