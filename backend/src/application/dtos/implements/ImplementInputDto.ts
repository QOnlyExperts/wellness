import { ImplementCondition } from "../../../domain/enums/ImplementCondition";
import { ImplementStatus } from "../../../domain/enums/ImplementStatus";
import { ImgEntity } from "../../../domain/entities/ImgEntity";

export interface ImplementInputDto {

  prefix: string;
  status: ImplementStatus;
  condition: ImplementCondition;
  group_implement_id: number;
  categories_id: number;
  img: ImgEntity
}