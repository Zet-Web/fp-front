export interface ProfileExperience {
  id: number
  title: string
  company: string
  period: string
  start_month?: string
  start_year?: string
  end_month?: string
  end_year?: string
  is_current?: boolean
  description: string
  achievements: string[]
}