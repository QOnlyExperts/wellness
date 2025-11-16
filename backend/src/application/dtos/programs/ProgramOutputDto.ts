// src/application/dtos/programs/ProgramOutputDto.ts

export interface ProgramOutputDto {
  id: number | null;
  name: string;
  cod: string;
  facult: string;
  status: boolean;
  date: Date;
}