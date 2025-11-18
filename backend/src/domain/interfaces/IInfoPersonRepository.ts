import { InfoPersonEntity } from "../entities/InfoPersonEntity";
import { Transaction } from "sequelize";

export interface IInfoPersonRepository {
  findAll(): Promise<InfoPersonEntity[]>;
  findByIdentification(identification: string): Promise<InfoPersonEntity | null>;
  findById(id: number): Promise<InfoPersonEntity | null>;
  save(data: InfoPersonEntity, t: Transaction): Promise<InfoPersonEntity>;
  // updatePassword(id: number, data: Partial<InfoPersonEntity>): Promise<InfoPersonEntity>;
  // updatePartial(id: number, data: Partial<InfoPersonEntity>): Promise<InfoPersonEntity>;
}