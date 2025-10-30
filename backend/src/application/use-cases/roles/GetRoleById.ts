import { IRoleRepository } from "../../../domain/interfaces/IRoleRepository";
import { RoleOutputDto } from "../../dtos/roles/RoleOutputDto";
import { RoleMapper } from "../../mappers/RoleMapper";
import { NotFoundError, ValidationError } from "../../../shared/errors/DomainErrors";

export class GetRoleById {
  constructor(private readonly roleRepository: IRoleRepository) {}

  public async execute(id: number): Promise<RoleOutputDto> {
    // 1. Validar la entrada
    if (!id || id <= 0) {
      throw new ValidationError("El ID del rol no es válido.");
    }

    // 2. Buscar la entidad
    const roleEntity = await this.roleRepository.findById(id);
    if (!roleEntity) {
      throw new NotFoundError(`El rol no fue encontrado.`);
    }

    // 3. Mapear y devolver el DTO
    return RoleMapper.toOutputDto(roleEntity);
  }
}