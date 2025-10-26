import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, authReady } from "@/lib/supabase";
import { Profile } from "@/types/profile";
import { FPApi } from "@/lib/api";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const fetchUserProfile = async (userId: string, sessionToUse: Session) => {
    let profileFetched = false;

    const cachedProfile = localStorage.getItem(`profile_${userId}`);
    if (cachedProfile) {
      try {
        const parsedProfile = JSON.parse(cachedProfile);
        setProfile(parsedProfile);
      } catch (e) {
        console.error(
          "[useAuth] Failed to parse cached profile, removing bad cache:",
          e
        );
        localStorage.removeItem(`profile_${userId}`);
      }
    }

    try {
      if (!sessionToUse?.access_token) {
        setProfile(null);
        return;
      }

      const response = await FPApi.axios.get("/profile/my");

      const data = await response.data;
      setProfile(data);
      profileFetched = true;

      localStorage.setItem(`profile_${userId}`, JSON.stringify(data));
    } catch (error) {
      console.error("[useAuth] EXCEPTION: Failed to fetch profile:", error);
      setProfile(null);
    } finally {
      if (!profileFetched && !localStorage.getItem(`profile_${userId}`)) {
        console.warn(
          "[useAuth] Profile fetch failed, but stopping loading state to prevent infinite loading"
        );
      }
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    const initAuth = async () => {
      try {
        const initialSession = await authReady;

        if (!isSubscribed) return;

        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          FPApi.updateAuth(initialSession.access_token);
          await fetchUserProfile(initialSession.user.id, initialSession);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
          FPApi.updateAuth();
        }

        setInitialLoadComplete(true);
      } catch (error) {
        console.error("[Auth Init] Error during auth initialization:", error);
        setInitialLoadComplete(true);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isSubscribed) return;

      setSession(session);
      setUser(session?.user ?? null);

      switch (event) {
        case "SIGNED_IN":
          if (session?.user && !profile) {
            FPApi.updateAuth(session.access_token);
            await fetchUserProfile(session.user.id, session);
          }
          break;
        case "SIGNED_OUT":
          FPApi.updateAuth();
          setProfile(null);
          break;
        case "TOKEN_REFRESHED":
          FPApi.updateAuth(session?.access_token);
          console.log("[useAuth] Token refreshed");
          break;
        default:
          break;
      }
    });

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    if (user?.id) {
      localStorage.removeItem(`profile_${user.id}`);
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[useAuth] Error signing out:", error);
    }
  };

  const loading = !initialLoadComplete;

  return {
    user,
    session,
    profile,
    loading,
    signOut,
    isAuthenticated: !!user,
  };
}
