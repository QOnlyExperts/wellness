import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db";

export interface CategoryAttributes {
  id: number;
  name: string;
  description: string | null;
}

export interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, "id"> {}

export class CategoryModel
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number;
  public name!: string;
  public description!: string | null;
}

CategoryModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(45), // <-- CORREGIDO A 45
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "categories",
    timestamps: false, // Asumiendo que no hay createdAt/updatedAt en tu tabla
  }
);