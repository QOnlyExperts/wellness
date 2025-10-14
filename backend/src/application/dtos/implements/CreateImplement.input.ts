import { ImplementCondition } from "../../../domain/enums/ImplementCondition";
import { ImplementStatus } from "../../../domain/enums/ImplementStatus";

export interface CreateImplementInputDto {

  prefix: string;
  status: ImplementStatus;
  condition: ImplementCondition;
  group_implement_id: number;
  categories_id: number;
}