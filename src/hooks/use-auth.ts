import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, authReady } from "@/lib/supabase";
import { FPApi } from "@/lib/api";
import { UserProfile } from "@/apps/profile/src/types/profile";
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (session: Session) => {
    FPApi.updateAuth(session.access_token);

    try {
      const { data } = await FPApi.axios.get("/profile/my");
      setProfile(data);
      localStorage.setItem(`profile_${session.user.id}`, JSON.stringify(data));
    } catch {
      setProfile(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const initialSession = await authReady;
      if (!isMounted) return;

      setLoading(true)      

      if (initialSession) {
        setSession(initialSession);
        setUser(initialSession.user);

        await fetchProfile(initialSession);
      } else {
        FPApi.updateAuth();
        setSession(null);
        setUser(null);
        setProfile(null);
      }

      setLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      setSession(session ?? null);
      setUser(session?.user ?? null);

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session) await fetchProfile(session);
      }

      if (event === "SIGNED_OUT") {
        FPApi.updateAuth();
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    profile,
    loading,
    isAuthenticated: !!user,
    signOut: async () => {
      if (user?.id) localStorage.removeItem(`profile_${user.id}`);
      await supabase.auth.signOut();
    },
    updateProfilePartial: (updates: Partial<UserProfile>) =>
      setProfile(p => p ? { ...p, ...updates } : null)
  };
}
