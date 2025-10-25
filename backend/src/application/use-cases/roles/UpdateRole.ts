import { IRoleRepository } from "../../../domain/interfaces/IRoleRepository";
import { RoleOutputDto } from "../../dtos/roles/RoleOutputDto";
import { UpdateRoleInputDto } from "../../dtos/roles/UpdateRoleInputDto";
import { RoleMapper } from "../../mappers/RoleMapper";
import { NotFoundError, DuplicateNameError } from "../../../shared/errors/DomainErrors";

export class UpdateRole {
  constructor(private readonly roleRepository: IRoleRepository) {}

  public async execute(
    id: number,
    dataToUpdate: UpdateRoleInputDto
  ): Promise<RoleOutputDto> {
    // 1. Asegurarse de que el rol exista
    const existingRole = await this.roleRepository.findById(id);
    if (!existingRole) {
      throw new NotFoundError(`El rol con el id ${id} no fue encontrado.`);
    }

    // 2. Si se está cambiando el nombre, verificar que no esté duplicado
    if (dataToUpdate.name) {
      const anotherRoleWithSameName = await this.roleRepository.findByName(dataToUpdate.name);
      if (anotherRoleWithSameName && anotherRoleWithSameName.id !== id) {
        throw new DuplicateNameError(`Un rol con el nombre "${dataToUpdate.name}" ya existe.`);
      }
    }

    // 3. Aplicar los cambios y guardar
    Object.assign(existingRole, dataToUpdate);
    const updatedRole = await this.roleRepository.save(existingRole);

    // 4. Mapear y devolver el DTO
    return RoleMapper.toOutputDto(updatedRole);
  }
}