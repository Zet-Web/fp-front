export interface ProfileEducation {
  id: number;
  degree: Option | null;
  degree_id: number;
  university: Option | null;
  university_id: number;
  period: string;
  start_month?: string;
  start_year?: string;
  end_month?: string;
  end_year?: string;
  is_current?: boolean;
  description: string;
}

type Option = {
  id: number;
  name: string;
};
