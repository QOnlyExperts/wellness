// src/domain/entities/RoleEntity.ts

export class RoleEntity {
  public readonly id: number | null;
  public name: string;
  public status: boolean; // En la DB es TINYINT(1), que se traduce a booleano

  // Usamos un constructor privado para forzar la creación a través del método 'create'
  private constructor(props: {
    id: number | null;
    name: string;
    status: boolean;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.status = props.status;
  }

  /**
   * Método estático para crear una nueva instancia de RoleEntity.
   * Esto sigue el mismo patrón que usamos en CategoryEntity.
   */
  public static create(props: {
    id: number | null;
    name: string;
    status: boolean;
  }): RoleEntity {
    // Aquí se podrían añadir validaciones de negocio en el futuro
    return new RoleEntity(props);
  }
}