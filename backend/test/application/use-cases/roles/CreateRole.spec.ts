import { CreateRole } from "../../../../src/application/use-cases/roles/CreateRole";
import { IRoleRepository } from "../../../../src/domain/interfaces/IRoleRepository";
import { RoleEntity } from "../../../../src/domain/entities/RoleEntity";
import { RoleMapper } from "../../../../src/application/mappers/RoleMapper";
import { DuplicateNameError } from "../../../../src/shared/errors/DomainErrors";

describe("Caso de uso: CreateRole", () => {
  // Declaramos variables para el mock y la instancia del caso de uso
  let mockRepository: jest.Mocked<IRoleRepository>;
  let createRole: CreateRole;

  // Antes de cada test, reiniciamos el mock y creamos una nueva instancia
  beforeEach(() => {
    // Creamos un mock del repositorio con las funciones que usa este caso de uso
    mockRepository = {
      findByName: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<IRoleRepository>; // Truco para tipar el mock
    
    // Creamos la instancia del caso de uso, inyectando el mock
    createRole = new CreateRole(mockRepository);
  });

  // Test 1: Caso exitoso
  it("debería crear un rol y devolver el DTO correspondiente", async () => {
    // Arrange: Preparamos los datos de entrada y lo que esperamos que devuelvan los mocks
    const input = { name: "Administrador", status: true };
    mockRepository.findByName.mockResolvedValue(null); // Simulamos que el nombre no existe

    // Creamos la entidad que esperamos que se guarde y se devuelva
    const entity = RoleEntity.create({ id: 1, ...input }); // Asumimos que la DB le dará id 1
    mockRepository.save.mockResolvedValue(entity); // Simulamos que save() devuelve la entidad con id

    // Act: Ejecutamos el caso de uso
    const result = await createRole.execute(input);

    // Assert: Verificamos que todo haya funcionado como se esperaba
    expect(mockRepository.findByName).toHaveBeenCalledWith(input.name); // Verificamos que se buscó el nombre
    expect(mockRepository.save).toHaveBeenCalled(); // Verificamos que se llamó a save
    expect(result).toEqual(RoleMapper.toOutputDto(entity)); // Verificamos que el resultado es el DTO correcto
  });

  // Test 2: Caso de nombre duplicado
  it("debería lanzar DuplicateNameError si el nombre del rol ya existe", async () => {
    // Arrange: Preparamos la entrada y simulamos que el nombre ya existe
    const input = { name: "Administrador", status: true };
    const existingEntity = RoleEntity.create({ id: 1, ...input });
    mockRepository.findByName.mockResolvedValue(existingEntity); // findByName devuelve una entidad existente

    // Act & Assert: Verificamos que al ejecutar, se lance el error esperado
    await expect(createRole.execute(input)).rejects.toThrow(DuplicateNameError);

    // Assert (extra): Verificamos que NO se llamó a save() si el nombre estaba duplicado
    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});