import { CategoryEntity } from "../../../domain/entities/CategoryEntity";
import { ICategoryRepository } from "../../../domain/interfaces/ICategoryRepository";
import { CategoryOutputDto } from "../../dtos/category/CategoryOutputDto";
import { CategoryMapper } from "../../mappers/CategoryMapper";

// DTO para la entrada de datos
export interface CreateCategoryInputDto {
  name: string;
  description?: string;
}

export class CreateCategory {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  public async execute(input: CreateCategoryInputDto): Promise<CategoryOutputDto> {
    const categoryEntity = CategoryEntity.create({
      id: 0, // ID temporal, la base de datos lo asignará
      name: input.name,
      description: input.description,
    });

    const createdCategory = await this.categoryRepository.save(categoryEntity);

    // Mapeamos la entidad guardada a un DTO de salida antes de devolverla
    return CategoryMapper.toOutputDto(createdCategory);
  }
}