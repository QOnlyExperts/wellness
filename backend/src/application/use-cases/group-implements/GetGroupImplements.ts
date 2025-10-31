import { GroupImplementEntity } from "../../../domain/entities/GroupImplementEntity";
import { IGroupImplementRepository } from "../../../domain/interfaces/IGroupImplementRepository";
import { GroupImplementOutputDto } from "../../dtos/group-implements/GroupImplementOutputDto";
import { GroupImplementMapper } from "../../mappers/GroupImplementMapper";

import { IImplementRepository } from "../../../domain/interfaces/IImplementRepository";
import { ImplementEntity } from "../../../domain/entities/ImplementEntity";


export class GetGroupImplements {
  // Implementa la lógica para obtener los GroupImplements
  constructor(
    private groupImplementRepository: IGroupImplementRepository,
    private implementRepository: IImplementRepository
  ) {}  

  public async execute(): Promise<GroupImplementOutputDto[]> {

    const groupImplementList: GroupImplementEntity[] = 
      await this.groupImplementRepository.findAll();

    for(const group of groupImplementList){
      // Verificamos que id no sea null
      if(!group.id)
        return [];  
        
      const implementsList = await this.implementRepository.findByIdGroup(group.id);
        // Obtener todas las imágenes de los implementos del grupo
      const images = implementsList.flatMap((i) => i.imgs?.map(img => img.description) || []);
      group.images_preview = images;
    }

    return groupImplementList.map((entity) => GroupImplementMapper.toOutputDto(entity));
  }
}