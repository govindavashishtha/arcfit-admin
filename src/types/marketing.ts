export interface MarketingContent {
  id: string;
  title: string;
  description: string;
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
