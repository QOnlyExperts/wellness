// src/application/dtos/programs/CreateProgramInputDto.ts

export interface CreateProgramInputDto {
  name: string;
  cod: string;
  facult: string;
  status: boolean;
  date: Date; // O string, si prefieres convertirlo en el caso de uso
}