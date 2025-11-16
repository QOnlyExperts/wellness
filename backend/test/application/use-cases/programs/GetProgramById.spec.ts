import { GetProgramById } from "../../../../src/application/use-cases/programs/GetProgramById";
import { IProgramRepository } from "../../../../src/domain/interfaces/IProgramRepository";
import { ProgramEntity } from "../../../../src/domain/entities/ProgramEntity";
import { ProgramMapper } from "../../../../src/application/mappers/ProgramMapper";
import { NotFoundError, ValidationError } from "../../../../src/shared/errors/DomainErrors";

describe("Caso de uso: GetProgramById", () => {
  let mockRepository: jest.Mocked<IProgramRepository>;
  let getProgramById: GetProgramById;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IProgramRepository>;
    
    getProgramById = new GetProgramById(mockRepository);
  });

  // Test 1: Caso exitoso
  it("debería devolver un DTO de programa si el ID existe", async () => {
    // Arrange
    const entity = ProgramEntity.create({ id: 1, name: "Ingeniería de Software", cod: "IS01", facult: "Ingenierías", status: true, date: new Date() });
    mockRepository.findById.mockResolvedValue(entity);

    // Act
    const result = await getProgramById.execute(1);

    // Assert
    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(ProgramMapper.toOutputDto(entity));
  });

  // Test 2: Caso ID no encontrado
  it("debería lanzar NotFoundError si el ID no se encuentra", async () => {
    // Arrange
    mockRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(getProgramById.execute(999)).rejects.toThrow(NotFoundError);
    expect(mockRepository.findById).toHaveBeenCalledWith(999);
  });

  // Test 3: Caso ID inválido
  it("debería lanzar ValidationError si el ID es 0 o negativo", async () => {
    // Act & Assert
    await expect(getProgramById.execute(0)).rejects.toThrow(ValidationError);
    await expect(getProgramById.execute(-10)).rejects.toThrow(ValidationError);
    
    // Assert (extra)
    expect(mockRepository.findById).not.toHaveBeenCalled();
  });
});