import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db"; // Asumiendo esta ruta
import { RequestStatus } from "../../domain/enums/RequestStatus"; // Importación de tu enum de dominio

// -------------------------------------------------------------------
// 1. Tipos de Atributos
// -------------------------------------------------------------------

// Mapeo directo de tu RequestEntity para uso en Sequelize
export interface RequestAttributes {
  id: number;
  status: RequestStatus; // Usamos el enum de tu dominio
  created_at: Date;
  finished_at: Date | null;
  limited_at: Date;
  info_person_id: number;
  implement_id: number;
}

// Atributos opcionales al crear un registro
export interface RequestCreationAttributes
  extends Optional<
    RequestAttributes,
    "id" | "created_at" | "finished_at" 
  > {} // Se añade 'finished_at' como opcional

// -------------------------------------------------------------------
// 2. Definición del Modelo
// -------------------------------------------------------------------

export class RequestModel
  extends Model<RequestAttributes, RequestCreationAttributes>
  implements RequestAttributes
{
  public id!: number;
  public status!: RequestStatus;
  public created_at!: Date;
  public finished_at!: Date | null;
  public limited_at!: Date;
  public info_person_id!: number;
  public implement_id!: number;
  
  // Nota: Las asociaciones (info_person, implement) se definen fuera de la clase,
  // pero sus claves foráneas (info_person_id, implement_id) están aquí.
}

// -------------------------------------------------------------------
// 3. Inicialización del Modelo
// -------------------------------------------------------------------

// Obtener los valores del ENUM para Sequelize
// Se asume que RequestStatus tiene valores de string que coinciden con los de la base de datos
const REQUEST_STATUS_VALUES: string[] = Object.values(RequestStatus);

RequestModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    status: {
      type: DataTypes.ENUM(...REQUEST_STATUS_VALUES),
      allowNull: false,
      defaultValue: RequestStatus.REQUESTED, 
    },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    finished_at: { type: DataTypes.DATE, allowNull: true },
    limited_at: { type: DataTypes.DATE, allowNull: false },
    info_person_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: { model: 'info_persons', key: 'id' } // Se añade la referencia si es necesario
    },
    implement_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: { model: 'implements', key: 'id' } // Se añade la referencia si es necesario
    },
  },
  {
    sequelize,
    modelName: "Request",
    tableName: "requests",
    schema: "mydb",
    timestamps: false,
  }
);