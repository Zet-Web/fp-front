// Members management tab for testing universal members UI
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPlus, Search, Users, Clock, UserX, Check } from 'lucide-react';
import {
  mockOwnerAndAdmins,
  mockMembers,
  mockJoinRequests,
  mockSentInvites,
  Member,
  JoinRequest,
  SentInvite,
} from './mock-members-data';

type VisibilityMode = 'all' | 'members' | 'owner';
type AccessMode = 'public' | 'private';

export function MembersTab() {
  const [admins] = useState<Member[]>(mockOwnerAndAdmins);
  const [members] = useState<Member[]>(mockMembers);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>(mockJoinRequests);
  const [sentInvites] = useState<SentInvite[]>(mockSentInvites);

  const [searchQuery, setSearchQuery] = useState('');

  // Settings
  const [isEnabled, setIsEnabled] = useState(true);
  const [visibility, setVisibility] = useState<VisibilityMode>('all');
  const [accessMode, setAccessMode] = useState<AccessMode>('public');

  // Section visibility
  const [showAdmins, setShowAdmins] = useState(true);
  const [showMembers, setShowMembers] = useState(true);
  const [showJoinRequests, setShowJoinRequests] = useState(true);
  const [showSentInvites, setShowSentInvites] = useState(true);

  const filterBySearch = (items: (Member | JoinRequest | SentInvite)[]) => {
    if (!searchQuery) return items;
    return items.filter((item) => {
      const name = item.name.toLowerCase();
      const username = 'username' in item ? item.username.toLowerCase() : '';
      const email = 'email' in item ? item.email.toLowerCase() : '';
      const query = searchQuery.toLowerCase();
      return name.includes(query) || username.includes(query) || email.includes(query);
    });
  };

  const handleAcceptRequest = (requestId: string) => {
    setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const handleRejectRequest = (requestId: string) => {
    setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const filteredAdmins = filterBySearch(admins) as Member[];
  const filteredMembers = filterBySearch(members) as Member[];
  const filteredJoinRequests = filterBySearch(joinRequests) as JoinRequest[];
  const filteredSentInvites = filterBySearch(sentInvites) as SentInvite[];

  const totalCount = admins.length + members.length;

  const MemberItem = ({ member }: { member: Member }) => (
    <div className="flex items-center gap-4 py-3">
      <Avatar className="w-12 h-12">
        <AvatarImage src={member.avatar_url} alt={member.name} />
        <AvatarFallback className="text-sm">
          {member.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-semibold truncate">{member.name}</h3>
          {member.badge?.includes('verified') && (
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{member.jobTitle || `@${member.username}`}</p>
      </div>

      <Badge variant={member.role === 'owner' || member.role === 'admin' ? 'default' : 'secondary'}>
        {member.role === 'owner' ? 'Owner' : member.role === 'admin' ? 'Admin' : 'Member'}
      </Badge>
    </div>
  );

  const JoinRequestItem = ({ request }: { request: JoinRequest }) => (
    <div className="flex items-center gap-4 py-3">
      <Avatar className="w-12 h-12">
        <AvatarImage src={request.avatar_url} alt={request.name} />
        <AvatarFallback className="text-sm">
          {request.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{request.name}</h3>
        <p className="text-sm text-muted-foreground">{request.jobTitle || `@${request.username}`}</p>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => handleAcceptRequest(request.id)}
        >
          Accept
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleRejectRequest(request.id)}
        >
          <UserX className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const SentInviteItem = ({ invite }: { invite: SentInvite }) => (
    <div className="flex items-center gap-4 py-3">
      <Avatar className="w-12 h-12">
        <AvatarImage src={invite.avatar_url} alt={invite.name} />
        <AvatarFallback className="text-sm">
          {invite.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{invite.name}</h3>
        <p className="text-sm text-muted-foreground">{invite.email}</p>
      </div>

      <Badge variant="outline" className="gap-1">
        <Clock className="w-3 h-3" />
        Pending
      </Badge>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Members</h2>
              <Badge variant="outline" className="ml-2">
                {totalCount}
              </Badge>
            </div>
            <Button size="sm" className="gap-2">
              <UserPlus className="w-4 h-4" />
              Invite
            </Button>
          </div>

          {/* Settings */}
          <div className="space-y-4 mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <Label htmlFor="members-enabled" className="text-sm font-medium">
                Members Tab Enabled
              </Label>
              <Switch
                id="members-enabled"
                checked={isEnabled}
                onCheckedChange={setIsEnabled}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="visibility" className="text-sm font-medium">
                  Visible to
                </Label>
                <Select value={visibility} onValueChange={(v) => setVisibility(v as VisibilityMode)}>
                  <SelectTrigger className="w-32" id="visibility">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="members">Members</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="access-mode" className="text-sm font-medium">
                  Access Mode
                </Label>
                <Select value={accessMode} onValueChange={(v) => setAccessMode(v as AccessMode)}>
                  <SelectTrigger className="w-32" id="access-mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-sm font-medium">Show Sections</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-admins"
                    checked={showAdmins}
                    onCheckedChange={(checked) => setShowAdmins(checked as boolean)}
                  />
                  <Label htmlFor="show-admins" className="text-sm font-normal cursor-pointer">
                    Admins
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-members"
                    checked={showMembers}
                    onCheckedChange={(checked) => setShowMembers(checked as boolean)}
                  />
                  <Label htmlFor="show-members" className="text-sm font-normal cursor-pointer">
                    Members
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-requests"
                    checked={showJoinRequests}
                    onCheckedChange={(checked) => setShowJoinRequests(checked as boolean)}
                  />
                  <Label htmlFor="show-requests" className="text-sm font-normal cursor-pointer">
                    Join Requests
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-invites"
                    checked={showSentInvites}
                    onCheckedChange={(checked) => setShowSentInvites(checked as boolean)}
                  />
                  <Label htmlFor="show-invites" className="text-sm font-normal cursor-pointer">
                    Sent Invites
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Members List */}
          <div className="space-y-6">
            {/* Admins Section */}
            {showAdmins && filteredAdmins.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">Admins</h3>
                </div>
                <div className="space-y-1">
                  {filteredAdmins.map((admin) => (
                    <MemberItem key={admin.id} member={admin} />
                  ))}
                </div>
              </div>
            )}

            {showAdmins && showMembers && filteredAdmins.length > 0 && filteredMembers.length > 0 && (
              <Separator />
            )}

            {/* Members Section */}
            {showMembers && filteredMembers.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Members</h3>
                </div>
                <div className="space-y-1">
                  {filteredMembers.map((member) => (
                    <MemberItem key={member.id} member={member} />
                  ))}
                </div>
              </div>
            )}

            {((showAdmins && filteredAdmins.length > 0) || (showMembers && filteredMembers.length > 0)) &&
              showSentInvites &&
              filteredSentInvites.length > 0 && <Separator />}

            {/* Sent Invites Section */}
            {showSentInvites && filteredSentInvites.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">Sent Invites</h3>
                </div>
                <div className="space-y-1">
                  {filteredSentInvites.map((invite) => (
                    <SentInviteItem key={invite.id} invite={invite} />
                  ))}
                </div>
              </div>
            )}

            {((showAdmins && filteredAdmins.length > 0) ||
              (showMembers && filteredMembers.length > 0) ||
              (showSentInvites && filteredSentInvites.length > 0)) &&
              showJoinRequests &&
              filteredJoinRequests.length > 0 && <Separator />}

            {/* Join Requests Section */}
            {showJoinRequests && filteredJoinRequests.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <UserPlus className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-semibold">Join Requests</h3>
                </div>
                <div className="space-y-1">
                  {filteredJoinRequests.map((request) => (
                    <JoinRequestItem key={request.id} request={request} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredAdmins.length === 0 &&
              filteredMembers.length === 0 &&
              filteredJoinRequests.length === 0 &&
              filteredSentInvites.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No members found</div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
