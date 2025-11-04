import { ImplementCondition } from "../../../domain/enums/ImplementCondition";
import { ImplementStatus } from "../../../domain/enums/ImplementStatus";
import { ImgInputDto } from "../img-file/ImgInputDto";

export interface ImplementUpdateDto {
  id?: number;
  status?: ImplementStatus;
  condition?: ImplementCondition;
  imgs?: ImgInputDto[];
}