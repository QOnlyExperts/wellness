import { UpdateProgram } from "../../../../src/application/use-cases/programs/UpdateProgram";
import { IProgramRepository } from "../../../../src/domain/interfaces/IProgramRepository";
import { ProgramEntity } from "../../../../src/domain/entities/ProgramEntity";
import { ProgramMapper } from "../../../../src/application/mappers/ProgramMapper";
import { NotFoundError, DuplicateNameError, ValidationError } from "../../../../src/shared/errors/DomainErrors";

describe("Caso de uso: UpdateProgram", () => {
  let mockRepository: jest.Mocked<IProgramRepository>;
  let updateProgram: UpdateProgram;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      findByCod: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<IProgramRepository>;
    
    updateProgram = new UpdateProgram(mockRepository);
  });

  // Test 1: Caso exitoso
  it("debería actualizar un programa y devolver el DTO", async () => {
    // Arrange
    const existingEntity = ProgramEntity.create({ id: 1, name: "Medicina", cod: "MD01", facult: "Salud", status: true, date: new Date() });
    const input = { name: "Medicina Veterinaria", cod: "MV01" }; // Datos para actualizar
    
    mockRepository.findById.mockResolvedValue(existingEntity); // El ID 1 existe
    mockRepository.findByName.mockResolvedValue(null); // El nuevo nombre no existe
    mockRepository.findByCod.mockResolvedValue(null); // El nuevo código no existe
    
    // Entidad esperada después de la actualización
    const updatedEntity = ProgramEntity.create({ ...existingEntity, ...input });
    mockRepository.save.mockResolvedValue(updatedEntity);

    // Act
    const result = await updateProgram.execute(1, input);

    // Assert
    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(mockRepository.findByName).toHaveBeenCalledWith(input.name);
    expect(mockRepository.findByCod).toHaveBeenCalledWith(input.cod);
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toEqual(ProgramMapper.toOutputDto(updatedEntity));
  });

  // Test 2: Caso ID no encontrado
  it("debería lanzar NotFoundError si el programa a actualizar no existe", async () => {
    // Arrange
    mockRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(updateProgram.execute(999, { name: "Test" })).rejects.toThrow(NotFoundError);
  });

  // Test 3: Caso Nombre duplicado
  it("debería lanzar DuplicateNameError si el nuevo nombre ya pertenece a otro programa", async () => {
    // Arrange
    const existingEntity = ProgramEntity.create({ id: 1, name: "Medicina", cod: "MD01", facult: "Salud", status: true, date: new Date() });
    const conflictingEntity = ProgramEntity.create({ id: 2, name: "Derecho", cod: "DE01", facult: "Ciencias Sociales", status: true, date: new Date() });
    
    mockRepository.findById.mockResolvedValue(existingEntity); // El ID 1 existe
    mockRepository.findByName.mockResolvedValue(conflictingEntity); // "Derecho" ya existe en el ID 2

    // Act & Assert
    await expect(updateProgram.execute(1, { name: "Derecho" })).rejects.toThrow(DuplicateNameError);
  });

  // Test 4: Caso Código (cod) duplicado
  it("debería lanzar ValidationError si el nuevo código ya pertenece a otro programa", async () => {
    // Arrange
    const existingEntity = ProgramEntity.create({ id: 1, name: "Medicina", cod: "MD01", facult: "Salud", status: true, date: new Date() });
    const conflictingEntity = ProgramEntity.create({ id: 2, name: "Derecho", cod: "DE01", facult: "Ciencias Sociales", status: true, date: new Date() });
    
    mockRepository.findById.mockResolvedValue(existingEntity);
    mockRepository.findByName.mockResolvedValue(null); // El nombre está bien
    mockRepository.findByCod.mockResolvedValue(conflictingEntity); // "DE01" ya existe en el ID 2

    // Act & Assert
    await expect(updateProgram.execute(1, { cod: "DE01" })).rejects.toThrow(ValidationError);
  });
});