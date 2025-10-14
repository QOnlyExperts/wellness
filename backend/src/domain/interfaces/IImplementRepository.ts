import {ImplementEntity} from "../entities/ImplementEntity";

export interface IImplementRepository {
  // Define methods for the repository, e.g.:
  // findAll(): Promise<ImplementEntity[]>;
  findById(id: number): Promise<ImplementEntity | null>;
  save(implement: ImplementEntity): Promise<ImplementEntity>;
  // update(implement: ImplementEntity): Promise<ImplementEntity>;
  // delete(id: number): Promise<void>;
}