import { createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useAuth } from "@/hooks/use-auth";
import { UserProfile } from "@/apps/profile/src/types/profile";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  updateProfilePartial: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={{ ...auth }}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
