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
    if (existingName) {
      throw new DuplicateNameError(input.name);
    }

    // Generamos el prefijo
    let prefix: string = "";

    let attempts = 0;
    // Mantener hasta 10 intentos para evitar bucles infinitos
    while (attempts < 10) {
      // Generar prefijo
      prefix = this.generatePrefix(input.name);
      // Verificar si el prefijo ya existe
      const exists = await this.groupImplementRepository.findByPrefix(prefix);
      // Si no existe, salir del bucle
      if (!exists) break;
      // Si existe, intentar de nuevo
      attempts++;
    }

    if (attempts === 10) throw new ValidationError("No se pudo generar un prefijo único, por favor intente con un nombre diferente.");

    // Crear Entidad con ID de entrada
    const newGroupImplement = GroupImplementEntity.create({
      id: id,
      prefix: prefix,
      name: input.name,
      max_hours: input.max_hours,
      time_limit: input.time_limit
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