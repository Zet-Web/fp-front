import { ProfileEducation } from "../types/education";

export const defaultEducationValue: Omit<ProfileEducation, "id"> = {
  degree_id: 0,
  degree: null,
  university_id: 0,
  university: null,
  period: "",
  start_month: "not-set",
  start_year: "not-set",
  end_month: "not-set",
  end_year: "not-set",
  is_current: false,
  description: "",
};
