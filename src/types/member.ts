export interface Member {
  id: number;
  user_id: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  salutation: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  status: 'active' | 'inactive' | 'pending';
  role: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  address: string;
  city: string;
  pincode: string;
  created_at: string;
  society_id: string;
  society_name: string;
  badge_score: number;
  reward_points: number;
  yoga_points: number;
  df_points: number;
  pilates_points: number;
}

export interface MemberFilters {
  society_id?: string;
  status?: string;
  gender?: string;
  verification_status?: string;
  search?: string;
}

export interface PaginatedMembersResponse {
  data: Member[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface MemberQueryParams {
  page?: number;
  limit?: number;
  society_id?: string;
  status?: string;
  gender?: string;
  verification_status?: string;
  search?: string;
}