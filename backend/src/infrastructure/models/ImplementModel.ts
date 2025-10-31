// infrastructure/models/InstrumentModel.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db";
import { ImplementStatus } from "../../domain/enums/ImplementStatus";
import { ImplementCondition } from "../../domain/enums/ImplementCondition";

// Estos "Attributes" describen la estructura en BD
export interface ImplementAttributes {
  id: number;
  cod: string;
  status: ImplementStatus;
  condition: ImplementCondition;
  group_implement_id: number;
  categories_id: number;
}

// Y aquí definimos qué campos son opcionales al crear un registro
export interface ImplementCreationAttributes
  extends Optional<ImplementAttributes, "id"> {}


// Extendemos del modelo de sequelize para nuestra clase implement
export class ImplementModel extends Model<
  ImplementAttributes,
  ImplementCreationAttributes
> implements ImplementAttributes {
  public id!: number;
  public cod!: string;
  public status!: ImplementStatus;
  public condition!: ImplementCondition;
  public group_implement_id!: number;
  public categories_id!: number;
}

// Inicializamos el modelo con sus atributos y configuración
ImplementModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cod: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM(...Object.values(ImplementStatus)),
      allowNull: false,
      defaultValue: ImplementStatus.AVAILABLE,
    },
    condition: {
      type: DataTypes.ENUM(...Object.values(ImplementCondition)),
      allowNull: false,
      defaultValue: ImplementCondition.NEW,
    },
    group_implement_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categories_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: "Implement",
    tableName: "implements",
    schema: "mydb",
    createdAt: false,
    updatedAt: false,
    timestamps: false,
  }
);
