import { Transaction } from "sequelize";
import { InfoPersonEntity } from "../../domain/entities/InfoPersonEntity";
import { IInfoPersonRepository } from "../../domain/interfaces/IInfoPersonRepository";
import { InfoPersonModel } from "../models/indexModel";
import { InfoPersonMapper } from "../../application/mappers/InfoPersonMapper";

export class SequelizeInfoPersonRepository implements IInfoPersonRepository {

  async findAll(): Promise<InfoPersonEntity[]> {
    const infoList = await InfoPersonModel.findAll({});

    return infoList.map(info => InfoPersonMapper.toDomain(info.toJSON()));
  }

  async findByIdentification(identification: string): Promise<InfoPersonEntity | null> {
    const info = await InfoPersonModel.findOne({
      where: {
        identification
      }
    });

    if(!info) {
      return null;
    }

    return InfoPersonMapper.toDomain(info?.toJSON());
  }

  async findById(id: number): Promise<InfoPersonEntity | null> {
    // Hay que retornar con el programa asociado al usuario
    const info = await InfoPersonModel.findByPk(id);

    if(!info) {
      return null;
    }

    return InfoPersonMapper.toDomain(info?.toJSON());
  }

  async save(data: InfoPersonEntity, t: Transaction): Promise<InfoPersonEntity> {
    const persistenceData = await InfoPersonMapper.toPersistence(data);
    const saveModel = await InfoPersonModel.create(persistenceData, {
      transaction: t
    });

    return InfoPersonMapper.toDomain(saveModel.toJSON());
  }
}