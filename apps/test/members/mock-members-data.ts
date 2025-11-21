// Mock members data for testing
import { Member, MemberRole, MemberStatus, MembersStats } from "./member-types";

export const mockMembers: Member[] = [
  {
    id: "member-1",
    user_id: "user-1",
    name: "Александр Петров",
    username: "a.petrov",
    avatar_url: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
    role: MemberRole.owner,
    status: MemberStatus.active,
    joined_at: "2023-01-15T10:00:00.000Z",
    badge: ["verified", "premium"]
  },
  {
    id: "member-2",
    user_id: "user-2",
    name: "Мария Иванова",
    username: "m.ivanova",
    avatar_url: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
    role: MemberRole.admin,
    status: MemberStatus.active,
    joined_at: "2023-02-10T14:30:00.000Z",
    badge: ["verified"]
  },
  {
    id: "member-3",
    user_id: "user-3",
    name: "Дмитрий Смирнов",
    username: "d.smirnov",
    avatar_url: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400",
    role: MemberRole.moderator,
    status: MemberStatus.active,
    joined_at: "2023-03-05T09:15:00.000Z",
    badge: []
  },
  {
    id: "member-4",
    user_id: "user-4",
    name: "Елена Козлова",
    username: "e.kozlova",
    avatar_url: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    role: MemberRole.member,
    status: MemberStatus.active,
    joined_at: "2023-04-20T16:45:00.000Z",
    badge: ["verified"]
  },
  {
    id: "member-5",
    user_id: "user-5",
    name: "Игорь Волков",
    username: "i.volkov",
    avatar_url: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
    role: MemberRole.member,
    status: MemberStatus.active,
    joined_at: "2023-05-12T11:20:00.000Z",
    badge: []
  },
  {
    id: "member-6",
    user_id: "user-6",
    name: "Анна Лебедева",
    username: "a.lebedeva",
    avatar_url: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    role: MemberRole.member,
    status: MemberStatus.active,
    joined_at: "2023-06-08T13:00:00.000Z",
    badge: ["premium"]
  },
  {
    id: "member-7",
    user_id: "user-7",
    name: "Сергей Новиков",
    username: "s.novikov",
    avatar_url: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
    role: MemberRole.member,
    status: MemberStatus.active,
    joined_at: "2023-07-15T10:30:00.000Z",
    badge: []
  },
  {
    id: "member-8",
    user_id: "user-8",
    name: "Ольга Морозова",
    username: "o.morozova",
    avatar_url: "https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=400",
    role: MemberRole.member,
    status: MemberStatus.pending,
    joined_at: "2023-11-20T15:00:00.000Z",
    badge: []
  },
  {
    id: "member-9",
    user_id: "user-9",
    name: "Павел Соколов",
    username: "p.sokolov",
    avatar_url: "https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=400",
    role: MemberRole.member,
    status: MemberStatus.pending,
    joined_at: "2023-11-21T09:30:00.000Z",
    badge: []
  },
  {
    id: "member-10",
    user_id: "user-10",
    name: "Татьяна Федорова",
    username: null,
    avatar_url: null,
    role: MemberRole.member,
    status: MemberStatus.active,
    joined_at: "2023-08-25T12:00:00.000Z",
    badge: []
  }
];

export const mockMembersStats: MembersStats = {
  total: mockMembers.length,
  active: mockMembers.filter(m => m.status === MemberStatus.active).length,
  pending: mockMembers.filter(m => m.status === MemberStatus.pending).length,
  admins: mockMembers.filter(m => m.role === MemberRole.admin || m.role === MemberRole.owner).length
};
