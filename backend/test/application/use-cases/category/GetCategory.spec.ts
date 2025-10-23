import { GetCategory } from "../../../../src/application/use-cases/category/GetCategory";
import { ICategoryRepository } from "../../../../src/domain/interfaces/ICategoryRepository";
import { CategoryEntity } from "../../../../src/domain/entities/CategoryEntity";
import { NotFoundError } from "../../../../src/shared/errors/DomainErrors";
import { CategoryMapper } from "../../../../src/application/mappers/CategoryMapper";

describe("Caso de uso: GetCategory", () => {
  let mockRepository: jest.Mocked<ICategoryRepository>;
  let getCategory: GetCategory;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<ICategoryRepository>;
    getCategory = new GetCategory(mockRepository);
  });

  // Caso exitoso
  it("debería devolver un DTO de categoría si el ID existe", async () => {
    const entity = CategoryEntity.create({ id: 1, name: "Teclados", description: "Pianos y sintetizadores" });
    mockRepository.findById.mockResolvedValue(entity);

    const result = await getCategory.execute(1);

    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(CategoryMapper.toOutputDto(entity));
  });

  // Caso: ID no encontrado
  it("debería lanzar NotFoundError si el ID no se encuentra", async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(getCategory.execute(999)).rejects.toThrow(NotFoundError);
    expect(mockRepository.findById).toHaveBeenCalledWith(999);
  });
});