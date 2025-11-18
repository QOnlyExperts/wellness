import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db";

// Interfaz que describe los atributos de la tabla 'phones'
export interface PhoneAttributes {
  id: number;
  number: bigint; // Usamos 'bigint' para 'BIGINT' de SQL
  info_person_id: number;
}

// Interfaz para la creación (id opcional)
export interface PhoneCreationAttributes
  extends Optional<PhoneAttributes, "id"> {}

// Extendemos del modelo de sequelize
export class PhoneModel
  extends Model<PhoneAttributes, PhoneCreationAttributes>
  implements PhoneAttributes
{
  public id!: number;
  public number!: bigint;
  public info_person_id!: number;
}

// Inicializamos el modelo con sus atributos y configuración
PhoneModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    number: {
      type: DataTypes.BIGINT, // Basado en BIGINT(10) del init.sql
      allowNull: false,
    },
    info_person_id: {
      type: DataTypes.INTEGER, // Basado en INT del init.sql
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Phone",
    tableName: "phones",
    schema: "mydb", // Patrón clave del proyecto
    timestamps: false, // Patrón clave del proyecto
  }
);