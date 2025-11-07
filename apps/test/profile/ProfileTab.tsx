// Public profile tab component with simplified structure

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { VerifiedBadge } from '@/components/shared/VerifiedBadge';
import { MessageCircle, Bot, MapPinned, Users, CalendarDays } from 'lucide-react';

export function ProfileTab() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200" alt="TechCommunity" />
                <AvatarFallback>TC</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <Button variant="outline" className="w-full gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Message
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Bot className="h-4 w-4" />
                  AI Message
                </Button>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">TechCommunity</h2>
                  <VerifiedBadge size="md" />
                </div>
                <p className="text-muted-foreground">@techcommunity</p>
              </div>

              <p className="text-foreground">
                A thriving community of developers, designers, and tech enthusiasts building the future together.
                Join us to collaborate, learn, and grow in the world of technology.
              </p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPinned className="h-4 w-4 text-muted-foreground" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>50,000+ Members</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>Joined March 2020</span>
                </div>
              </div>

              <div className="flex gap-4 text-sm">
                <div><span className="font-semibold">850</span> <span className="text-muted-foreground">Following</span></div>
                <div><span className="font-semibold">50K</span> <span className="text-muted-foreground">Followers</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Profile Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a simplified version of the profile tab. The full implementation
            includes posts, information, members, and AI knowledge tabs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
