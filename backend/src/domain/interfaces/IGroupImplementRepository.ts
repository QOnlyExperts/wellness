import { GroupImplementEntity } from "../entities/GroupImplementEntity";

export interface IGroupImplementRepository {
  findAll(): Promise<GroupImplementEntity[]>;
  findById(id: number): Promise<GroupImplementEntity | null>;
  findByName(name: string): Promise<GroupImplementEntity | null>;
  save(implement: GroupImplementEntity): Promise<GroupImplementEntity>;
  // update(implement: GroupImplementEntity): Promise<GroupImplementEntity>;
  // delete(id: number): Promise<void>;
}