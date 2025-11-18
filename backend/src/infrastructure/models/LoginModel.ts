import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db";

// --- Atributos que existen en la BD ---
export interface LoginAttributes {
  id: number;
  email: string;
  password: string;
  salt: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: Date | null;
  updated_at: Date | null;
  last_login: Date | null;
  info_person_id: number;
  rol_id: number;
}

// --- Atributos opcionales al crear un registro ---
export interface LoginCreationAttributes
  extends Optional<LoginAttributes, "id" | "created_at" | "updated_at" | "last_login"> {}

// --- Definición del modelo ---
export class LoginModel extends Model<LoginAttributes, LoginCreationAttributes>
  implements LoginAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public salt!: string;
  public is_verified!: boolean;
  public is_active!: boolean;
  public created_at!: Date | null;
  public updated_at!: Date | null;
  public last_login!: Date | null;
  public info_person_id!: number;
  public rol_id!: number;
}

// --- Inicialización del modelo ---
LoginModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    salt: { type: DataTypes.STRING(255), allowNull: false },
    is_verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, allowNull: true },
    updated_at: { type: DataTypes.DATE, allowNull: true },
    last_login: { type: DataTypes.DATE, allowNull: true },
    info_person_id: { type: DataTypes.INTEGER, allowNull: false },
    rol_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: "Login",
    tableName: "logins",
    schema: "mydb",
    timestamps: false, // ya tienes campos personalizados de fecha
  }
);
