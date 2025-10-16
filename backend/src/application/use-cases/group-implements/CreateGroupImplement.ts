import { IGroupImplementRepository } from "../../../domain/interfaces/IGroupImplementRepository";
import { GroupImplementEntity } from "../../../domain/entities/GroupImplementEntity";
import { GroupImplementInputDto } from "../../dtos/group-implements/GroupImplementInputDto";
import { GroupImplementOutputDto } from "../../dtos/group-implements/GroupImplementOutputDto";
import { GroupImplementMapper } from "../../mappers/GroupImplementMapper";
import { DuplicateNameError } from "../../../shared/errors/DomainErrors";


export class CreateGroupImplement {
  constructor(
    private groupImplementRepository: IGroupImplementRepository
  ) {}  

  public async execute(
    input: GroupImplementInputDto
  ): Promise<GroupImplementOutputDto>{
    // Validar si el nombre ya existe
    const existing = await this.groupImplementRepository.findByName(input.name);
    if (existing) {
      throw new DuplicateNameError(input.name);
    }

    // Generamos el prefijo
    const prefix = this.generatePrefix(input.name);
    // Crear Entidad Pura sin ID
    const newGroupImplement = GroupImplementEntity.create({
      id: null, // ID es null porque aún no existe en BD
      prefix: prefix,
      name: input.name,
      max_hours: input.max_hours,
      time_limit: input.time_limit
    });

    const createdGroupImplement = await this.groupImplementRepository.save(newGroupImplement);

    return GroupImplementMapper.toOutputDto(createdGroupImplement);
  }
  
  // Si crece o se reutiliza se monta en un servicio a parte.
  private generatePrefix(name: string): string {
    const cleaned = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z\s]/g, "")
      .trim()
      .toUpperCase();

    const words = cleaned.split(/\s+/);

    if (words.length === 1) {
      return words[0].substring(0, 3);
    }

    const firstWord = words[0].substring(0, 3);
    const secondWord = words[1][0];
    return firstWord + secondWord;
  }

}

