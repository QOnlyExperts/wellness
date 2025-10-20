import { UpdateGroupImplement } from "../../../../src/application/use-cases/group-implements/UpdateGroupImplement";
import { IGroupImplementRepository } from "../../../../src/domain/interfaces/IGroupImplementRepository";
import { GroupImplementEntity } from "../../../../src/domain/entities/GroupImplementEntity";
import { GroupImplementInputDto } from "../../../../src/application/dtos/group-implements/GroupImplementInputDto";
import { GroupImplementOutputDto } from "../../../../src/application/dtos/group-implements/GroupImplementOutputDto";
import { GroupImplementMapper } from "../../../../src/application/mappers/GroupImplementMapper";
import { NotFoundError, DuplicateNameError, ValidationError } from "../../../../src/shared/errors/DomainErrors";

describe("Caso de uso: UpdateGroupImplement", () => {
  let mockRepository: jest.Mocked<IGroupImplementRepository>;
  let updateGroupImplement: UpdateGroupImplement;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      findByPrefix: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<IGroupImplementRepository>;

    updateGroupImplement = new UpdateGroupImplement(mockRepository);
  });

  // Caso exitoso
  it("debería actualizar un GroupImplement y retornar el DTO", async () => {
    const input: GroupImplementInputDto = {
      name: "Nuevo Nombre",
      max_hours: 5,
      time_limit: 8,
    };

    const existingEntity = GroupImplementEntity.create({
      id: 1,
      prefix: "OLD",
      name: "Anterior",
      max_hours: 2,
      time_limit: 4,
    });

    const updatedEntity = GroupImplementEntity.create({
      id: 1,
      prefix: "NUEV",
      name: "Nuevo Nombre",
      max_hours: 5,
      time_limit: 8,
    });

    mockRepository.findById.mockResolvedValue(existingEntity);
    mockRepository.findByName.mockResolvedValue(null);
    mockRepository.findByPrefix.mockResolvedValue(null);
    mockRepository.save.mockResolvedValue(updatedEntity);

    const resultado: GroupImplementOutputDto = await updateGroupImplement.execute(1, input);

    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(mockRepository.findByName).toHaveBeenCalledWith("Nuevo Nombre");
    expect(mockRepository.findByPrefix).toHaveBeenCalled(); // se llama al menos una vez
    expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      id: 1,
      name: "Nuevo Nombre",
      prefix: expect.any(String),
      max_hours: 5,
      time_limit: 8
    }));
    expect(resultado).toEqual(GroupImplementMapper.toOutputDto(updatedEntity));
  });

  // Caso: ID no encontrado
  it("debería lanzar NotFoundError si el ID no existe", async () => {
    mockRepository.findById.mockResolvedValue(null);

    const input: GroupImplementInputDto = {
      name: "Nombre",
      max_hours: 2,
      time_limit: 4
    };

    await expect(updateGroupImplement.execute(999, input)).rejects.toThrow(NotFoundError);
    expect(mockRepository.findById).toHaveBeenCalledWith(999);
  });

  // Caso: nombre duplicado
  it("debería lanzar DuplicateNameError si el nombre ya existe", async () => {
    const existingEntity = GroupImplementEntity.create({
      id: 1,
      prefix: "OLD",
      name: "Anterior",
      max_hours: 2,
      time_limit: 4,
    });

    const nameConflict = GroupImplementEntity.create({
      id: 2,
      prefix: "XYZ",
      name: "Nombre Duplicado",
      max_hours: 3,
      time_limit: 5,
    });

    mockRepository.findById.mockResolvedValue(existingEntity);
    mockRepository.findByName.mockResolvedValue(nameConflict);

    const input: GroupImplementInputDto = {
      name: "Nombre Duplicado",
      max_hours: 2,
      time_limit: 4
    };

    await expect(updateGroupImplement.execute(1, input)).rejects.toThrow(DuplicateNameError);
  });

  // Caso: prefijo no único después de 10 intentos
  it("debería lanzar ValidationError si no se puede generar un prefijo único", async () => {
    const existingEntity = GroupImplementEntity.create({
      id: 1,
      prefix: "OLD",
      name: "Anterior",
      max_hours: 2,
      time_limit: 4,
    });

    mockRepository.findById.mockResolvedValue(existingEntity);
    mockRepository.findByName.mockResolvedValue(null);
    // Simular que siempre existe el prefijo para forzar los 10 intentos
    mockRepository.findByPrefix.mockResolvedValue(existingEntity);

    const input: GroupImplementInputDto = {
      name: "Conflicto",
      max_hours: 2,
      time_limit: 4
    };

    await expect(updateGroupImplement.execute(1, input)).rejects.toThrow(ValidationError);
    expect(mockRepository.findByPrefix).toHaveBeenCalledTimes(10);
  });
});
