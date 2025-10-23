export class CategoryEntity {
  public readonly id: number | null; 
  public name: string;
  public description: string | null;

  private constructor(props: {
    id: number | null;
    name: string;
    description?: string | null;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? null;
  }

  public static create(props: {
    id: number | null; 
    name: string;
    description?: string | null;
  }): CategoryEntity {
    return new CategoryEntity(props);
  }
}