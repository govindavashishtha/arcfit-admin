export interface SubscriptionPlanFeatures {
  [key: string]: string;
}

export interface SubscriptionPlan {
  id: string;
  society_id: string;
  name: string;
  type: '1D' | '15D' | '1M' | '3M' | '6M' | '12M';
  description: string;
  features: SubscriptionPlanFeatures;
  original_amount: number;
  payable_amount: number;
  pay_online: number;
  is_paused_allowed: boolean;
  max_allowed_pause_days: number;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlanQueryParams {
  page?: number;
  limit?: number;
  society_id?: string;
}

export interface PaginatedSubscriptionPlansResponse {
  items: SubscriptionPlan[];
  total: number;
}

export interface SubscriptionPlanFilters {
  type?: string;
  search?: string;
}

export interface CreateSubscriptionPlanData {
  society_id: string;
  name: string;
  type: '1D' | '15D' | '1M' | '3M' | '6M' | '12M';
  description: string;
  features: SubscriptionPlanFeatures;
  original_amount: number;
  payable_amount: number;
  pay_online: 0 | 1;
  is_paused_allowed: boolean;
  max_allowed_pause_days: number;
}

export interface UpdateSubscriptionPlanData extends Partial<CreateSubscriptionPlanData> {
  id: string;
}