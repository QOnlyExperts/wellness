import { GetRoles } from "../../../../src/application/use-cases/roles/GetRoles";
import { IRoleRepository } from "../../../../src/domain/interfaces/IRoleRepository";
import { RoleEntity } from "../../../../src/domain/entities/RoleEntity";
import { RoleMapper } from "../../../../src/application/mappers/RoleMapper";

describe("Caso de uso: GetRoles", () => {
  let mockRepository: jest.Mocked<IRoleRepository>;
  let getRoles: GetRoles;

  beforeEach(() => {
    // Mock del repositorio solo con el método que usa este caso de uso
    mockRepository = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<IRoleRepository>;
    
    getRoles = new GetRoles(mockRepository);
  });

  // Test 1: Caso exitoso con datos
  it("debería retornar una lista de RoleOutputDto cuando el repositorio devuelve entidades", async () => {
    // Arrange: Preparamos una lista de entidades que simulará devolver el repositorio
    const entities: RoleEntity[] = [
      RoleEntity.create({ id: 1, name: "Admin", status: true }),
      RoleEntity.create({ id: 2, name: "User", status: true }),
    ];
    mockRepository.findAll.mockResolvedValue(entities);

    // Act: Ejecutamos el caso de uso
    const result = await getRoles.execute();

    // Assert: Verificamos que se llamó a findAll y que el resultado es la lista de DTOs esperada
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result).toEqual(entities.map(RoleMapper.toOutputDto)); // Comparamos con la lista mapeada
  });

  // Test 2: Caso exitoso sin datos
  it("debería retornar un arreglo vacío cuando el repositorio no tiene entidades", async () => {
    // Arrange: Simulamos que el repositorio devuelve una lista vacía
    mockRepository.findAll.mockResolvedValue([]);

    // Act
    const result = await getRoles.execute();

    // Assert
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]); // El resultado debe ser un arreglo vacío
  });

  // Test 3: Caso de error en el repositorio
  it("debería propagar los errores lanzados por el repositorio", async () => {
    // Arrange: Simulamos que el repositorio lanza un error
    const error = new Error("Error de base de datos");
    mockRepository.findAll.mockRejectedValue(error);

    // Act & Assert: Verificamos que el caso de uso lance el mismo error
    await expect(getRoles.execute()).rejects.toThrow("Error de base de datos");
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });
});