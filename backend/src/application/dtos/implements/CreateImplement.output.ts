import { ImplementCondition } from "../../../domain/enums/ImplementCondition";
import { ImplementStatus } from "../../../domain/enums/ImplementStatus";

export interface CreateImplementInput {
  cod: string;
  status: ImplementStatus;
  condition: ImplementCondition;
}
