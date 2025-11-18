// src/domain/interfaces/IProgramRepository.ts
import { ProgramEntity } from "../entities/ProgramEntity";

/**
 * Define el contrato para el repositorio de Programas.
 * Sigue el patrón de IGroupImplementRepository.ts
 */
export interface IProgramRepository {
  findAll(): Promise<ProgramEntity[]>;
  findById(id: number): Promise<ProgramEntity | null>;
  findByName(name: string): Promise<ProgramEntity | null>;
  
  /**
   * Basado en el patrón findByPrefix de GroupImplement, 
   * añadimos findByCod para buscar por el código de programa.
   */
  findByCod(cod: string): Promise<ProgramEntity | null>;

  save(program: ProgramEntity): Promise<ProgramEntity>;
}