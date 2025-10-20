import { IGroupImplementRepository } from "../../domain/interfaces/IGroupImplementRepository";
import { GroupImplementEntity } from "../../domain/entities/GroupImplementEntity";
import { GroupImplementModel } from "../models/GroupImplementModel";
import { GroupImplementMapper } from "../../application/mappers/GroupImplementMapper";

export class SequelizeGroupImplementRepository implements IGroupImplementRepository {
  
  async findAll(): Promise<GroupImplementEntity[]> {
    const records = await GroupImplementModel.findAll();
    return records.map(record => GroupImplementMapper.toDomain(record.toJSON()));
  }

  async findById(id: number): Promise<GroupImplementEntity | null> {
    const record = await GroupImplementModel.findByPk(id);
    if (!record) return null;
    return GroupImplementMapper.toDomain(record.toJSON());
  }

  async findByName(name: string): Promise<GroupImplementEntity | null> {
    const record = await GroupImplementModel.findOne({ where: { name } });
    return record ? GroupImplementMapper.toDomain(record.toJSON()) : null;
  }

  async findByPrefix(prefix: string): Promise<GroupImplementEntity | null> {
    const record = await GroupImplementModel.findOne({ where: { prefix } });
    return record ? GroupImplementMapper.toDomain(record.toJSON()) : null;
  }

  async save(entity: GroupImplementEntity): Promise<GroupImplementEntity> {
    const persistenceData = GroupImplementMapper.toPersistence(entity);
    let record: GroupImplementModel;

    if (entity.id) {
      await GroupImplementModel.update(persistenceData, { where: { id: entity.id } });
      record = await GroupImplementModel.findByPk(entity.id) as GroupImplementModel;
    } else {
      record = await GroupImplementModel.create(persistenceData);
    }

    return GroupImplementMapper.toDomain(record.toJSON());
  }

}
