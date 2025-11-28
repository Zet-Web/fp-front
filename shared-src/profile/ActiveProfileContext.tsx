import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getMyPublicProfiles } from "./api";

export interface ActiveProfile {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
  isPublicProfile: boolean;
}

interface ActiveProfileContextType {
  activeProfile: ActiveProfile | null;
  publicProfiles: ActiveProfile[];
  setActiveProfile: (profile: ActiveProfile) => void;
  loadPublicProfiles: () => Promise<void>;
  isLoading: boolean;
}

const ActiveProfileContext = createContext<
  ActiveProfileContextType | undefined
>(undefined);

export function ActiveProfileProvider({ children }: { children: ReactNode }) {
  const [activeProfile, setActiveProfileState] = useState<ActiveProfile | null>(
    null
  );
  const [publicProfiles, setPublicProfiles] = useState<ActiveProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved active profile from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("activeProfile");
    if (saved) {
      try {
        setActiveProfileState(JSON.parse(saved));
      } catch {
        // Invalid saved data, ignore
      }
    }
  }, []);

  const loadPublicProfiles = async () => {
    setIsLoading(true);
    try {
      const profiles = await getMyPublicProfiles();
      setPublicProfiles(
        profiles.map((p) => ({
          id: p.id,
          name: p.name || "",
          username: p.username || "",
          avatar_url: p.avatar_url || undefined,
          isPublicProfile: true,
        }))
      );
    } catch (error) {
      console.error("Failed to load public profiles", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setActiveProfile = (profile: ActiveProfile) => {
    setActiveProfileState(profile);
    localStorage.setItem("activeProfile", JSON.stringify(profile));
  };

  return (
    <ActiveProfileContext.Provider
      value={{
        activeProfile,
        publicProfiles,
        setActiveProfile,
        loadPublicProfiles,
        isLoading,
      }}
    >
      {children}
    </ActiveProfileContext.Provider>
  );
}

export function useActiveProfile() {
  const context = useContext(ActiveProfileContext);
  if (context === undefined) {
    throw new Error(
      "useActiveProfile must be used within ActiveProfileProvider"
    );
  }
  return context;
}
