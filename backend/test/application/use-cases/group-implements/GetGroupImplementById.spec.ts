import { GetGroupImplementById } from "../../../../src/application/use-cases/group-implements/GetGroupImplementById";
import { IGroupImplementRepository } from "../../../../src/domain/interfaces/IGroupImplementRepository";
import { GroupImplementEntity } from "../../../../src/domain/entities/GroupImplementEntity";
import { GroupImplementOutputDto } from "../../../../src/application/dtos/group-implements/GroupImplementOutputDto";
import { GroupImplementMapper } from "../../../../src/application/mappers/GroupImplementMapper";
import { NotFoundError, ValidationError } from "../../../../src/shared/errors/DomainErrors";

describe("Caso de uso: GetGroupImplementById", () => {
  let mockRepository: jest.Mocked<IGroupImplementRepository>;
  let getGroupImplementById: GetGroupImplementById;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IGroupImplementRepository>;

    getGroupImplementById = new GetGroupImplementById(mockRepository);
  });

  // Caso exitoso: ID válido y existente
  it("debería retornar un DTO cuando el ID existe", async () => {
    const entity = GroupImplementEntity.create({ id: 1, prefix: "IMP1", name: "Implemento 1", max_hours: 2, time_limit: 4 });
    mockRepository.findById.mockResolvedValue(entity);

    const resultado: GroupImplementOutputDto = await getGroupImplementById.execute(1);

    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(resultado).toEqual(GroupImplementMapper.toOutputDto(entity));
  });

  // Caso: ID inválido (0 o negativo)
  it("debería lanzar ValidationError si el ID es inválido", async () => {
    await expect(getGroupImplementById.execute(0)).rejects.toThrow(ValidationError);
    await expect(getGroupImplementById.execute(-5)).rejects.toThrow(ValidationError);
    await expect(getGroupImplementById.execute(NaN)).rejects.toThrow(ValidationError);

    expect(mockRepository.findById).not.toHaveBeenCalled();
  });

  // Caso: ID válido pero no encontrado
  it("debería lanzar NotFoundError si el ID no existe", async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(getGroupImplementById.execute(999)).rejects.toThrow(NotFoundError);
    expect(mockRepository.findById).toHaveBeenCalledWith(999);
  });
});
