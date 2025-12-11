import { IImgRepository } from "../../domain/interfaces/IImgRepository";
import { ImgEntity } from "../../domain/entities/ImgEntity";
import { ImgModel } from "../models/IndexModel";
import { ImgMapper } from "../../application/mappers/ImgMapper";

export class SequelizeImgRepository implements IImgRepository {
  async save(img: ImgEntity): Promise<ImgEntity> {
    const persistenceData = ImgMapper.toPersistence(img);
    const saveModel: ImgModel = await ImgModel.create(persistenceData);

    return ImgMapper.toDomain(saveModel.toJSON());
  }
}