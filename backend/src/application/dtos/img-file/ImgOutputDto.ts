
export interface ImgOutputDto {
  id: number | null;
  file_name: string;
  file_path: string;
  mime_type: string;
  size_bytes?: number;
  description?: string;
  instrument_id: number | null;
  uploaded_by: number | null;
  created_at?: Date;
  updated_at?: Date;
}