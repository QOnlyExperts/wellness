import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db";

// Interfaz que describe los atributos de la tabla 'programs'
export interface ProgramAttributes {
  id: number;
  name: string;
  cod: string;
  facult: string;
  status: boolean;
  date: Date; // TIMESTAMP en SQL se traduce a Date en TS
}

// Interfaz para la creación (el 'id' es opcional), igual que en GroupImplement
export interface ProgramCreationAttributes
  extends Optional<ProgramAttributes, "id"> {}

// Extendemos del modelo de sequelize
export class ProgramModel
  extends Model<ProgramAttributes, ProgramCreationAttributes>
  implements ProgramAttributes
{
  public id!: number;
  public name!: string;
  public cod!: string;
  public facult!: string;
  public status!: boolean;
  public date!: Date;
}

// Inicializamos el modelo con sus atributos y configuración
ProgramModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(45), // Basado en VARCHAR(45) del init.sql
      allowNull: false,
    },
    cod: {
      type: DataTypes.STRING(45), // Basado en VARCHAR(45) del init.sql
      allowNull: false,
    },
    facult: {
      type: DataTypes.STRING(45), // Basado en VARCHAR(45) del init.sql
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN, // Basado en BOOLEAN del init.sql
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE, // Basado en TIMESTAMP del init.sql
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Program",
    tableName: "programs",
    schema: "mydb", // Clave, como en GroupImplementModel
    timestamps: false, // Igual que en GroupImplementModel
  }
);