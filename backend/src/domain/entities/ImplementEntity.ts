// domain/entities/ImplementEntity.ts
import { ImplementStatus } from "../enums/ImplementStatus";
import { ImplementCondition } from "../enums/ImplementCondition";

export class ImplementEntity {
  constructor(
    public readonly id: number | null, // Usamos null para diferenciar si ya existe en BD
    public cod: string,
    public status: ImplementStatus,
    public condition: ImplementCondition,
    public group_implement_id: number,
    public categories_id: number
  ) {}

  // Constructor estático para crear la entidad (Ejemplo)
  // Mapeo de Entrada: Crea la entidad desde cualquier objeto plano (usado por el Repositorio)
  public static fromPersistence(data: any): ImplementEntity {
    // Aquí podrías agregar lógica adicional para crear una entidad
    return new ImplementEntity(
      data.id,
      data.cod,
      data.status as ImplementStatus || ImplementStatus.AVAILABLE, // Casteo a Enum
      data.condition as ImplementCondition || ImplementCondition.NEW,
      data.group_implement_id,
      data.categories_id
    );
  }

  // Mapeo de Salida: Devuelve un objeto plano para guardar en BD
  public toPersistence(): any {
    return {
      id: this.id,
      cod: this.cod,
      status: this.status,
      condition: this.condition,
      group_implement_id: this.group_implement_id,
      categories_id: this.categories_id
    };
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
