import { GetCategoryById } from "../../../../src/application/use-cases/category/GetCategoryById";
import { ICategoryRepository } from "../../../../src/domain/interfaces/ICategoryRepository";
import { CategoryEntity } from "../../../../src/domain/entities/CategoryEntity";
import { CategoryMapper } from "../../../../src/application/mappers/CategoryMapper";
import { NotFoundError, ValidationError } from "../../../../src/shared/errors/DomainErrors";

describe("Caso de uso: GetCategoryById", () => {
  let mockRepository: jest.Mocked<ICategoryRepository>;
  let getCategoryById: GetCategoryById;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<ICategoryRepository>;
    getCategoryById = new GetCategoryById(mockRepository);
  });

  // Caso exitoso
  it("debería devolver un DTO de categoría si el ID existe", async () => {
    const entity = CategoryEntity.create({ id: 1, name: "Guitarras", description: "De 6 y 12 cuerdas" });
    mockRepository.findById.mockResolvedValue(entity);

    const result = await getCategoryById.execute(1);

    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(CategoryMapper.toOutputDto(entity));
  });

  // Caso: ID no encontrado
  it("debería lanzar NotFoundError si el ID no se encuentra en el repositorio", async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(getCategoryById.execute(999)).rejects.toThrow(NotFoundError);
  });

  // Caso: ID inválido
  it("debería lanzar ValidationError si el ID es 0 o negativo", async () => {
    await expect(getCategoryById.execute(0)).rejects.toThrow(ValidationError);
    await expect(getCategoryById.execute(-10)).rejects.toThrow(ValidationError);
    
    // Asegurarse de que no se llamó al repositorio si el ID es inválido
    expect(mockRepository.findById).not.toHaveBeenCalled();
  });
});