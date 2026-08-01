export type CohortStatus =
  | "draft"
  | "open"
  | "full"
  | "closed"
  | "active"
  | "completed"
  | "cancelled";

export interface CohortSchedule {
  id: string;
  cohort_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  created_at: string;
}

export interface Cohort {
  id: string;
  name: string;
  slug: string;
  course_id: string | null;
  course_type: "academic" | "general" | string;
  description?: string;
  start_date: string;
  end_date?: string;
  registration_deadline?: string;
  max_students: number;
  status: CohortStatus;
  is_visible_for_registration: boolean;
  google_meet_url?: string;
  zoom_url?: string;
  timezone: string;
  created_at: string;
  updated_at: string;

  // Joined fields for convenience
  schedules?: CohortSchedule[];
  enrolled_students_count?: number; 
  course?: {
    id: string;
    title: string;
    badge?: string;
  };
}

export interface StudentCohortAssignment {
  id: string;
  student_id: string;
  cohort_id: string;
  enrollment_id?: string;
  status: "active" | "completed" | "cancelled" | "suspended";
  assigned_at: string;
  completed_at?: string;
}
