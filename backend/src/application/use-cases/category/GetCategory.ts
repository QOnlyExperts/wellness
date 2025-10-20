import { ICategoryRepository } from "../../../domain/interfaces/ICategoryRepository";
import { CategoryOutputDto } from "../../dtos/category/CategoryOutputDto";
import { CategoryMapper } from "../../mappers/CategoryMapper";

export class GetCategory {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  public async execute(id: number): Promise<CategoryOutputDto | null> {
    const categoryEntity = await this.categoryRepository.findById(id);

    if (!categoryEntity) {
      return null;
    }

    // Si la encuentra, la mapea a un DTO de salida
    return CategoryMapper.toOutputDto(categoryEntity);
  }
}