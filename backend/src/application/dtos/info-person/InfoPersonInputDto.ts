import { CreateProgramInputDto } from "../../schemas/ProgramSchema";


export interface InfoPersonInputDto {
  id: number | null;
  name1: string;
  name2?: string | null;
  last_name1: string;
  last_name2?: string | null;
  identification: string;
  program_id: number;
  program?: CreateProgramInputDto;

}