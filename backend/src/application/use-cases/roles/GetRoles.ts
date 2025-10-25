import { IRoleRepository } from "../../../domain/interfaces/IRoleRepository";
import { RoleOutputDto } from "../../dtos/roles/RoleOutputDto";
import { RoleMapper } from "../../mappers/RoleMapper";

export class GetRoles {
  constructor(private readonly roleRepository: IRoleRepository) {}

  public async execute(): Promise<RoleOutputDto[]> {
    const roleEntities = await this.roleRepository.findAll();
    
    // Mapear cada entidad al DTO de salida
    return roleEntities.map((entity) => RoleMapper.toOutputDto(entity));
  }
}