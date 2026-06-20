export interface DayPlan {
  day: number;
  date: string;
  focus_area: string;
  topics_to_cover: string[];
  activities: string[];
  estimated_hours: number;
  week: number;
}

export interface StudyPlan {
  id?: string;
  subject: string;
  topics: string;
  exam_date: string;
  hours_per_day: number;
  days_until_exam: number;
  schedule: DayPlan[];
  created_at?: string;
}
