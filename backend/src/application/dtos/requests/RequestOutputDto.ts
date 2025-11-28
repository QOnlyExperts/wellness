import { ImplementInputDto } from "../implements/ImplementInputDto";
import { InfoPersonOutputDto } from "../info-person/InfoPersonOutputDto";


export interface RequestOutputDto {
  id: number;
  status: string;
  created_at: string;      // ISO UTC
  finished_at: string | null;
  limited_at: string | null;
  duration_hours: number;
  info_person_id: number;
  implement_id: number;
  info_person?: InfoPersonOutputDto;
  implement?: ImplementInputDto;
}