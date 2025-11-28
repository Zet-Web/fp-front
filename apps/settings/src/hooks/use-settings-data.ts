import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { FPApi } from "@/lib/api";
import { useActiveProfile } from "../../../../shared-src/profile/ActiveProfileContext";

interface UserSettings {
  timezone: string;
  theme_mode: "light" | "dark" | "system";
  members_enabled: boolean;
}

interface SettingsState {
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
}

interface TimezoneOption {
  value: string;
  label: string;
  region: string;
  city: string;
  offset: string;
}

interface GetUserSettingsResponse {
  timezone: string;
  theme_mode: string;
  members_enabled: boolean;
}

interface UpdateUserSettingsRequest {
  timezone?: string;
  theme_mode?: string;
  members_enabled?: boolean;
  profileId: string
}

// Filter out confusing or administrative timezone identifiers
function isUserFriendlyTimezone(ianaId: string): boolean {
  // Filter out administrative/legacy timezones
  const excludePrefixes = ["Etc/", "SystemV/", "posix/", "right/"];
  const excludeExact = [
    "EST",
    "HST",
    "MST",
    "PST",
    "CST",
    "AST",
    "BST",
    "CDT",
    "EDT",
    "MDT",
    "PDT",
    "Eire",
    "GB",
    "GMT",
    "Israel",
    "Jamaica",
    "ROC",
    "W-SU",
    "WET",
    "Zulu",
    "EST5EDT",
    "CST6CDT",
    "MST7MDT",
    "PST8PDT",
  ];

  // Check if timezone starts with excluded prefixes
  if (excludePrefixes.some((prefix) => ianaId.startsWith(prefix))) {
    return false;
  }

  // Check if timezone is in excluded exact matches
  if (excludeExact.includes(ianaId)) {
    return false;
  }

  return true;
}

// Generate user-friendly timezone labels using native Intl API
function getFriendlyTimezoneLabel(ianaId: string): TimezoneOption {
  try {
    const now = new Date();

    // Get UTC offset using Intl.DateTimeFormat
    const offsetFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: ianaId,
      timeZoneName: "longOffset",
    });
    const offsetParts = offsetFormatter.formatToParts(now);
    const offsetPart = offsetParts.find((part) => part.type === "timeZoneName");
    const offset = offsetPart
      ? offsetPart.value.replace("GMT", "UTC")
      : "UTC+00:00";

    // Extract region and city from IANA ID
    const parts = ianaId.split("/");
    const region = parts.length >= 2 ? parts[0] : "Unknown";
    const city =
      parts.length >= 2 ? parts[parts.length - 1].replace(/_/g, " ") : ianaId;

    // Create user-friendly label: "Region (City) UTC±XX:XX"
    const label = `${ianaId} ${offset}`;

    return {
      value: ianaId,
      label,
      region,
      city,
      offset,
    };
  } catch (error) {
    console.warn(`Failed to process timezone ${ianaId}:`, error);
    return {
      value: ianaId,
      label: ianaId,
      region: "Unknown",
      city: ianaId,
      offset: "+00:00",
    };
  }
}

export function useSettingsData(session: Session | null) {
  const {activeProfile} = useActiveProfile();

  const [settingsState, setSettingsState] = useState<SettingsState>({
    settings: null,
    isLoading: true,
    error: null,
    hasUnsavedChanges: false,
  });

  const [allTimezones, setAllTimezones] = useState<TimezoneOption[]>([]);

  useEffect(() => {
    const initializeSettingsData = async () => {
      try {
        if (typeof Intl !== "undefined" && Intl.supportedValuesOf) {
          try {
            const timezoneNames = Intl.supportedValuesOf("timeZone");
            const filteredTimezones = timezoneNames
              .filter(isUserFriendlyTimezone)
              .map(getFriendlyTimezoneLabel)
              .sort((a, b) => a.label.localeCompare(b.label));

            setAllTimezones(filteredTimezones);
          } catch (error) {
            console.error("Failed to load timezones", error);
            setAllTimezones([
              {
                value: "UTC",
                label: "UTC (Coordinated Universal Time) UTC+00:00",
                region: "UTC",
                city: "UTC",
                offset: "+00:00",
              },
              {
                value: "America/New_York",
                label: "America (New York) UTC-05:00",
                region: "America",
                city: "New York",
                offset: "-05:00",
              },
              {
                value: "Europe/London",
                label: "Europe (London) UTC+00:00",
                region: "Europe",
                city: "London",
                offset: "+00:00",
              },
            ]);
          }
        } else {
          setAllTimezones([
            {
              value: "UTC",
              label: "UTC (Coordinated Universal Time) UTC+00:00",
              region: "UTC",
              city: "UTC",
              offset: "+00:00",
            },
            {
              value: "America/New_York",
              label: "America (New York) UTC-05:00",
              region: "America",
              city: "New York",
              offset: "-05:00",
            },
            {
              value: "Europe/London",
              label: "Europe (London) UTC+00:00",
              region: "Europe",
              city: "London",
              offset: "+00:00",
            },
          ]);
        }

        await fetchUserSettings(session);
      } catch (error) {
        console.error("Failed to initialize settings system", error);
        setSettingsState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to initialize settings system",
        }));
      }
    };

    initializeSettingsData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, activeProfile]);

  const fetchUserSettings = async (session: Session | null) => {
    try {
      if (!session?.user || !activeProfile) {
        setSettingsState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Please log in to access settings",
        }));
        return;
      }

      const response = await FPApi.axios.get<GetUserSettingsResponse>(
        `/profile/settings/${activeProfile.id}`
      );
      const data = response.data;

      const userSettings: UserSettings = {
        timezone: data.timezone || "UTC",
        theme_mode:
          (data.theme_mode as "light" | "dark" | "system") || "system",
        members_enabled: data.members_enabled ?? false,
      };

      setSettingsState((prev) => ({
        ...prev,
        settings: userSettings,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setSettingsState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to load settings",
      }));
    }
  };

  const updateSettings = async (updatedData: Partial<UserSettings>) => {
    if (settingsState.settings && session?.user && activeProfile) {
      try {
        const requestBody: UpdateUserSettingsRequest = {
          profileId: activeProfile.id,
        };
        if (updatedData.timezone !== undefined) {
          requestBody.timezone = updatedData.timezone;
        }
        if (updatedData.theme_mode !== undefined) {
          requestBody.theme_mode = updatedData.theme_mode;
        }
        if (updatedData.members_enabled !== undefined) {
          requestBody.members_enabled = updatedData.members_enabled;
        }

        const response = await FPApi.axios.patch<GetUserSettingsResponse>(
          "/profile/settings",
          requestBody
        );

        setSettingsState((prev) => ({
          ...prev,
          settings: {
            timezone: response.data.timezone,
            theme_mode: response.data.theme_mode as "light" | "dark" | "system",
            members_enabled: response.data.members_enabled,
          },
          hasUnsavedChanges: false,
        }));

        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    }
    return { success: false, error: new Error("No settings or session") };
  };

  const saveChanges = async (session: Session | null) => {
    if (!settingsState.settings) {
      throw new Error("No settings to save");
    }

    try {
      if (!session?.user || !activeProfile) {
        throw new Error("Authentication required to save settings");
      }

      await FPApi.axios.patch<GetUserSettingsResponse>(
        "/profile/settings",
        {
          timezone: settingsState.settings.timezone,
          theme_mode: settingsState.settings.theme_mode,
          members_enabled: settingsState.settings.members_enabled,
          profileId: activeProfile.id,
        }
      );
    } catch (error) {
      console.error("Failed to save settings:", error);
      throw error;
    } finally {
      await fetchUserSettings(session);
      setSettingsState((prev) => ({
        ...prev,
        hasUnsavedChanges: false,
      }));
    }
  };

  const resetChanges = async (session: Session | null) => {
    await fetchUserSettings(session);
    setSettingsState((prev) => ({
      ...prev,
      hasUnsavedChanges: false,
    }));
  };

  return {
    ...settingsState,
    allTimezones,
    updateSettings,
    saveChanges,
    resetChanges,
  };
}
