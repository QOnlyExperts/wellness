import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db";

// --- Atributos que existen en la BD ---
export interface InfoPersonAttributes {
  id: number;
  name1: string;
  name2?: string | null;
  last_name1: string;
  last_name2?: string | null;
  identification: string;
  program_id: number;
}

// --- Atributos opcionales al crear ---
export interface InfoPersonCreationAttributes
  extends Optional<InfoPersonAttributes, "id" | "name2" | "last_name2"> {}

// --- Definición del modelo ---
export class InfoPersonModel extends Model<
  InfoPersonAttributes,
  InfoPersonCreationAttributes
> implements InfoPersonAttributes {
  public id!: number;
  public name1!: string;
  public name2!: string | null;
  public last_name1!: string;
  public last_name2!: string | null;
  public identification!: string;
  public program_id!: number;
}

// --- Inicialización del modelo ---
InfoPersonModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name1: { type: DataTypes.STRING(45), allowNull: false },
    name2: { type: DataTypes.STRING(45), allowNull: true },
    last_name1: { type: DataTypes.STRING(45), allowNull: false },
    last_name2: { type: DataTypes.STRING(45), allowNull: true },
    identification: { type: DataTypes.STRING(10), allowNull: false, unique: true },
    program_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: "InfoPerson",
    tableName: "info_persons",
    schema: "mydb",
    timestamps: false,
  }
);
