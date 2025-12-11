
export interface RegisterUserInputDto {
  email: string;
  password: string;
  // Datos de la persona
  name1: string;
  name2?: string | null;
  last_name1: string;
  last_name2?: string | null;
  identification: string;
  program_id: number;
}