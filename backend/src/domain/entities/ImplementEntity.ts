// domain/entities/ImplementEntity.ts
import { ImplementStatus } from "../enums/ImplementStatus";
import { ImplementCondition } from "../enums/ImplementCondition";

export class ImplementEntity {
  public readonly id: number | null; // Usamos null para diferenciar si ya existe en BD
  public cod: string;
  public status: ImplementStatus;
  public condition: ImplementCondition;
  public group_implement_id: number;
  public categories_id: number;

  constructor(props: {
    id: number | null; // Usamos null para diferenciar si ya existe en BD
    cod: string,
    status: ImplementStatus,
    condition: ImplementCondition,
    group_implement_id: number,
    categories_id: number
  }) {
    this.id = props.id;
    this.cod = props.cod;
    this.status = props.status;
    this.condition = props.condition;
    this.group_implement_id = props.group_implement_id;
    this.categories_id = props.categories_id;
  }

  static create(props: {
    id: number | null; // Usamos null para diferenciar si ya existe en BD
    cod: string,
    status: ImplementStatus,
    condition: ImplementCondition,
    group_implement_id: number,
    categories_id: number

  }): ImplementEntity {
    // Por aquí debo crear el código automáticamente
    // Aquí podrías agregar validaciones o lógica adicional antes de crear la entidad
    return new ImplementEntity({
      id: props.id,
      cod: props.cod,
      status: props.status,
      condition: props.condition,
      group_implement_id: props.group_implement_id,
      categories_id: props.categories_id
    });
  }

  // Lógica de Dominio: (Métodos que aplican reglas)
  public canBeDeactivated(): boolean {
    // Ejemplo de lógica de negocio en la entidad
    return this.condition !== ImplementCondition.NEW;
  }

  changeStatus(newStatus: ImplementStatus) {
    // Reglas de negocio: por ejemplo, no se puede "prestar" un instrumento retirado
    if (this.status === ImplementStatus.RETIRED && newStatus === ImplementStatus.BORROWED) {
      throw new Error("No se puede prestar un instrumento retirado");
    }

    this.status = newStatus;
  }

  isAvailable(): boolean {
    return this.status === ImplementStatus.AVAILABLE;
  }


}
