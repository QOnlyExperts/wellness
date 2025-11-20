import { ImplementInputDto } from "../implements/ImplementInputDto";


export interface RequestOutputDto {
  id: number;
  status: string;
  created_at: Date;
  finished_at: Date;
  limited_at: Date;
  info_person_id: number;
  implement_id: number;
  implement?: ImplementInputDto
}