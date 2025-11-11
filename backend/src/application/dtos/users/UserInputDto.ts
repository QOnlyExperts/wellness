import { CreateRoleInputDto } from "../roles/CreateRoleInputDto";
import { InfoPersonInputDto } from "../info-person/InfoPersonInputDto";


export interface UserInputDto {
  id: number | null;
  email: string;
  password: string;
  salt: string;
  info_person_id: number;
  rol_id: number;
}