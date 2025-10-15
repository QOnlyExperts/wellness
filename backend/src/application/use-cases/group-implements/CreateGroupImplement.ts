import { IGroupImplementRepository } from "../../../domain/interfaces/IGroupImplementRepository";
import { GroupImplementEntity } from "../../../domain/entities/GroupImplementEntity";
import { GroupImplementInputDto } from "../../dtos/group-implements/GroupImplementInputDto";
import { GroupImplementOutputDto } from "../../dtos/group-implements/GroupImplementOutputDto";
import { GroupImplementMapper } from "../../mappers/GroupImplementMapper";


export class CreateGroupImplement {
  constructor(
    private groupImplementRepository: IGroupImplementRepository
  ) {}  

  public async execute(
    input: GroupImplementInputDto
  ): Promise<GroupImplementOutputDto>{
    // Crear Entidad Pura sin ID
    const newGroupImplement = GroupImplementEntity.create({
      id: null, // ID es null porque aún no existe en BD
      name: input.name,
      max_hours: input.max_hours,
      time_limit: input.time_limit
    });

    const createdGroupImplement = await this.groupImplementRepository.save(newGroupImplement);

    return GroupImplementMapper.toOutputDto(createdGroupImplement);
  }
}

