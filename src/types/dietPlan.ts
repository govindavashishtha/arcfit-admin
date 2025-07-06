export interface DietPlanUser {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

export interface DietPlan {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  doc_url: string;
  created_at: string;
  updated_at: string;
  user: DietPlanUser;
}

export interface DietPlanResponse {
  count: number;
  diet_plans: DietPlan[];
}

export interface CreateDietPlanData {
  user_id: string;
  start_date: string;
  end_date: string;
  diet_pdf: File;
}

export interface DietPlanQueryParams {
  user_id?: string;
}