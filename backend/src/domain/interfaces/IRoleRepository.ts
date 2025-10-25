// src/domain/interfaces/IRoleRepository.ts
import { RoleEntity } from "../entities/RoleEntity";

/**
 * Define el contrato para el repositorio de Roles.
 * Sigue el mismo patrón que ICategoryRepository.
 */
export interface IRoleRepository {
  /**
   * Busca y devuelve todos los roles.
   * @returns Una promesa que resuelve a un arreglo de RoleEntity.
   */
  findAll(): Promise<RoleEntity[]>;

  /**
   * Busca un rol por su ID.
   * @param id El ID del rol a buscar.
   * @returns Una promesa que resuelve a una RoleEntity o null si no se encuentra.
   */
  findById(id: number): Promise<RoleEntity | null>;

  /**
   * Busca un rol por su nombre.
   * @param name El nombre del rol a buscar.
   * @returns Una promesa que resuelve a una RoleEntity o null si no se encuentra.
   */
  findByName(name: string): Promise<RoleEntity | null>;

  /**
   * Guarda (crea o actualiza) un rol.
   * @param role La entidad de rol a guardar.
   * @returns Una promesa que resuelve a la entidad de rol guardada.
   */
  save(role: RoleEntity): Promise<RoleEntity>;
}