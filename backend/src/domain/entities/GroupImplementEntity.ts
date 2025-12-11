export class GroupImplementEntity {
  public readonly id: number | null;
  public prefix: string;
  public name: string;
  public amount?: number;
  public max_hours: number;
  public time_limit: number;

  // 👇 Añade esto
  public images_preview?: string[];

  private constructor(props: {
    id: number | null;
    prefix: string;
    name: string;
    amount?: number;
    max_hours: number;
    time_limit: number;
    images_preview?: string[];
  }) {
    this.id = props.id;
    this.prefix = props.prefix;
    this.name = props.name;
    this.amount = props.amount;
    this.max_hours = props.max_hours;
    this.time_limit = props.time_limit;
    this.images_preview = props.images_preview;
  }

  static create(props: {
    id: number | null;
    prefix: string;
    name: string;
    amount?: number;
    max_hours: number;
    time_limit: number;
    images_preview?: string[];
  }): GroupImplementEntity {
    return new GroupImplementEntity(props);
  }
}
