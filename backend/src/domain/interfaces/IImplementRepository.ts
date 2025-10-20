import {ImplementEntity} from "../entities/ImplementEntity";

export interface IImplementRepository {
  findAll(): Promise<ImplementEntity[]>;
  findById(id: number): Promise<ImplementEntity | null>;
  findByIdGroup(idGroup: number): Promise<ImplementEntity[]>;
  save(implement: ImplementEntity): Promise<ImplementEntity>;
  // update(implement: ImplementEntity): Promise<ImplementEntity>;
  // delete(id: number): Promise<void>;
}