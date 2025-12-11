import { ImplementCondition } from "../../../domain/enums/ImplementCondition";
import { ImplementStatus } from "../../../domain/enums/ImplementStatus";
import { ImgInputDto } from "../img-file/ImgInputDto";

export interface ImplementInputDto {

  prefix: string;
  name: string;
  status: ImplementStatus;
  condition: ImplementCondition;
  group_implement_id: number;
  categories_id: number;
  user_id: number;
  amount: number;
  imgs?: ImgInputDto[]; // o img si solo es una
}