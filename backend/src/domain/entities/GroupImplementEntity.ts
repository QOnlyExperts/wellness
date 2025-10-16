
export class GroupImplementEntity {
  
  public readonly id: number | null;
  public prefix: string;
  public name: string;
  public max_hours: number;
  public time_limit: number;

  private constructor(props: {
    id: number | null;
    prefix: string;
    name: string;
    max_hours: number;
    time_limit: number;
  }) {
    this.id = props.id;
    this.prefix = props.prefix;
    this.name = props.name;
    this.max_hours = props.max_hours;
    this.time_limit = props.time_limit;
  }

  // Constructor estático para crear la entidad (Ejemplo)
  // Mapeo de Entrada: Crea la entidad desde cualquier objeto plano (usado por el Repositorio)
  static create(props: {
    id: null; // Usamos null para diferenciar si ya existe en BD,
    name: string,
    max_hours: number,
    time_limit: number
  }): GroupImplementEntity {
    const prefix = props.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .substring(0, 3)
      .toUpperCase();

    // Aquí podrías agregar lógica adicional para crear una entidad
    return new GroupImplementEntity({
      id: props.id, // ID es null porque aún no existe en BD
      prefix,
      name: props.name,
      max_hours: props.max_hours,
      time_limit: props.time_limit
    });
  }
}
