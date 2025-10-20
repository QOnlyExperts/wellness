import { ICategoryRepository } from "../../../domain/interfaces/ICategoryRepository";
import { CategoryOutputDto } from "../../dtos/category/CategoryOutputDto";
import { CategoryMapper } from "../../mappers/CategoryMapper";
import { NotFoundError } from "../../../shared/errors/DomainErrors";

export class GetCategory {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  public async execute(id: number): Promise<CategoryOutputDto> { // <-- Ahora no devuelve null
    const categoryEntity = await this.categoryRepository.findById(id);
    if (!categoryEntity) {
      // Lanza un error específico en lugar de devolver null
      throw new NotFoundError(`Category with id ${id} not found`);
    }
    return CategoryMapper.toOutputDto(categoryEntity);
  }
}