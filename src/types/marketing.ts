export interface MarketingContent {
  id: string;
  title: string;
  description: string;
  link?: string;
  markdown?: string;
  bg_image: string;
  created_at: string;
  updated_at: string;
}

export interface MarketingResponse {
  success: boolean;
  data: {
    data: MarketingContent[];
  };
}

export interface CreateMarketingContent {
  center_id: string;
  title: string;
  description: string;
  link?: string;
  markdown?: string;
  bg_image: File;
}

export interface CreateMarketingResponse {
  success: boolean;
  data: MarketingContent;
}
