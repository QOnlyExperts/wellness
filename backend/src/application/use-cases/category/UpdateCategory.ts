import { ICategoryRepository } from "../../../domain/interfaces/ICategoryRepository";
import { CategoryOutputDto } from "../../dtos/category/CategoryOutputDto";
import { CategoryMapper } from "../../mappers/CategoryMapper";

export interface UpdateCategoryInputDto {
  name?: string;
  description?: string;
}

export class UpdateCategory {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  public async execute(
    id: number,
    dataToUpdate: UpdateCategoryInputDto
  ): Promise<CategoryOutputDto> {
    const existingCategory = await this.categoryRepository.findById(id);

    if (!existingCategory) {
      throw new Error(`Category with id ${id} not found`);
    }

    // Actualiza las propiedades de la entidad
    Object.assign(existingCategory, dataToUpdate);

    const updatedCategory = await this.categoryRepository.save(existingCategory);

    // Mapea la entidad actualizada a un DTO de salida
    return CategoryMapper.toOutputDto(updatedCategory);
  }
}