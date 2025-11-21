import { ImplementInputDto } from "../implements/ImplementInputDto";
import { InfoPersonOutputDto } from "../info-person/InfoPersonOutputDto";


export interface RequestOutputDto {
  id: number;
  status: string;
  created_at: Date;
  finished_at: Date;
  limited_at: Date;
  duration_hours: number;
  info_person_id: number;
  implement_id: number;
  info_person?: InfoPersonOutputDto;
  implement?: ImplementInputDto
}