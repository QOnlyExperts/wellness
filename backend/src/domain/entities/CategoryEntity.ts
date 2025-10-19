// src/domain/entities/CategoryEntity.ts

export class CategoryEntity {
  public readonly id: number;
  public name: string;
  public description: string | null;

  // Hacemos el constructor privado para forzar la creación a través del método 'create'
  private constructor(props: {
    id: number;
    name: string;
    description?: string | null;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? null;
  }

  // Este es el método estático que usa el Mapper
  public static create(props: {
    id: number;
    name: string;
    description?: string | null;
  }): CategoryEntity {
    // Aquí podrías añadir lógica de validación antes de crear el objeto
    return new CategoryEntity(props);
  }
}