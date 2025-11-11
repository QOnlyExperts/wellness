import { CreateRoleInputDto } from "../roles/CreateRoleInputDto";
import { InfoPersonInputDto } from "../info-person/InfoPersonInputDto";

export interface UserOutputDto {
  id: number | null;
  email: string;
  is_verified: boolean;
  is_active: boolean;
  last_login?: Date | null;
  info_person?: InfoPersonInputDto;
  role?: CreateRoleInputDto;
}