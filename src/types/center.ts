export interface Center {
  center_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  longitude: string;
  latitude: string;
  facilities: string[];
  event_types: string[];
  morning_start_time: string;
  morning_end_time: string;
  evening_start_time: string;
  evening_end_time: string;
  multimedia_detail: string[];
  multimedia_listing_page: string[];
  meta_data?: {
    contact_person: string;
    phone: string;
    email: string;
  };
}

export interface CreateCenterData {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  longitude: string;
  latitude: string;
  facilities: string;
  event_types: string;
  meta_data: string;
  morning_start_time: string;
  morning_end_time: string;
  evening_start_time: string;
  evening_end_time: string;
  detail_files?: File[];
  listing_files?: File[];
}

export interface UpdateCenterData extends Partial<CreateCenterData> {
  center_id: string;
}