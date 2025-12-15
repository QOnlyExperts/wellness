import { IGroupImplementRepository } from "../../../domain/interfaces/IGroupImplementRepository";
import { GroupImplementEntity } from "../../../domain/entities/GroupImplementEntity";
import { GroupImplementInputDto } from "../../dtos/group-implements/GroupImplementInputDto";
import { GroupImplementOutputDto } from "../../dtos/group-implements/GroupImplementOutputDto";
import { GroupImplementMapper } from "../../mappers/GroupImplementMapper";
import { DuplicateNameError, ValidationError, NotFoundError } from "../../../shared/errors/DomainErrors";


export class UpdateGroupImplement {
  constructor(
    private groupImplementRepository: IGroupImplementRepository
  ) {}

  public async execute(
    id: number,
    input: GroupImplementInputDto
  ): Promise<GroupImplementOutputDto>{

    // Validar si el ID ya existe
    const existingId = await this.groupImplementRepository.findById(id);
    if (!existingId) {
      throw new NotFoundError(`Grupo de Implementos no encontrado.`);
    }

    // Validar si el nombre ya existe
    const existingName = await this.groupImplementRepository.findByName(input.name);
    if(existingName)
      if (existingId.id !== existingName?.id) {
        throw new DuplicateNameError(input.name);
      }

    let prefix: string = existingId.prefix;

    if(existingId.name !== existingName?.name){
      // Generamos el prefijo
      prefix = this.generatePrefix(input.name);
      // const exists = await this.groupImplementRepository.findByPrefix(prefix);
      // if (exists) throw new ValidationError("No se pudo generar un prefijo único, por favor intente con un nombre diferente.");
    }

    // Crear Entidad con ID de entrada
    const newGroupImplement = GroupImplementEntity.create({
      id: id,
      prefix: prefix,
      name: input.name,
      max_hours: input.max_hours,
      time_limit: 0
    });

    // Guardar los cambios
    const updatedGroupImplement = await this.groupImplementRepository.save(newGroupImplement);

    // Mapear a DTO de salida
    return GroupImplementMapper.toOutputDto(updatedGroupImplement);
  }
  
  // Si crece o se reutiliza se monta en un servicio a parte.
  private generatePrefix(name: string): string {
    const cleaned = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z\s]/g, "")
      .trim()
      .toUpperCase();

    // Dividir en palabras
    const words = cleaned.split(/\s+/);

    // Generar prefijo según cantidad de palabras
    if (words.length === 1) {
      return words[0].substring(0, 3);
    }

    // Dos o más palabras
    const firstWord = words[0].substring(0, 3);
    let concatenated = firstWord;

    // Agregar la primera letra de las siguientes palabras
    for (let i = 1; i < words.length; i++) {
      concatenated += words[i][0];
    }

    return concatenated;
  }

}