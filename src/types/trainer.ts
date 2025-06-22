export interface Society {
  society_id: string;
  name: string;
}

export type Specialization = 'dance' | 'yoga' | 'pilates';

export interface Trainer {
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
  specialisations: string[];
  certifications: string[];
  experience_in_years: number;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  created_at: string;
  societies: Society[];
}

export interface TrainerFilters {
  specialization?: Specialization;
  status?: string;
  society_id?: string;
  search?: string;
}

export interface PaginatedTrainersResponse {
  data: Trainer[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface TrainerQueryParams {
  page?: number;
  limit?: number;
  specialization?: Specialization;
  status?: string;
  society_id?: string;
  search?: string;
}

export interface CreateTrainerData {
  first_name: string;
  last_name: string;
  salutation: string;
  email: string;
  phone_number: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  specialisations: Specialization[];
  certifications: string[];
  experience_in_years: number;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  status: 'active' | 'inactive';
  society_ids: string[];
}

export interface UpdateTrainerData extends Partial<CreateTrainerData> {
  id: number;
}