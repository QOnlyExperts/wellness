import { ImplementCondition } from "../../../domain/enums/ImplementCondition";
import { ImplementStatus } from "../../../domain/enums/ImplementStatus";
import { GroupImplementInputDto } from "../group-implements/GroupImplementInputDto";
import { ImgInputDto } from "../img-file/ImgInputDto";

// Solo incluimos los campos que la API debe exponer
export interface ImplementOutputDto {
  id: number;
  cod: string;
  status: ImplementStatus;
  condition: ImplementCondition;
  imgs?: {
    id: number;
    file_name?: string;
    file_path: string;
    mime_type: string;
  }[];
  groupImplement?: GroupImplementInputDto
}