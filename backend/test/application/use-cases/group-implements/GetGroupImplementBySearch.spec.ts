import { GetGroupImplementBySearch } from "../../../../src/application/use-cases/group-implements/GetGroupImplementBySearch";
import { IGroupImplementRepository } from "../../../../src/domain/interfaces/IGroupImplementRepository";
import { GroupImplementEntity } from "../../../../src/domain/entities/GroupImplementEntity";
import { GroupImplementFindDto } from "../../../../src/application/dtos/group-implements/GroupImplementFindDto";
import { GroupImplementOutputDto } from "../../../../src/application/dtos/group-implements/GroupImplementOutputDto";
import { GroupImplementMapper } from "../../../../src/application/mappers/GroupImplementMapper";
import { NotFoundError } from "../../../../src/shared/errors/DomainErrors";

describe("Caso de uso: GetGroupImplementBySearch", () => {
  let mockRepository: jest.Mocked<IGroupImplementRepository>;
  let getGroupImplementBySearch: GetGroupImplementBySearch;

  beforeEach(() => {
    mockRepository = {
      findByName: jest.fn(),
      findByPrefix: jest.fn(),
    } as unknown as jest.Mocked<IGroupImplementRepository>;

    getGroupImplementBySearch = new GetGroupImplementBySearch(mockRepository);
  });

  // Caso: búsqueda por nombre existente
  it("debería retornar el DTO cuando se busca por nombre existente", async () => {
    const entity = GroupImplementEntity.create({ id: 1, prefix: "IMP1", name: "Implemento 1", max_hours: 2, time_limit: 4 });
    mockRepository.findByName.mockResolvedValue(entity);

    const input: GroupImplementFindDto = { name: "Implemento 1" };

    const resultado: GroupImplementOutputDto[] = await getGroupImplementBySearch.execute(input);

    expect(mockRepository.findByName).toHaveBeenCalledWith("Implemento 1");
    expect(resultado).toEqual([GroupImplementMapper.toOutputDto(entity)]);
  });

  // Caso: búsqueda por prefijo existente
  it("debería retornar el DTO cuando se busca por prefijo existente", async () => {
    const entity = GroupImplementEntity.create({ id: 2, prefix: "IMP2", name: "Implemento 2", max_hours: 3, time_limit: 6 });
    mockRepository.findByPrefix.mockResolvedValue(entity);

    const input: GroupImplementFindDto = { prefix: "IMP2" };

    const resultado: GroupImplementOutputDto[] = await getGroupImplementBySearch.execute(input);

    expect(mockRepository.findByPrefix).toHaveBeenCalledWith("IMP2");
    expect(resultado).toEqual([GroupImplementMapper.toOutputDto(entity)]);
  });

  // Caso: búsqueda por nombre y prefijo existentes
  it("debería retornar DTOs cuando se proporcionan ambos criterios", async () => {
    const entityName = GroupImplementEntity.create({ id: 1, prefix: "IMP1", name: "Implemento 1", max_hours: 2, time_limit: 4 });
    const entityPrefix = GroupImplementEntity.create({ id: 2, prefix: "IMP2", name: "Implemento 2", max_hours: 3, time_limit: 6 });

    mockRepository.findByName.mockResolvedValue(entityName);
    mockRepository.findByPrefix.mockResolvedValue(entityPrefix);

    const input: GroupImplementFindDto = { name: "Implemento 1", prefix: "IMP2" };

    const resultado: GroupImplementOutputDto[] = await getGroupImplementBySearch.execute(input);

    expect(mockRepository.findByName).toHaveBeenCalledWith("Implemento 1");
    expect(mockRepository.findByPrefix).toHaveBeenCalledWith("IMP2");
    expect(resultado).toEqual([GroupImplementMapper.toOutputDto(entityName), GroupImplementMapper.toOutputDto(entityPrefix)]);
  });

  // Caso: no se proporcionan criterios
  it("debería lanzar error si no se proporcionan criterios de búsqueda", async () => {
    const input: GroupImplementFindDto = {};

    await expect(getGroupImplementBySearch.execute(input)).rejects.toThrow(
      "Se debe proporcionar al menos un criterio de búsqueda."
    );
  });

  // Caso: nombre no encontrado
  it("debería lanzar NotFoundError si el nombre no existe", async () => {
    mockRepository.findByName.mockResolvedValue(null);

    const input: GroupImplementFindDto = { name: "NoExiste" };

    await expect(getGroupImplementBySearch.execute(input)).rejects.toThrow(
      NotFoundError
    );
    expect(mockRepository.findByName).toHaveBeenCalledWith("NoExiste");
  });

  // Caso: prefijo no encontrado
  it("debería lanzar NotFoundError si el prefijo no existe", async () => {
    mockRepository.findByPrefix.mockResolvedValue(null);

    const input: GroupImplementFindDto = { prefix: "NOPFX" };

    await expect(getGroupImplementBySearch.execute(input)).rejects.toThrow(
      NotFoundError
    );
    expect(mockRepository.findByPrefix).toHaveBeenCalledWith("NOPFX");
  });
});
