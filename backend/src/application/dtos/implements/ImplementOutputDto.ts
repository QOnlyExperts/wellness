import { ImplementCondition } from "../../../domain/enums/ImplementCondition";
import { ImplementStatus } from "../../../domain/enums/ImplementStatus";

// Solo incluimos los campos que la API debe exponer
export interface ImplementOutputDto {
  id: number | null;
  cod: string;
  status: ImplementStatus;
  condition: ImplementCondition;
}