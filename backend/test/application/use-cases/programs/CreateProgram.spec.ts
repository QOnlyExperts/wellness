import { CreateProgram } from "../../../../src/application/use-cases/programs/CreateProgram";
import { IProgramRepository } from "../../../../src/domain/interfaces/IProgramRepository";
import { ProgramEntity } from "../../../../src/domain/entities/ProgramEntity";
import { ProgramMapper } from "../../../../src/application/mappers/ProgramMapper";
import { DuplicateNameError, ValidationError } from "../../../../src/shared/errors/DomainErrors";

describe("Caso de uso: CreateProgram", () => {
  let mockRepository: jest.Mocked<IProgramRepository>;
  let createProgram: CreateProgram;

  beforeEach(() => {
    // Mock del repositorio con los métodos que usa este caso de uso
    mockRepository = {
      findByName: jest.fn(),
      findByCod: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<IProgramRepository>;
    
    createProgram = new CreateProgram(mockRepository);
  });

  // Test 1: Caso exitoso
  it("debería crear un programa y devolver el DTO correspondiente", async () => {
    // Arrange
    const input = {
      name: "Ingeniería de Software",
      cod: "IS01",
      facult: "Ingenierías",
      status: true,
      date: new Date(),
    };
    mockRepository.findByName.mockResolvedValue(null); // No existe el nombre
    mockRepository.findByCod.mockResolvedValue(null); // No existe el código

    const entity = ProgramEntity.create({ id: 1, ...input }); // Entidad esperada con ID
    mockRepository.save.mockResolvedValue(entity);

    // Act
    const result = await createProgram.execute(input);

    // Assert
    expect(mockRepository.findByName).toHaveBeenCalledWith(input.name);
    expect(mockRepository.findByCod).toHaveBeenCalledWith(input.cod);
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toEqual(ProgramMapper.toOutputDto(entity));
  });

  // Test 2: Caso de nombre duplicado
  it("debería lanzar DuplicateNameError si el nombre del programa ya existe", async () => {
    // Arrange
    const input = { name: "Ingeniería de Software", cod: "IS01", facult: "Ingenierías", status: true, date: new Date() };
    const existingEntity = ProgramEntity.create({ id: 1, ...input });
    mockRepository.findByName.mockResolvedValue(existingEntity); // Simulamos que el nombre ya existe

    // Act & Assert
    await expect(createProgram.execute(input)).rejects.toThrow(DuplicateNameError);

    // Assert (extra)
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  // Test 3: Caso de código (cod) duplicado
  it("debería lanzar ValidationError si el código (cod) del programa ya existe", async () => {
    // Arrange
    const input = { name: "Ingeniería de Software", cod: "IS01", facult: "Ingenierías", status: true, date: new Date() };
    const existingEntity = ProgramEntity.create({ id: 2, name: "Otra Carrera", cod: "IS01", facult: "Ingenierías", status: true, date: new Date() });
    
    mockRepository.findByName.mockResolvedValue(null); // El nombre está bien
    mockRepository.findByCod.mockResolvedValue(existingEntity); // Simulamos que el código ya existe

    // Act & Assert
    await expect(createProgram.execute(input)).rejects.toThrow(ValidationError);

    // Assert (extra)
    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});