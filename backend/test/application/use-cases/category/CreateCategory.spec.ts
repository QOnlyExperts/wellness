import { CreateCategory } from "../../../../src/application/use-cases/category/CreateCategory";
import { ICategoryRepository } from "../../../../src/domain/interfaces/ICategoryRepository";
import { CategoryEntity } from "../../../../src/domain/entities/CategoryEntity";
import { DuplicateNameError } from "../../../../src/shared/errors/DomainErrors";
import { CategoryMapper } from "../../../../src/application/mappers/CategoryMapper";

describe("Caso de uso: CreateCategory", () => {
  let mockRepository: jest.Mocked<ICategoryRepository>;
  let createCategory: CreateCategory;

  beforeEach(() => {
    mockRepository = {
      findByName: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<ICategoryRepository>;
    createCategory = new CreateCategory(mockRepository);
  });

  // Caso exitoso
  it("debería crear una categoría y devolver el DTO correspondiente", async () => {
    const input = { name: "Instrumentos de Cuerda", description: "Guitarras, bajos, etc." };
    mockRepository.findByName.mockResolvedValue(null); // No existe previamente

    const entity = CategoryEntity.create({ id: 1, ...input });
    mockRepository.save.mockResolvedValue(entity);

    const result = await createCategory.execute(input);

    expect(mockRepository.findByName).toHaveBeenCalledWith(input.name);
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toEqual(CategoryMapper.toOutputDto(entity));
  });

  // Caso de nombre duplicado
  it("debería lanzar DuplicateNameError si el nombre de la categoría ya existe", async () => {
    const input = { name: "Instrumentos de Cuerda" };
    const existingEntity = CategoryEntity.create({ id: 1, ...input, description: "" });

    mockRepository.findByName.mockResolvedValue(existingEntity); // Simula que ya existe

    await expect(createCategory.execute(input)).rejects.toThrow(DuplicateNameError);

    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});