import { CategoryEntity } from "../../../domain/entities/CategoryEntity";
import { ICategoryRepository } from "../../../domain/interfaces/ICategoryRepository";
import { CategoryOutputDto } from "../../dtos/category/CategoryOutputDto";
import { CategoryMapper } from "../../mappers/CategoryMapper";
import { DuplicateNameError } from "../../../shared/errors/DomainErrors";

export interface CreateCategoryInputDto {
  name: string;
  description?: string;
}

export class CreateCategory {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  public async execute(input: CreateCategoryInputDto): Promise<CategoryOutputDto> {
    // 1. Verificar si ya existe una categoría con ese nombre
    const existingCategory = await this.categoryRepository.findByName(input.name);
    if (existingCategory) {
      throw new DuplicateNameError(`A category with the name "${input.name}" already exists.`);
    }

    // 2. Si no existe, crear la entidad
    const categoryEntity = CategoryEntity.create({
      id: 0, // ID temporal
      name: input.name,
      description: input.description,
    });

    // 3. Guardar y mapear la respuesta
    const createdCategory = await this.categoryRepository.save(categoryEntity);
    return CategoryMapper.toOutputDto(createdCategory);
  }
}