import { FPApi } from "@/lib/api";
import {
  ProfileMember,
  CreatePublicProfileDto,
  UpdatePublicProfileDto,
  MembershipStatusResponse,
  ProfileMemberRole,
} from "./types";
import { Profile } from "@/types/profile";

export async function createPublicProfile(dto: CreatePublicProfileDto) {
  const res = await FPApi.axios.post("/profile/public", dto);
  return res.data;
}

export async function getMyPublicProfiles() {
  const res = await FPApi.axios.get<Profile[]>("/profile/public/my");
  return res.data;
}

export async function updatePublicProfile(
  profileId: string,
  dto: UpdatePublicProfileDto
) {
  const res = await FPApi.axios.patch(`/profile/public/${profileId}`, dto);
  return res.data;
}

export async function deletePublicProfile(profileId: string) {
  const res = await FPApi.axios.delete(`/profile/public/${profileId}`);
  return res.data;
}

export async function fetchProfileMembers(
  profileId: string
): Promise<ProfileMember[]> {
  const res = await FPApi.axios.get<ProfileMember[]>(
    `/profile/${profileId}/members`
  );
  return res.data;
}

export async function joinPublicProfile(profileId: string) {
  const res = await FPApi.axios.post(`/profile/${profileId}/members/join`);
  return res.data;
}

export async function leavePublicProfile(profileId: string) {
  const res = await FPApi.axios.delete(`/profile/${profileId}/members/leave`);
  return res.data;
}

export async function getMyProfileMembershipStatus(
  profileId: string
): Promise<MembershipStatusResponse> {
  const res = await FPApi.axios.get<MembershipStatusResponse>(
    `/profile/${profileId}/members/my-status`
  );
  return res.data;
}

export async function getPendingProfileMemberRequests(
  profileId: string
): Promise<ProfileMember[]> {
  const res = await FPApi.axios.get<ProfileMember[]>(
    `/profile/${profileId}/members/pending`
  );
  return res.data;
}

export async function acceptProfileMember(
  profileId: string,
  memberId: string
) {
  const res = await FPApi.axios.patch(
    `/profile/${profileId}/members/${memberId}/accept`
  );
  return res.data;
}

export async function declineProfileMember(
  profileId: string,
  memberId: string
) {
  const res = await FPApi.axios.patch(
    `/profile/${profileId}/members/${memberId}/decline`
  );
  return res.data;
}

export async function removeProfileMember(profileId: string, memberId: string) {
  const res = await FPApi.axios.delete(
    `/profile/${profileId}/members/${memberId}`
  );
  return res.data;
}

export async function updateProfileMemberRole(
  profileId: string,
  memberId: string,
  role: ProfileMemberRole
) {
  const res = await FPApi.axios.patch(
    `/profile/${profileId}/members/${memberId}/role`,
    { role }
  );
  return res.data;
}

export async function changeProfileMembersVisibility(
  membersVisibility: string,
  profileId?: string
): Promise<{ id: string }> {
  const res = await FPApi.axios.patch<{ id: string }>(
    `/profile/members-visibility`,
    {
      membersVisibility,
      profileId,
    }
  );
  return res.data;
}

export async function changeProfileMembershipPrivacy(
  membershipPrivacy: string,
  profileId?: string
): Promise<{ id: string }> {
  const res = await FPApi.axios.patch<{ id: string }>(
    `/profile/membership-privacy`,
    {
      membershipPrivacy,
      profileId,
    }
  );
  return res.data;
}
