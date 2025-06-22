export interface Membership {
  id: string;
  user_id: string;
  type: '15D' | '1M' | '3M' | '6M' | '12M';
  transaction_id: string;
  is_paused_allowed: boolean;
  max_allowed_pause_days: number;
  payment_amount: number;
  payment_method: 'credit_card' | 'upi' | 'debit_card' | 'cash';
  created_at: string;
  status: string;
}

export interface CreateMembershipData {
  user_id: string;
  type: '15D' | '1M' | '3M' | '6M' | '12M';
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