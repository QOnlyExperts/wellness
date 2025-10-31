import { UpdateRole } from "../../../../src/application/use-cases/roles/UpdateRole";
import { IRoleRepository } from "../../../../src/domain/interfaces/IRoleRepository";
import { RoleEntity } from "../../../../src/domain/entities/RoleEntity";
import { RoleMapper } from "../../../../src/application/mappers/RoleMapper";
import { NotFoundError, DuplicateNameError } from "../../../../src/shared/errors/DomainErrors";

describe("Caso de uso: UpdateRole", () => {
  let mockRepository: jest.Mocked<IRoleRepository>;
  let updateRole: UpdateRole;

  beforeEach(() => {
    // Mock con los métodos usados: findById, findByName, save
    mockRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<IRoleRepository>;
    
    updateRole = new UpdateRole(mockRepository);
  });

  // Test 1: Caso exitoso
  it("debería actualizar un rol y devolver el DTO", async () => {
    // Arrange: Preparamos la entidad existente y los datos de actualización
    const existingEntity = RoleEntity.create({ id: 1, name: "Invitado", status: false });
    const input = { name: "Invitado Especial", status: true }; // Datos para actualizar
    
    mockRepository.findById.mockResolvedValue(existingEntity); // Simulamos que el ID existe
    mockRepository.findByName.mockResolvedValue(null); // Simulamos que el nuevo nombre no existe
    
    // Entidad esperada después de la actualización
    const updatedEntity = RoleEntity.create({ ...existingEntity, ...input });
    mockRepository.save.mockResolvedValue(updatedEntity); // Simulamos que save() devuelve la entidad actualizada

    // Act: Ejecutamos el caso de uso
    const result = await updateRole.execute(1, input);

    // Assert: Verificamos las llamadas y el resultado
    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(mockRepository.findByName).toHaveBeenCalledWith(input.name);
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toEqual(RoleMapper.toOutputDto(updatedEntity));
  });

  // Test 2: Caso ID no encontrado
  it("debería lanzar NotFoundError si el rol a actualizar no existe", async () => {
    // Arrange: Simulamos que findById devuelve null
    mockRepository.findById.mockResolvedValue(null);

    // Act & Assert: Verificamos que se lance NotFoundError
    await expect(updateRole.execute(999, { name: "Test" })).rejects.toThrow(NotFoundError);
  });

  // Test 3: Caso Nombre duplicado
  it("debería lanzar DuplicateNameError si el nuevo nombre ya pertenece a otro rol", async () => {
    // Arrange: Preparamos la entidad a editar y otra entidad con el nombre conflictivo
    const existingEntity = RoleEntity.create({ id: 1, name: "Invitado", status: false });
    const conflictingEntity = RoleEntity.create({ id: 2, name: "Editor", status: true }); // Otro rol con el nombre deseado
    
    mockRepository.findById.mockResolvedValue(existingEntity); // El ID 1 existe
    mockRepository.findByName.mockResolvedValue(conflictingEntity); // El nombre "Editor" ya existe en el ID 2

    // Act & Assert: Verificamos que se lance DuplicateNameError al intentar ponerle "Editor" al ID 1
    await expect(updateRole.execute(1, { name: "Editor" })).rejects.toThrow(DuplicateNameError);
  });
});