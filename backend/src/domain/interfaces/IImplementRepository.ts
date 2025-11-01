import {ImplementEntity} from "../entities/ImplementEntity";

export interface IImplementRepository {
  findAll(): Promise<ImplementEntity[]>;
  findById(id: number): Promise<ImplementEntity | null>;
  findByIdGroup(idGroup: number): Promise<ImplementEntity[]>;
  save(implement: ImplementEntity): Promise<ImplementEntity>;
  updatePartial(id: number, data: Partial<ImplementEntity>): Promise<ImplementEntity>;
  updateMany(data: Partial<ImplementEntity>[]): Promise<void>;
  // delete(id: number): Promise<void>;
}