// src/application/dtos/category/CategoryInputDto.ts

export interface CreateCategoryInputDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryInputDto {
  name?: string;
  description?: string;
}