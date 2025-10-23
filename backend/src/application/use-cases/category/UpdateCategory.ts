import { ICategoryRepository } from "../../../domain/interfaces/ICategoryRepository";
import { CategoryOutputDto } from "../../dtos/category/CategoryOutputDto";
import { CategoryMapper } from "../../mappers/CategoryMapper";
import { NotFoundError, DuplicateNameError } from "../../../shared/errors/DomainErrors";
import { UpdateCategoryInputDto } from "../../dtos/category/CategoryInputDto";

export class UpdateCategory {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  public async execute(
    id: number,
    dataToUpdate: UpdateCategoryInputDto
  ): Promise<CategoryOutputDto> {
    // 1. Asegurarse de que la categoría que se quiere editar exista
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new NotFoundError(`Category with id ${id} not found`);
    }

    // 2. Si se está cambiando el nombre, verificar que no esté duplicado
    if (dataToUpdate.name) {
      const anotherCategoryWithSameName = await this.categoryRepository.findByName(dataToUpdate.name);
      // Si existe otra categoría con ese nombre Y TIENE UN ID DIFERENTE, es un error
      if (anotherCategoryWithSameName && anotherCategoryWithSameName.id !== id) {
        throw new DuplicateNameError(`A category with the name "${dataToUpdate.name}" already exists.`);
      }
    }

    // 3. Aplicar los cambios y guardar
    Object.assign(existingCategory, dataToUpdate);
    const updatedCategory = await this.categoryRepository.save(existingCategory);

    // 4. Mapear y devolver el DTO
    return CategoryMapper.toOutputDto(updatedCategory);
  }
}