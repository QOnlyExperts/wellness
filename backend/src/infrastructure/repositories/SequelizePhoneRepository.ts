import { IPhoneRepository } from "../../domain/interfaces/IPhoneRepository";
import { PhoneEntity } from "../../domain/entities/PhoneEntity";
import { PhoneModel } from "../models/PhoneModel";
import { PhoneMapper } from "../../application/mappers/PhoneMapper";


export class SequelizePhoneRepository implements IPhoneRepository {

  async findAll(): Promise<PhoneEntity[]> {
    const records = await PhoneModel.findAll();
   
    return records.map(record => PhoneMapper.toDomain(record.toJSON()));
  }

  async findById(id: number): Promise<PhoneEntity | null> {
    const record = await PhoneModel.findByPk(id);
    if (!record) return null;
    return PhoneMapper.toDomain(record.toJSON());
  }

  async findByNumber(number: bigint): Promise<PhoneEntity | null> {
    const record = await PhoneModel.findOne({ where: { number } });
    return record ? PhoneMapper.toDomain(record.toJSON()) : null;
  }

  async findByInfoPersonId(infoPersonId: number): Promise<PhoneEntity[]> {
    const records = await PhoneModel.findAll({ where: { info_person_id: infoPersonId } });
    return records.map(record => PhoneMapper.toDomain(record.toJSON()));
  }

  async save(entity: PhoneEntity): Promise<PhoneEntity> {
    const persistenceData = PhoneMapper.toPersistence(entity);
    let record: PhoneModel;

    // Lógica de guardar/actualizar idéntica
    if (entity.id && entity.id !== 0) {
      // Actualizar
      await PhoneModel.update(persistenceData, { where: { id: entity.id } });
      record = (await PhoneModel.findByPk(entity.id))!;
    } else {
      // Crear
      const { id, ...dataToCreate } = persistenceData;
      record = await PhoneModel.create(dataToCreate);
    }

    return PhoneMapper.toDomain(record.toJSON());
  }
}