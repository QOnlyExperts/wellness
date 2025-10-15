// src/domain/entities/Category.ts

export class Category {
  public readonly id: number;
  public name: string;
  public description: string | null;

  constructor({
    id,
    name,
    description,
  }: {
    id: number;
    name: string;
    description?: string;
  }) {
    this.id = id;
    this.name = name;
    this.description = description ?? null;
  }
}