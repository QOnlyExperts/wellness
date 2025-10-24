export interface ImgInputDto {
  file_name?: string;
  file_path: string;
  mime_type: string;
  size_bytes?: number;
  description?: string;
  uploaded_by: number;
}
