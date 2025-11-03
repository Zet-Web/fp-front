import { ProfileExperience } from "../types/experience";

export const defaultExperienceValue: Omit<ProfileExperience, "id"> = {
  title: "",
  company: "",
  period: "",
  start_month: "not-set",
  start_year: "not-set",
  end_month: "not-set",
  end_year: "not-set",
  is_current: false,
  description: "",
  achievements: [""],
};
