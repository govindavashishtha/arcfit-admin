export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

export interface Membership {
  membership_id: string;
  user_id: string;
  type: '1D' | '15D' | '1M' | '3M' | '6M' | '12M';
  start_date: string;
  end_date: string;
  transaction_id: string;
  is_paused_allowed: boolean;
  max_allowed_pause_days: number;
  pause_end_date: string | null;
  status: 'active' | 'inactive' | 'expired' | 'paused';
  payment_amount: number;
  payment_method: 'credit_card' | 'upi' | 'debit_card' | 'cash';
  created_at: string;
  updated_at: string;
  user: User;
}

export interface CreateMembershipData {
  user_id: string;
  type: '1D' | '15D' | '1M' | '3M' | '6M' | '12M';
  transaction_id: string;
  is_paused_allowed: boolean;
  max_allowed_pause_days: number;
  payment_amount: number;
  payment_method: 'credit_card' | 'upi' | 'debit_card' | 'cash';
}

export interface MembershipQueryParams {
  page?: number;
  limit?: number;
  society_id?: string;
  type?: string;
  status?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
}

export interface MembershipFilters {
  status?: string;
  type?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
}

export interface PaginatedMembershipsResponse {
  data: Membership[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}