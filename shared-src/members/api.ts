import { FPApi } from "@/lib/api";
import { Member, MemberStatus } from "./types";

export type { MemberStatus };

export interface JoinStatusResponse {
  status: MemberStatus;
}

export async function fetchEventMembers(eventId: number): Promise<Member[]> {
  const res = await FPApi.axios.get<Member[]>(`/event/membership/list/${eventId}`);
  return res.data;
}

export async function getMyJoinStatus(eventId: number): Promise<JoinStatusResponse> {
  const res = await FPApi.axios.get<JoinStatusResponse>(`/event/membership/status/${eventId}`);
  return res.data;
}

export async function joinEvent(eventId: number): Promise<void> {
  await FPApi.axios.post(`/event/membership/join/${eventId}`);
}

export async function leaveEvent(eventId: number): Promise<void> {
  await FPApi.axios.post(`/event/membership/leave/${eventId}`);
}

export async function acceptMember(eventId: number, username: string): Promise<void> {
  await FPApi.axios.post(`/event/membership/accept/${eventId}/${username}`);
}

export async function declineMember(eventId: number, username: string): Promise<void> {
  await FPApi.axios.post(`/event/membership/decline/${eventId}/${username}`);
}

export async function removeMember(eventId: number, username: string): Promise<void> {
  await FPApi.axios.post(`/event/membership/remove/${eventId}/${username}`);
}

export async function changeEventPrivacy(eventId: number, privacy: string): Promise<{ id: number }> {
  const res = await FPApi.axios.patch<{ id: number }>(`/event/privacy`, {
    eventId,
    privacy,
  });
  return res.data;
}

export async function changeEventMembersVisibility(eventId: number, membersVisibility: string): Promise<{ id: number }> {
  const res = await FPApi.axios.patch<{ id: number }>(`/event/members-visibility`, {
    eventId,
    membersVisibility,
  });
  return res.data;
}
