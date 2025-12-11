import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db";

// Interfaz que describe los atributos de la tabla 'roles'
export interface RoleAttributes {
  id: number;
  name: string;
  status: boolean;
}

// Interfaz para la creación (el 'id' es opcional)
export interface RoleCreationAttributes extends Optional<RoleAttributes, "id"> {}

export class RoleModel
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  public id!: number;
  public name!: string;
  public status!: boolean;
}

RoleModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(45), // Coincide con VARCHAR(45) del init.sql
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN, // Coincide con BOOLEAN del init.sql
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Role",
    tableName: "roles",
    schema: "mydb", // <-- El detalle clave que aprendimos
    timestamps: false, // Tu tabla no tiene createdAt/updatedAt
  }
);