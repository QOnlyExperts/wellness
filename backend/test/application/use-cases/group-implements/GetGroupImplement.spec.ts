import { GetGroupImplements } from "../../../../src/application/use-cases/group-implements/GetGroupImplements";
import { IGroupImplementRepository } from "../../../../src/domain/interfaces/IGroupImplementRepository";
import { GroupImplementEntity } from "../../../../src/domain/entities/GroupImplementEntity";
import { GroupImplementOutputDto } from "../../../../src/application/dtos/group-implements/GroupImplementOutputDto";
import { GroupImplementMapper } from "../../../../src/application/mappers/GroupImplementMapper";

describe("Caso de uso: GetGroupImplements", () => {
  let mockRepository: jest.Mocked<IGroupImplementRepository>;
  let getGroupImplements: GetGroupImplements;

  beforeEach(() => {
    // 🔹 Creamos un mock del repositorio con los métodos usados por el caso de uso
    mockRepository = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<IGroupImplementRepository>;

    getGroupImplements = new GetGroupImplements(mockRepository);
  });

  // Caso exitoso: retorna una lista de DTOs
  it("debería retornar una lista de GroupImplementOutputDto cuando el repositorio devuelve entidades", async () => {
    // Arrange
    const entities: GroupImplementEntity[] = [
      GroupImplementEntity.create({ id: 1, prefix: "IMP1", name: "Implemento 1", max_hours: 2, time_limit: 4 }),
      GroupImplementEntity.create({ id: 2, prefix: "IMP2", name: "Implemento 2", max_hours: 3, time_limit: 6 }),
    ];

    mockRepository.findAll.mockResolvedValue(entities);

    // Act
    const resultado: GroupImplementOutputDto[] = await getGroupImplements.execute();

    // Assert
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    expect(resultado).toHaveLength(2);
    expect(resultado).toEqual(entities.map(GroupImplementMapper.toOutputDto));
  });

  // Caso límite: el repositorio no devuelve entidades
  it("debería retornar un arreglo vacío cuando el repositorio no tiene entidades", async () => {
    mockRepository.findAll.mockResolvedValue([]);

    const resultado: GroupImplementOutputDto[] = await getGroupImplements.execute();

    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual([]);
  });

  // Caso de error: el repositorio lanza una excepción
  it("debería propagar los errores lanzados por el repositorio", async () => {
    const error = new Error("Fallo en el repositorio");
    mockRepository.findAll.mockRejectedValue(error);

    await expect(getGroupImplements.execute()).rejects.toThrow("Fallo en el repositorio");
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
