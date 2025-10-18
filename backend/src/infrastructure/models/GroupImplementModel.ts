import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db";

// Estos "Attributes" describen la estructura en BD
export interface GroupImplementAttributes {
  id: number;
  prefix: string;
  name: string;
  max_hours: number;
  time_limit: number;
}

// Y aquí definimos qué campos son opcionales al crear un registro
export interface GroupImplementCreationAttributes
  extends Optional<GroupImplementAttributes, "id"> {}

// Extendemos del modelo de sequelize para nuestra clase implement
export class GroupImplementModel extends Model<
  GroupImplementAttributes,
  GroupImplementCreationAttributes
> implements GroupImplementAttributes {
  public id!: number;
  public prefix!: string;
  public name!: string;
  public max_hours!: number;
  public time_limit!: number;
}

// Inicializamos el modelo con sus atributos y configuración
GroupImplementModel.init(
  {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    prefix: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    max_hours: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    time_limit: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
  },{
    sequelize,
    modelName: "GroupImplement",
    tableName: "group_implements",
    schema: "mydb",
    timestamps: false,
  }
)