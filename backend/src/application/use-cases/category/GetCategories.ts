import { ICategoryRepository } from "../../../domain/interfaces/ICategoryRepository";
import { CategoryOutputDto } from "../../dtos/category/CategoryOutputDto";
import { CategoryMapper } from "../../mappers/CategoryMapper";

export class GetCategories {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  public async execute(): Promise<CategoryOutputDto[]> {
    const categoryEntities = await this.categoryRepository.findAll();
    
    // Mapear cada entidad a su DTO correspondiente
    return categoryEntities.map((entity) => CategoryMapper.toOutputDto(entity));
  }
}