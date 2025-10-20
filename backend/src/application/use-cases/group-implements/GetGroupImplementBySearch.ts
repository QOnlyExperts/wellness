import { GroupImplementEntity } from "../../../domain/entities/GroupImplementEntity";
import { IGroupImplementRepository } from "../../../domain/interfaces/IGroupImplementRepository";
import { NotFoundError } from "../../../shared/errors/DomainErrors";
import { GroupImplementFindDto } from "../../dtos/group-implements/GroupImplementFindDto";
import { GroupImplementOutputDto } from "../../dtos/group-implements/GroupImplementOutputDto";
import { GroupImplementMapper } from "../../mappers/GroupImplementMapper";


export class GetGroupImplementBySearch {
  // Implementa la lógica para obtener los GroupImplements
  constructor(
    private groupImplementRepository: IGroupImplementRepository
  ) {}  

  public async execute(input: GroupImplementFindDto): Promise<GroupImplementOutputDto[]> {

    let groupImplementList: GroupImplementEntity[] = [];
    let entity: GroupImplementEntity | null = null;

    // Validar que se haya proporcionado al menos un criterio de búsqueda
    if (!input?.name && !input?.prefix) {
      throw new Error("Se debe proporcionar al menos un criterio de búsqueda.");
    }
    
    if(input?.name){
      entity = await this.groupImplementRepository.findByName(input.name);
      if(!entity){
        throw new NotFoundError(`Grupo de Implementos con nombre '${input.name}' no encontrado.`);
      }
      groupImplementList.push(entity);
    }

    if(input?.prefix){
      entity = await this.groupImplementRepository.findByPrefix(input.prefix);
      if(!entity){
        throw new NotFoundError(`Grupo de Implementos con prefijo '${input.prefix}' no encontrado.`);
      }
      groupImplementList.push(entity);
    }

    return groupImplementList.map((entity) => GroupImplementMapper.toOutputDto(entity));
  }
}