export interface BulkMemberUploadResponse {
  success: boolean;
  message: string;
  data?: {
    total_processed: number;
    successful_imports: number;
    failed_imports: number;
    errors?: string[];
  };
}

export interface BulkMemberUploadData {
  center_id: string;
  csv_file: File;
}