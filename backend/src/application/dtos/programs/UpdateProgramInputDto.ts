// src/application/dtos/programs/UpdateProgramInputDto.ts

export interface UpdateProgramInputDto {
  name?: string;
  cod?: string;
  facult?: string;
  status?: boolean;
  date?: Date; // O string
}