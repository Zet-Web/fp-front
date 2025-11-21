// Profile 2 tab component with posts feed and filtering

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { VerifiedBadge } from '@/components/shared/VerifiedBadge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageCircle, UserPlus, MapPinned, Users, CalendarDays, Pin } from 'lucide-react';
import { PostCardVariants } from './PostCardVariants';
import { mockProfile2Posts, type MockPost } from './mock-profile2-posts';

export function Profile2Tab() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  const filteredPosts = mockProfile2Posts.filter((post) => {
    if (statusFilter === 'all') return true;
    return post.status === statusFilter;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const mockAuthor = {
    id: 1,
    name: 'TechCommunity',
    username: 'techcommunity',
    avatar_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200',
    badge: 'verified',
  };

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
                  <UserPlus className="h-4 w-4" />
                  Follow
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

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Posts</h3>
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Posts</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {sortedPosts.map((post) => {
          const renderPinIndicator = () => {
            if (!post.isPinned) return null;

            switch (post.pinVariant) {
              case 'top-badge':
                return (
                  <div className="absolute -top-2 left-4 z-10 flex items-center gap-1 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
                    <Pin className="h-3 w-3" />
                    <span>Pinned</span>
                  </div>
                );

              case 'corner-icon':
                return (
                  <div className="absolute top-3 right-3 z-10 bg-blue-500/10 backdrop-blur-sm p-2 rounded-lg border border-blue-500/20">
                    <Pin className="h-4 w-4 text-blue-500" />
                  </div>
                );

              case 'left-border':
                return (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-l-lg" />
                );

              case 'inline-header':
              default:
                return null;
            }
          };

          return (
            <div
              key={post.id}
              className={`relative ${post.isPinned && post.pinVariant === 'left-border' ? 'pl-1' : ''}`}
            >
              {renderPinIndicator()}

              <div className={post.isPinned && post.pinVariant === 'left-border' ? '-ml-1' : ''}>
                {post.isPinned && post.pinVariant === 'inline-header' && (
                  <div className="mb-2 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
                    <Pin className="h-4 w-4 fill-current" />
                    <span>Pinned Post</span>
                  </div>
                )}

                <PostCardVariants
                  postId={post.id}
                  title={post.title}
                  content={post.content}
                  images={post.images}
                  author={mockAuthor}
                  showActions={false}
                  imageVariant={post.imageVariant}
                  variantLabel={post.variantLabel}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
