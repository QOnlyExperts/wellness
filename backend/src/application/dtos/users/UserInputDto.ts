import { CreateRoleInputDto } from "../roles/CreateRoleInputDto";
import { InfoPersonInputDto } from "../info-person/InfoPersonInputDto";


export interface UserInputDto {
  id: number | null;
  email: string;
  password: string;
  salt: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  last_login?: Date | null;
  info_person?: InfoPersonInputDto;
}