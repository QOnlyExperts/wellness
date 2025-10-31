import { ImplementCondition } from "../../../domain/enums/ImplementCondition";
import { ImplementStatus } from "../../../domain/enums/ImplementStatus";
import { ImgInputDto } from "../img-file/ImgInputDto";

// Solo incluimos los campos que la API debe exponer
export interface ImplementOutputDto {
  id: number | null;
  cod: string;
  status: ImplementStatus;
  condition: ImplementCondition;
  imgs?: {
    id: number | null;
    file_name?: string;
    file_path: string;
    mime_type: string;
  }[];
  groupImplement: {
    id: number | null;
    prefix: string;
    name: string;
    max_hours: number;
    time_limit: number;
  }
}