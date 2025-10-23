import { UpdateCategory } from "../../../../src/application/use-cases/category/UpdateCategory";
import { ICategoryRepository } from "../../../../src/domain/interfaces/ICategoryRepository";
import { CategoryEntity } from "../../../../src/domain/entities/CategoryEntity";
import { NotFoundError, DuplicateNameError } from "../../../../src/shared/errors/DomainErrors";
import { CategoryMapper } from "../../../../src/application/mappers/CategoryMapper";

describe("Caso de uso: UpdateCategory", () => {
  let mockRepository: jest.Mocked<ICategoryRepository>;
  let updateCategory: UpdateCategory;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<ICategoryRepository>;
    updateCategory = new UpdateCategory(mockRepository);
  });

  // Caso exitoso
  it("debería actualizar una categoría y devolver el DTO", async () => {
    const existingEntity = CategoryEntity.create({ id: 1, name: "Vientos", description: "" });
    const input = { name: "Instrumentos de Viento" };
    
    mockRepository.findById.mockResolvedValue(existingEntity);
    mockRepository.findByName.mockResolvedValue(null); // El nuevo nombre no existe
    
    const updatedEntity = CategoryEntity.create({ ...existingEntity, ...input });
    mockRepository.save.mockResolvedValue(updatedEntity);

    const result = await updateCategory.execute(1, input);

    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(mockRepository.findByName).toHaveBeenCalledWith(input.name);
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toEqual(CategoryMapper.toOutputDto(updatedEntity));
  });

  // Caso: ID no encontrado
  it("debería lanzar NotFoundError si la categoría a actualizar no existe", async () => {
    mockRepository.findById.mockResolvedValue(null);
    await expect(updateCategory.execute(999, { name: "Test" })).rejects.toThrow(NotFoundError);
  });

  // Caso: Nombre duplicado
  it("debería lanzar DuplicateNameError si el nuevo nombre ya pertenece a otra categoría", async () => {
    const existingEntity = CategoryEntity.create({ id: 1, name: "Vientos", description: "" });
    const conflictingEntity = CategoryEntity.create({ id: 2, name: "Percusión", description: "" });
    
    mockRepository.findById.mockResolvedValue(existingEntity);
    mockRepository.findByName.mockResolvedValue(conflictingEntity); // El nombre ya existe en otro ID

    await expect(updateCategory.execute(1, { name: "Percusión" })).rejects.toThrow(DuplicateNameError);
  });
});