// src/domain/entities/PhoneEntity.ts

export class PhoneEntity {
  public readonly id: number | null;
  public number: bigint; // Usamos 'bigint' para 'BIGINT' de SQL
  public info_person_id: number;

  private constructor(props: {
    id: number | null;
    number: bigint;
    info_person_id: number;
  }) {
    this.id = props.id;
    this.number = props.number;
    this.info_person_id = props.info_person_id;
  }

  public static create(props: {
    id: number | null;
    number: bigint;
    info_person_id: number;
  }): PhoneEntity {
    // Aquí se podrían añadir validaciones de negocio (ej: que el número tenga 10 dígitos)
    return new PhoneEntity(props);
  }
}