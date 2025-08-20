export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  salutation?: string;
  email: string;
  gender: string;
  status: string;
  phone_number: string;
  role: string;
  created_at: string;
  is_super_admin?: boolean;
  id?: number;
  center_id?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  id: number;
  user_id: string;
  is_super_admin: boolean;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  status: string;
  phone_number: string;
  role: string;
  created_at: string;
  updated_at: string;
  center_id?: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
}