import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/components/auth-provider";
import { FPApi } from "@/lib/api";
import { UserAdditionalInfo, UserProfile } from "../types/profile";

interface ProfileState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isOwnProfile: boolean;
  requestedUsername: string | null;
  redirectPath: string | null;
  addititonalInfo: UserAdditionalInfo | null;
}

export function useProfileData() {
  const [needLoadAdditionalInfo, setNeedLoadAdditionalInfo] = useState(false);

  const [profileState, setProfileState] = useState<ProfileState>({
    user: null,
    isLoading: true,
    error: null,
    isOwnProfile: false,
    requestedUsername: null,
    redirectPath: null,
    addititonalInfo: null,
  });

  const { profile: authProfile, isAuthenticated } = useAuthContext();

  const extractUsernameFromUrl = useCallback((): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");

    if (username) {
      console.log("Extracted username from query params:", username);
      return username;
    }

    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    if (pathSegments.length > 0) {
      const lastSegment = pathSegments[pathSegments.length - 1];
      if (/^[a-zA-Z0-9_-]{3,30}$/.test(lastSegment)) {
        return lastSegment;
      }
    }

    return null;
  }, []);

  const fetchAdditionalInfoByUsername = async (
    username: string
  ): Promise<UserAdditionalInfo | null> => {
    try {
      const response = await FPApi.axios.get<UserAdditionalInfo>(
        `/profile/additional-info/${username}`
      );
      const data = response.data;
      return data || null;
    } catch (error) {
      console.error("Error additional info:", error);
      throw error;
    }
  };

  const loadAdditionalInfo = useCallback(async () => {
    const requestedUsername =
      isAuthenticated && !!authProfile
        ? authProfile.username
        : extractUsernameFromUrl();

    if (!requestedUsername) return;

    try {
      const additionalInfo = await fetchAdditionalInfoByUsername(
        requestedUsername
      );
      if (additionalInfo) {
        setProfileState((prev) => ({
          ...prev,
          addititonalInfo: additionalInfo,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  }, [authProfile, extractUsernameFromUrl, isAuthenticated]);

  const fetchProfileByUsername = async (
    username: string
  ): Promise<UserProfile | null> => {
    try {
      const response = await FPApi.axios.get(
        `/profile/by-username/${username}`
      );
      const data = await response.data;
      return data || null;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeProfileData = async () => {
      try {
        const requestedUsername =
          isAuthenticated && !!authProfile
            ? authProfile.username
            : extractUsernameFromUrl();

        setProfileState((prev) => ({
          ...prev,
          requestedUsername,
          isLoading: true,
          error: null,
          redirectPath: null,
        }));

        if (!requestedUsername) {
          // User navigated to /profile - redirect to their own profile if authenticated
          if (isAuthenticated && authProfile?.username) {
            setProfileState((prev) => ({
              ...prev,
              isLoading: false,
              redirectPath: `/${authProfile.username}`,
            }));
          } else {
            setProfileState((prev) => ({
              ...prev,
              isLoading: false,
              error: isAuthenticated
                ? "Profile username not found"
                : "Please sign in to view your profile",
            }));
          }
        } else {
          try {
            const profileData = await fetchProfileByUsername(requestedUsername);

            if (profileData) {
              const isOwnProfile =
                isAuthenticated && authProfile?.username === requestedUsername;

              setProfileState((prev) => ({
                ...prev,
                user: profileData,
                isLoading: false,
                error: null,
                isOwnProfile,
              }));
            } else {
              // Profile not found
              setProfileState((prev) => ({
                ...prev,
                isLoading: false,
                error: "Profile not found",
                user: null,
                addititonalInfo: null,
              }));
            }
          } catch (error) {
            console.error("Failed to fetch profile:", error);
            setProfileState((prev) => ({
              ...prev,
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to load profile",
            }));
          }
        }
      } catch (error) {
        console.error("Failed to initialize profile data:", error);
        setProfileState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to initialize profile system",
        }));
      }
    };

    initializeProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extractUsernameFromUrl, isAuthenticated, authProfile?.username]);

  const updateProfile = (updatedProfile: Partial<UserProfile>) => {
    if (profileState.user && profileState.isOwnProfile) {
      const newProfile = { ...profileState.user, ...updatedProfile };

      // Update local state
      setProfileState((prev) => ({
        ...prev,
        user: newProfile,
      }));
    }
  };

  const refetchProfile = async (silent?: boolean) => {
    const currentUsername = profileState.requestedUsername;
    if (!currentUsername) {
      return;
    }

    try {
      setProfileState((prev) => ({
        ...prev,
        isLoading: !silent,
        error: null,
      }));

      const profileData = await fetchProfileByUsername(currentUsername);
      const additionalInfo = await fetchAdditionalInfoByUsername(
        currentUsername
      );

      if (profileData) {
        const isOwnProfile =
          isAuthenticated && authProfile?.username === currentUsername;

        setProfileState((prev) => ({
          ...prev,
          user: profileData,
          addititonalInfo: additionalInfo,
          isLoading: false,
          error: null,
          isOwnProfile,
        }));
      } else {
        setProfileState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Profile not found",
        }));
      }
    } catch (error) {
      setProfileState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to reload profile",
      }));
    }
  };

  const logout = () => {
    setProfileState((prev) => ({
      ...prev,
      user: null,
      addititonalInfo: null,
      isOwnProfile: false,
    }));
  };

  useEffect(() => {
    if (needLoadAdditionalInfo) loadAdditionalInfo();
  }, [loadAdditionalInfo, needLoadAdditionalInfo]);

  return {
    ...profileState,
    updateProfile,
    refetchProfile,
    logout,
    setNeedLoadAdditionalInfo,
  };
}
