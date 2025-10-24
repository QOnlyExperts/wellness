
export class ImgEntity {
  public readonly id: number | null;
  public file_name?: string;
  public file_path: string;
  public mime_type: string;
  public size_bytes?: number;
  public description?: string;
  public implement_id: number | null;
  public uploaded_by: number | null;
  public created_at?: Date;
  public updated_at?: Date;


  constructor(props: {
    id: number | null,
    file_name?: string,
    file_path: string,
    mime_type: string,
    size_bytes?: number,
    description?: string,
    implement_id: number | null,
    uploaded_by: number | null,
    created_at?: Date,
    updated_at?: Date
  }) {
    this.id = props.id;
    this.file_name = props.file_name;
    this.file_path = props.file_path;
    this.mime_type = props.mime_type;
    this.size_bytes = props.size_bytes;
    this.description = props.description;
    this.implement_id = props.implement_id;
    this.uploaded_by = props.uploaded_by;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  static create(props: {
    id: number | null,
    file_name?: string,
    file_path: string,
    mime_type: string,
    size_bytes?: number,
    description?: string,
    implement_id: number | null,
    uploaded_by: number | null,
    created_at?: Date,
    updated_at?: Date

  }): ImgEntity{
    return new ImgEntity({
      id: props.id,
      file_name: props.file_name,
      file_path: props.file_path,
      mime_type: props.mime_type,
      size_bytes: props.size_bytes,
      description: props.description,
      implement_id: props.implement_id,
      uploaded_by: props.uploaded_by,
      created_at: props.created_at,
      updated_at: props.updated_at,
    });
  }
}