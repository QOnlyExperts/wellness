// infrastructure/models/ImgModel.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db";

export interface ImgAttributes {
  id: number;
  file_name: string;
  file_path: string;
  mime_type: string;
  size_bytes?: number;
  description?: string;
  instrument_id?: number;
  uploaded_by?: number;
  created_at?: Date;
  updated_at?: Date;
}

// Campos opcionales al crear
export interface ImgCreationAttributes extends Optional<ImgAttributes, "id" | "created_at" | "updated_at"> {}

export class ImgModel extends Model<ImgAttributes, ImgCreationAttributes> implements ImgAttributes {
  public id!: number;
  public file_name!: string;
  public file_path!: string;
  public mime_type!: string;
  public size_bytes?: number;
  public description?: string;
  public instrument_id?: number;
  public uploaded_by?: number;
  public created_at?: Date;
  public updated_at?: Date;
}

ImgModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    file_name: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4, // Genera el UUID automáticamente
    },
    file_path: { type: DataTypes.TEXT, allowNull: false },
    mime_type: { type: DataTypes.STRING(50), allowNull: false },
    size_bytes: { type: DataTypes.BIGINT, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    instrument_id: { type: DataTypes.INTEGER, allowNull: true },
    uploaded_by: { type: DataTypes.INTEGER, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: "Img",
    tableName: "imgs",
    schema: "mydb",
    timestamps: true, // para manejar created_at y updated_at
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
