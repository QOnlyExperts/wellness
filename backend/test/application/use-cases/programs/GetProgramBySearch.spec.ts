import { GetProgramBySearch } from "../../../../src/application/use-cases/programs/GetProgramBySearch";
import { IProgramRepository } from "../../../../src/domain/interfaces/IProgramRepository";
import { ProgramEntity } from "../../../../src/domain/entities/ProgramEntity";
import { ProgramMapper } from "../../../../src/application/mappers/ProgramMapper";
import { NotFoundError, ValidationError } from "../../../../src/shared/errors/DomainErrors";

describe("Caso de uso: GetProgramBySearch", () => {
  let mockRepository: jest.Mocked<IProgramRepository>;
  let getProgramBySearch: GetProgramBySearch;

  beforeEach(() => {
    mockRepository = {
      findByName: jest.fn(),
      findByCod: jest.fn(),
      // findByFacult: jest.fn(), // Descomentar si se implementa
    } as unknown as jest.Mocked<IProgramRepository>;
    
    getProgramBySearch = new GetProgramBySearch(mockRepository);
  });

  // Test 1: Caso exitoso por nombre
  it("debería devolver una lista de programas al buscar por nombre", async () => {
    // Arrange
    const entity = ProgramEntity.create({ id: 1, name: "Ingeniería de Software", cod: "IS01", facult: "Ingenierías", status: true, date: new Date() });
    mockRepository.findByName.mockResolvedValue(entity);

    // Act
    const result = await getProgramBySearch.execute({ name: "Ingeniería de Software" });

    // Assert
    expect(mockRepository.findByName).toHaveBeenCalledWith("Ingeniería de Software");
    expect(result).toHaveLength(1);
    expect(result).toEqual([ProgramMapper.toOutputDto(entity)]);
  });

  // Test 2: Caso exitoso por código
  it("debería devolver una lista de programas al buscar por código", async () => {
    // Arrange
    const entity = ProgramEntity.create({ id: 1, name: "Ingeniería de Software", cod: "IS01", facult: "Ingenierías", status: true, date: new Date() });
    mockRepository.findByCod.mockResolvedValue(entity);

    // Act
    const result = await getProgramBySearch.execute({ cod: "IS01" });

    // Assert
    expect(mockRepository.findByCod).toHaveBeenCalledWith("IS01");
    expect(result).toHaveLength(1);
    expect(result).toEqual([ProgramMapper.toOutputDto(entity)]);
  });

  // Test 3: Caso sin criterios de búsqueda
  it("debería lanzar ValidationError si no se proporciona ningún criterio", async () => {
    // Arrange
    const input = {}; // Sin criterios

    // Act & Assert
    await expect(getProgramBySearch.execute(input)).rejects.toThrow(ValidationError);
  });

  // Test 4: Caso no encontrado
  it("debería lanzar NotFoundError si no se encuentra ningún programa", async () => {
    // Arrange
    mockRepository.findByName.mockResolvedValue(null);
    const input = { name: "Inexistente" };

    // Act & Assert
    await expect(getProgramBySearch.execute(input)).rejects.toThrow(NotFoundError);
  });
});