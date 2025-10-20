import { ICategoryRepository } from "../../domain/interfaces/ICategoryRepository";
import { CategoryEntity } from "../../domain/entities/CategoryEntity";
import { CategoryModel } from "../models/CategoryModel";
import { CategoryMapper } from "../../application/mappers/CategoryMapper";

/**
 * Implementación del repositorio de categorías utilizando Sequelize.
 * Se encarga de las operaciones de base de datos para las categorías.
 */
export class SequelizeCategoryRepository implements ICategoryRepository {
  /**
   * Busca todas las categorías en la base de datos.
   */
  async findAll(): Promise<CategoryEntity[]> {
    const categoryModels = await CategoryModel.findAll();
    // Mapea cada modelo de Sequelize a una entidad de dominio.
    return categoryModels.map((model) => CategoryMapper.toDomain(model.toJSON()));
  }

  /**
   * Busca una categoría por su ID.
   */
  async findById(id: number): Promise<CategoryEntity | null> {
    const categoryModel = await CategoryModel.findByPk(id);
    if (!categoryModel) {
      return null;
    }
    return CategoryMapper.toDomain(categoryModel.toJSON());
  }

  /**
   * Busca una categoría por su nombre.
   */
  async findByName(name: string): Promise<CategoryEntity | null> {
    const categoryModel = await CategoryModel.findOne({ where: { name } });
    if (!categoryModel) {
      return null;
    }
    return CategoryMapper.toDomain(categoryModel.toJSON());
  }

  /**
   * Guarda (crea o actualiza) una categoría en la base de datos.
   */
  async save(category: CategoryEntity): Promise<CategoryEntity> {
    const persistenceData = CategoryMapper.toPersistence(category);
    let savedModel: CategoryModel;

    // Si la entidad ya tiene un ID válido, es una actualización.
    if (category.id && category.id !== 0) {
      await CategoryModel.update(persistenceData, { where: { id: category.id } });
      // Re-buscamos el modelo para devolver la instancia actualizada.
      savedModel = (await CategoryModel.findByPk(category.id))!;
    } else {
      // Si no tiene ID, es una creación.
      // El método `create` de Sequelize devuelve el objeto creado, incluyendo el nuevo ID.
      savedModel = await CategoryModel.create(persistenceData);
    }

    // Mapeamos el modelo guardado de vuelta a una entidad de dominio para devolverlo.
    return CategoryMapper.toDomain(savedModel.toJSON());
  }
}