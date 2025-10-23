import { ImgEntity } from "../entities/ImgEntity";


export interface IImgRepository {
  save(img: ImgEntity): Promise<ImgEntity>;
}