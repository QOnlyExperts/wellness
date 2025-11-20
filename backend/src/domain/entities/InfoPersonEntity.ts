// domain/entities/InfoPersonEntity.ts
import { ValidationError } from "../../shared/errors/DomainErrors";
import { ProgramEntity } from "./ProgramEntity";

export class InfoPersonEntity {
  public readonly id: number | null;
  public name1: string;
  public name2?: string | null;
  public last_name1: string;
  public last_name2?: string | null;
  public identification: string;
  public program_id: number;
  public program?: ProgramEntity;


  constructor(props: {
    id: number | null;
    name1: string;
    name2?: string | null;
    last_name1: string;
    last_name2?: string | null;
    identification: string;
    program_id: number;
    program?: ProgramEntity;
  }) {
    this.id = props.id;
    this.name1 = props.name1;
    this.name2 = props.name2 ?? null;
    this.last_name1 = props.last_name1;
    this.last_name2 = props.last_name2 ?? null;
    this.identification = props.identification;
    this.program_id = props.program_id;
    this.program = props.program;
  }

  // Fábrica estática para crear la entidad con validaciones de dominio
  static create(props: {
    id: number | null;
    name1: string;
    name2?: string | null;
    last_name1: string;
    last_name2?: string | null;
    identification: string;
    program_id: number;
    program?: ProgramEntity;
  }): InfoPersonEntity {
    // --- Validaciones de dominio ---
    if (!props.name1 || props.name1.trim().length === 0) {
      throw new ValidationError("El primer nombre es obligatorio");
    }

    if (!props.last_name1 || props.last_name1.trim().length === 0) {
      throw new ValidationError("El primer apellido es obligatorio");
    }

    if (!props.identification || props.identification.trim().length === 0) {
      throw new ValidationError("La identificación es obligatoria");
    }

    if (props.identification.length < 8 || props.identification.length > 10) {
      throw new ValidationError("La identificación no puede tener menos de 8 caracteres ni mas de 10");
    }

    if (!props.program_id) {
      throw new ValidationError("El programa asociado es obligatorio");
    }

    return new InfoPersonEntity({
      id: props.id,
      name1: props.name1.trim(),
      name2: props.name2?.trim() ?? null,
      last_name1: props.last_name1.trim(),
      last_name2: props.last_name2?.trim() ?? null,
      identification: props.identification.trim(),
      program_id: props.program_id,
      program: props.program
    });
  }

  // ---- Métodos de dominio ----

  public getFullName(): string {
    const namePart = this.name2 ? `${this.name1} ${this.name2}` : this.name1;
    const lastPart = this.last_name2 ? `${this.last_name1} ${this.last_name2}` : this.last_name1;
    return `${namePart} ${lastPart}`.trim();
  }

  // public updateIdentification(newIdentification: string) {
  //   if (!newIdentification || newIdentification.trim().length === 0) {
  //     throw new ValidationError("La nueva identificación no puede estar vacía");
  //   }
  //   if (newIdentification.length > 10) {
  //     throw new ValidationError("La identificación no puede tener más de 10 caracteres");
  //   }
  //   this.identification = newIdentification.trim();
  // }

  public updateProgram(programId: number) {
    if (!programId) {
      throw new ValidationError("El programa proporcionado no es válido");
    }
    this.program_id = programId;
  }
}
