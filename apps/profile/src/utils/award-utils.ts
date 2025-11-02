import { ProfileAward } from "../types/awards";

export const defaultAwardValue: Omit<ProfileAward, "id"> = {
  title: "",
  issuer: "",
  date: "",
  description: "",
};
