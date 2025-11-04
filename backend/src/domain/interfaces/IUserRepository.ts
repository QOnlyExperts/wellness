import { UserEntity } from "../entities/UserEntity";
import { Transaction } from "sequelize";

export interface IUserRepository {
  findAll(): Promise<UserEntity[]>;
  findById(id: number): Promise<UserEntity | null>;
  findByIdProfile(id: number): Promise<UserEntity | null>;
  save(user: UserEntity, t: Transaction): Promise<UserEntity>;
  updatePassword(id: number, data: Partial<UserEntity>): Promise<UserEntity>;
  // updatePartial(id: number, data: Partial<UserEntity>): Promise<UserEntity>;
}