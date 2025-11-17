import { GetPrograms } from "../../../../src/application/use-cases/programs/GetPrograms";
import { IProgramRepository } from "../../../../src/domain/interfaces/IProgramRepository";
import { ProgramEntity } from "../../../../src/domain/entities/ProgramEntity";
import { ProgramMapper } from "../../../../src/application/mappers/ProgramMapper";

describe("Caso de uso: GetPrograms", () => {
  let mockRepository: jest.Mocked<IProgramRepository>;
  let getPrograms: GetPrograms;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<IProgramRepository>;
    
    getPrograms = new GetPrograms(mockRepository);
  });

  // Test 1: Caso exitoso con datos
  it("debería retornar una lista de ProgramOutputDto cuando el repositorio devuelve entidades", async () => {
    // Arrange
    const entities: ProgramEntity[] = [
      ProgramEntity.create({ id: 1, name: "Ingeniería de Software", cod: "IS01", facult: "Ingenierías", status: true, date: new Date() }),
      ProgramEntity.create({ id: 2, name: "Medicina", cod: "MD01", facult: "Salud", status: true, date: new Date() }),
    ];
    mockRepository.findAll.mockResolvedValue(entities);

    // Act
    const result = await getPrograms.execute();

    // Assert
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result).toEqual(entities.map(ProgramMapper.toOutputDto));
  });

  // Test 2: Caso exitoso sin datos
  it("debería retornar un arreglo vacío cuando el repositorio no tiene entidades", async () => {
    // Arrange
    mockRepository.findAll.mockResolvedValue([]);

    // Act
    const result = await getPrograms.execute();

    // Assert
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });
});