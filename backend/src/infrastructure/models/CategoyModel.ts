import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db"; // Asegúrate que la ruta al archivo de conexión sea correcta

// Describe los atributos que tendrá la tabla 'categories' en la BD
export interface CategoryAttributes {
  id: number;
  name: string;
  description: string | null;
}

// Define qué campos son opcionales al usar `CategoryModel.create()`
// En este caso, el 'id' porque es autoincremental.
export interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, "id"> {}

// Creamos la clase del modelo que extiende de Sequelize
export class CategoryModel
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number;
  public name!: string;
  public description!: string | null;
}

// Inicializamos el modelo y definimos la estructura de la tabla
CategoryModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100), // Es buena práctica definir una longitud
      allowNull: false,
      unique: true, // Generalmente, los nombres de categoría no se repiten
    },
    description: {
      type: DataTypes.TEXT, // TEXT es mejor para descripciones largas
      allowNull: true, // La descripción puede ser opcional
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "categories", // El nombre de la tabla en plural
    schema: "mydb", // El mismo schema que usaste en ImplementModel
    timestamps: false, // Igual que en ImplementModel
  }
);