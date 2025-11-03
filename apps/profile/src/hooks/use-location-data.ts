import { useCallback, Dispatch, SetStateAction } from "react";
import { LocationItem, LocationTypeEnum } from "../types/location";
import { UserProfile } from "../types/profile";
import { FPApi } from "@/lib/api";

interface UseLocationDataProps {
  user: UserProfile | null;
  cities: LocationItem[];
  setCities: Dispatch<SetStateAction<LocationItem[]>>;
  countries: LocationItem[];
  setCountries: Dispatch<SetStateAction<LocationItem[]>>;
}

interface UseLocationDataReturn {
  cities: LocationItem[];
  countries: LocationItem[];
  addLocation: (location: LocationItem) => boolean;
  removeLocation: (location: LocationItem) => void;
  clearAllLocations: () => void;
  getAllLocations: () => LocationItem[];
  getFormattedLocationString: () => string;
  handleSaveLocation: () => Promise<void>;
}

export function useLocationData({
  user,
  cities,
  setCities,
  countries,
  setCountries,
}: UseLocationDataProps): UseLocationDataReturn {
  const getAllLocations = useCallback((): LocationItem[] => {
    return [...cities, ...countries];
  }, [cities, countries]);

  const addLocation = useCallback(
    (location: LocationItem): boolean => {
      const currentLocations = getAllLocations();

      if (currentLocations.length >= 3) {
        return false;
      }

      const exists = currentLocations.some(
        (loc) => loc.type === location.type && loc.id === location.id
      );

      if (exists) {
        return false;
      }

      if (location.type === LocationTypeEnum.city) {
        setCities((prev) => [...prev, location]);
      } else {
        setCountries((prev) => [...prev, location]);
      }

      return true;
    },
    [getAllLocations, setCities, setCountries]
  );

  const removeLocation = useCallback(
    (location: LocationItem) => {
      if (location.type === LocationTypeEnum.city) {
        setCities((prev) => prev.filter((c) => c.id !== location.id));
      } else {
        setCountries((prev) => prev.filter((c) => c.id !== location.id));
      }
    },
    [setCities, setCountries]
  );

  const clearAllLocations = useCallback(() => {
    setCities([]);
    setCountries([]);
  }, [setCities, setCountries]);

  const handleSaveLocation = async () => {
    if (
      user &&
      JSON.stringify(user.cities) === JSON.stringify(cities) &&
      JSON.stringify(user.countries) === JSON.stringify(countries)
    ) {
      console.log("no need to save");
      return;
    }

    await FPApi.axios.patch('/location/update', {newLocations: getAllLocations()})
  };

  const getFormattedLocationString = useCallback((): string => {
    const allLocations = [...cities, ...countries];

    if (allLocations.length === 0) {
      return "";
    }

    return allLocations.map((loc) => loc.name).join(", ");
  }, [cities, countries]);

  return {
    cities,
    countries,
    addLocation,
    removeLocation,
    clearAllLocations,
    getAllLocations,
    getFormattedLocationString,
    handleSaveLocation,
  };
}
