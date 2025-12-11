import { Transaction } from "sequelize";
import {ImplementEntity} from "../entities/ImplementEntity";

export interface IImplementRepository {
  findAll(): Promise<ImplementEntity[]>;
  findById(id: number): Promise<ImplementEntity | null>;
  findByIdGroup(idGroup: number): Promise<ImplementEntity[]>;
  findByStatus(status: string): Promise<ImplementEntity[]>;
  save(implement: ImplementEntity): Promise<ImplementEntity>;
  updatePartial(id: number, data: Partial<ImplementEntity>): Promise<ImplementEntity>;
  updatePartialData(id: number, data: Partial<ImplementEntity>, t: Transaction): Promise<ImplementEntity>;

  updateMany(data: Partial<ImplementEntity>[]): Promise<void>;
  // delete(id: number): Promise<void>;
}