// Base membership interface
export interface Membership {
  membership_id: string;
  user_id: string;
  center_id: string;
  type: MembershipType;
  start_date: string;
  end_date: string;
  status: MembershipStatus;
  transaction_id: string;
  is_paused_allowed: boolean;
  max_allowed_pause_days: number;
  payment_amount: number;
  payment_method: PaymentMethod;
  additional_days: number;
  created_at: string;
  updated_at: string;
  
  // Related data
  user?: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  center?: {
    center_id: string;
    name: string;
    city: string;
  };
}

// Membership types
export type MembershipType = '1D' | '15D' | '1M' | '3M' | '6M' | '12M';
export type MembershipType = 'NA' | '1D' | '15D' | '1M' | '3M' | '6M' | '12M';

// Membership status
export type MembershipStatus = 'active' | 'expired' | 'paused' | 'cancelled';

// Payment methods
export type PaymentMethod = 'upi' | 'credit_card' | 'debit_card' | 'cash';

// Create membership data
export interface CreateMembershipData {
  user_id: string;
  type: MembershipType;
  transaction_id: string;
  is_paused_allowed: boolean;
  max_allowed_pause_days: number;
  payment_amount: number;
  payment_method: PaymentMethod;
  additional_days: number;
  is_external: 0 | 1;
  start_date?: string;
  end_date?: string;
}

// Update membership data
export interface UpdateMembershipData extends Partial<CreateMembershipData> {
  status?: MembershipStatus;
  start_date?: string;
  end_date?: string;
}

// Membership filters
export interface MembershipFilters {
  search?: string;
  status?: MembershipStatus;
  type?: MembershipType;
  payment_method?: PaymentMethod;
  start_date?: string;
  end_date?: string;
}

// Query parameters for membership API
export interface MembershipQueryParams extends MembershipFilters {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// API response types
export interface MembershipResponse {
  success: boolean;
  data: Membership;
  message?: string;
}

export interface MembershipsResponse {
  success: boolean;
  data: {
    data: Membership[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  message?: string;
}