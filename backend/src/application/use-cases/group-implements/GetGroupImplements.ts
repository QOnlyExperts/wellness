import { GroupImplementEntity } from "../../../domain/entities/GroupImplementEntity";
import { IGroupImplementRepository } from "../../../domain/interfaces/IGroupImplementRepository";
import { GroupImplementOutputDto } from "../../dtos/group-implements/GroupImplementOutputDto";
import { GroupImplementMapper } from "../../mappers/GroupImplementMapper";


export class GetGroupImplements {
  // Implementa la lógica para obtener los GroupImplements
  constructor(
    private groupImplementRepository: IGroupImplementRepository
  ) {}  

  public async execute(): Promise<GroupImplementOutputDto[]> {

    const groupImplementList: GroupImplementEntity[] = 
      await this.groupImplementRepository.findAll();

    return groupImplementList.map((entity) => GroupImplementMapper.toOutputDto(entity));
  }
}