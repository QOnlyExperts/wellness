import { ICategoryRepository } from "../../../domain/interfaces/ICategoryRepository";
import { CategoryOutputDto } from "../../dtos/category/CategoryOutputDto";
import { CategoryMapper } from "../../mappers/CategoryMapper";
import { NotFoundError, ValidationError } from "../../../shared/errors/DomainErrors";

export class GetCategoryById {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  public async execute(id: number): Promise<CategoryOutputDto> {
    // 1. Validar la entrada
    if (!id || id <= 0) {
      throw new ValidationError("El ID de la categoría no es válido.");
    }

    // 2. Buscar la entidad
    const categoryEntity = await this.categoryRepository.findById(id);
    if (!categoryEntity) {
      throw new NotFoundError(`La categoria no fue encontrada.`);
    }

    // 3. Mapear y devolver el DTO
    return CategoryMapper.toOutputDto(categoryEntity);
  }
}