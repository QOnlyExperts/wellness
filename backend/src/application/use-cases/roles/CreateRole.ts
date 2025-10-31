import { RoleEntity } from "../../../domain/entities/RoleEntity";
import { IRoleRepository } from "../../../domain/interfaces/IRoleRepository";
import { RoleOutputDto } from "../../dtos/roles/RoleOutputDto";
import { CreateRoleInputDto } from "../../dtos/roles/CreateRoleInputDto";
import { RoleMapper } from "../../mappers/RoleMapper";
import { DuplicateNameError } from "../../../shared/errors/DomainErrors";

export class CreateRole {
  constructor(private readonly roleRepository: IRoleRepository) {}

  public async execute(input: CreateRoleInputDto): Promise<RoleOutputDto> {
    // 1. Verificar si ya existe un rol con ese nombre
    const existingRole = await this.roleRepository.findByName(input.name);
    if (existingRole) {
      throw new DuplicateNameError(`Un rol con el nombre "${input.name}" ya existe.`);
    }

    // 2. Crear la entidad (usando 'null' para el ID)
    const roleEntity = RoleEntity.create({
      id: null,
      name: input.name,
      status: input.status,
    });

    // 3. Guardar en la base de datos
    const createdRole = await this.roleRepository.save(roleEntity);

    // 4. Mapear y devolver el DTO de salida
    return RoleMapper.toOutputDto(createdRole);
  }
}