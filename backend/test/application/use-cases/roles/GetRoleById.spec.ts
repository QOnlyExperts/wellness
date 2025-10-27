import { GetRoleById } from "../../../../src/application/use-cases/roles/GetRoleById";
import { IRoleRepository } from "../../../../src/domain/interfaces/IRoleRepository";
import { RoleEntity } from "../../../../src/domain/entities/RoleEntity";
import { RoleMapper } from "../../../../src/application/mappers/RoleMapper";
import { NotFoundError, ValidationError } from "../../../../src/shared/errors/DomainErrors";

describe("Caso de uso: GetRoleById", () => {
  let mockRepository: jest.Mocked<IRoleRepository>;
  let getRoleById: GetRoleById;

  beforeEach(() => {
    // Mock solo con el método findById
    mockRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IRoleRepository>;
    
    getRoleById = new GetRoleById(mockRepository);
  });

  // Test 1: Caso exitoso
  it("debería devolver un DTO de rol si el ID existe", async () => {
    // Arrange: Preparamos la entidad que simulará devolver el repo
    const entity = RoleEntity.create({ id: 1, name: "Supervisor", status: true });
    mockRepository.findById.mockResolvedValue(entity);

    // Act: Ejecutamos el caso de uso
    const result = await getRoleById.execute(1);

    // Assert: Verificamos que se llamó a findById y que el resultado es el DTO correcto
    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(RoleMapper.toOutputDto(entity));
  });

  // Test 2: Caso ID no encontrado
  it("debería lanzar NotFoundError si el ID no se encuentra en el repositorio", async () => {
    // Arrange: Simulamos que el repo devuelve null
    mockRepository.findById.mockResolvedValue(null);

    // Act & Assert: Verificamos que se lance NotFoundError
    await expect(getRoleById.execute(999)).rejects.toThrow(NotFoundError);
    expect(mockRepository.findById).toHaveBeenCalledWith(999); // Verificamos que se intentó buscar
  });

  // Test 3: Caso ID inválido (0 o negativo)
  it("debería lanzar ValidationError si el ID es 0 o negativo", async () => {
    // Act & Assert: Verificamos que se lance ValidationError para IDs inválidos
    await expect(getRoleById.execute(0)).rejects.toThrow(ValidationError);
    await expect(getRoleById.execute(-10)).rejects.toThrow(ValidationError);
    
    // Assert (extra): Verificamos que NO se llamó al repositorio si el ID era inválido
    expect(mockRepository.findById).not.toHaveBeenCalled();
  });
});