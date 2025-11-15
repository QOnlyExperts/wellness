// src/domain/interfaces/IPhoneRepository.ts
import { PhoneEntity } from "../entities/PhoneEntity";

export interface IPhoneRepository {
  findAll(): Promise<PhoneEntity[]>;
  findById(id: number): Promise<PhoneEntity | null>;
   
  findByNumber(number: bigint): Promise<PhoneEntity | null>;

  findByInfoPersonId(infoPersonId: number): Promise<PhoneEntity[]>;

  save(phone: PhoneEntity): Promise<PhoneEntity>;
}