// domain/interfaces/ICategoryRepository.ts

import { CategoryEntity } from "../entities/CategoryEntity";

/**
 * La interfaz del repositorio para Category define los métodos que deben ser
 * implementados por la capa de infraestructura (la base de datos).
 * Esto permite que el dominio (la lógica de negocio) no dependa directamente
 * de la tecnología de la base de datos.
 */
export interface ICategoryRepository {
  /**
   * Busca y devuelve todas las entidades de categoría.
   * @returns Una promesa que resuelve a un arreglo de CategoryEntity.
   */
  findAll(): Promise<CategoryEntity[]>;

  /**
   * Busca una entidad de categoría por su ID.
   * @param id El ID de la categoría a buscar.
   * @returns Una promesa que resuelve a una CategoryEntity o null si no se encuentra.
   */
  findById(id: number): Promise<CategoryEntity | null>;

  findByName(name: string): Promise<CategoryEntity | null>;

  /**
   * Guarda (crea o actualiza) una entidad de categoría.
   * @param category La entidad de categoría a guardar.
   * @returns Una promesa que resuelve a la entidad de categoría guardada.
   */
  save(category: CategoryEntity): Promise<CategoryEntity>;

  /**
   * Actualiza una entidad de categoría existente.
   * @param category La entidad de categoría con los datos actualizados.
   * @returns Una promesa que resuelve a la entidad de categoría actualizada.
   */
  // update(category: CategoryEntity): Promise<CategoryEntity>;

  /**
   * Elimina una entidad de categoría por su ID.
   * @param id El ID de la categoría a eliminar.
   * @returns Una promesa que se resuelve cuando la eliminación está completa.
   */
  // delete(id: number): Promise<void>;
}