import { CreateGroupImplement } from "../../../../src/application/use-cases/group-implements/CreateGroupImplement";
import { IGroupImplementRepository } from "../../../../src/domain/interfaces/IGroupImplementRepository";
import { GroupImplementEntity } from "../../../../src/domain/entities/GroupImplementEntity";
import { DuplicateNameError } from "../../../../src/shared/errors/DomainErrors";

describe("CreateGroupImplement Use Case", () => {
  let mockRepository: jest.Mocked<IGroupImplementRepository>;
  let createGroupImplement: CreateGroupImplement;

  beforeEach(() => {
    // Creamos un mock del repositorio con los métodos usados por el caso de uso
    mockRepository = {
      findByName: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<IGroupImplementRepository>;

    createGroupImplement = new CreateGroupImplement(mockRepository);
  });

  // Caso exitoso
  it("debería crear un grupo de implementos con los valores proporcionados", async () => {
    // Arrange
    const input = {
      name: "Guitarra Acústica",
      max_hours: 2,
      time_limit: 4,
    };

    // findByName devuelve null → no existe aún
    mockRepository.findByName.mockResolvedValue(null);

    // Entidad esperada
    const expectedEntity = GroupImplementEntity.create({
      id: null,
      prefix: "GUIA",
      name: "Guitarra Acústica",
      max_hours: 2,
      time_limit: 4,
    });

    mockRepository.save.mockResolvedValue(expectedEntity);

    // Act
    const result = await createGroupImplement.execute(input);

    // Assert
    expect(mockRepository.findByName).toHaveBeenCalledWith("Guitarra Acústica");
    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        prefix: "GUIA",
        name: "Guitarra Acústica",
      })
    );
    expect(result).toEqual(expectedEntity);
  });

  // Caso de nombre duplicado
  it("debería lanzar un DuplicateNameError si el nombre ya existe", async () => {
    const input = {
      name: "Micrófono",
      max_hours: 2,
      time_limit: 4,
    };

    // findByName devuelve una entidad existente
    mockRepository.findByName.mockResolvedValue(
      GroupImplementEntity.create({
        id: null,
        prefix: "MIC",
        name: "Micrófono",
        max_hours: 2,
        time_limit: 4,
      })
    );

    await expect(createGroupImplement.execute(input)).rejects.toThrow(
      DuplicateNameError
    );

    expect(mockRepository.findByName).toHaveBeenCalledWith("Micrófono");
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  // Caso de validación de prefijo para múltiples palabras
  it("debería generar un prefijo combinando la primera y segunda palabra", async () => {
    const input = {
      name: "Batería Eléctrica",
      max_hours: 2,
      time_limit: 4,
    };

    mockRepository.findByName.mockResolvedValue(null);

    const expectedEntity = GroupImplementEntity.create({
      id: null,
      prefix: "BATE",
      name: "Batería Eléctrica",
      max_hours: 2,
      time_limit: 4,
    });

    mockRepository.save.mockResolvedValue(expectedEntity);

    const result = await createGroupImplement.execute(input);

    expect(result.prefix).toBe("BATE");
  });

  // Caso límite: nombre con una sola palabra
  it("debería generar un prefijo de 3 letras si solo tiene una palabra", async () => {
    const input = {
      name: "Tambor",
      max_hours: 1,
      time_limit: 3,
    };

    mockRepository.findByName.mockResolvedValue(null);

    const expectedEntity = GroupImplementEntity.create({
      id: null,
      prefix: "TAM",
      name: "Tambor",
      max_hours: 1,
      time_limit: 3,
    });

    mockRepository.save.mockResolvedValue(expectedEntity);

    const result = await createGroupImplement.execute(input);

    expect(result.prefix).toBe("TAM");
  });
});
