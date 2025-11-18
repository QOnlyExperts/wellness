// src/domain/entities/ProgramEntity.ts

export class ProgramEntity {
  public readonly id: number | null;
  public name: string;
  public cod: string;
  public facult: string;
  public status: boolean;
  public date: Date;

  // Constructor privado para seguir el patrón de 'create'
  private constructor(props: {
    id: number | null;
    name: string;
    cod: string;
    facult: string;
    status: boolean;
    date: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.cod = props.cod;
    this.facult = props.facult;
    this.status = props.status;
    this.date = props.date;
  }

  /**
   * Método estático para crear una nueva instancia de ProgramEntity.
   * Sigue el mismo patrón de GroupImplementEntity.create()
   */
  public static create(props: {
    id: number | null;
    name: string;
    cod: string;
    facult: string;
    status: boolean;
    date: Date;
  }): ProgramEntity {
    return new ProgramEntity(props);
  }
}