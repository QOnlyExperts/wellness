import { Transaction } from "sequelize";
import { UpdateRequestOutputDto } from "../../application/dtos/requests/register/UpdateRequestOutputDto";
import { RequestEntity } from "../entities/RequestEntity";


export interface IRequestUpdateUseCase {
  execute(id: number, update: Partial<RequestEntity>, t: Transaction): Promise<UpdateRequestOutputDto>;
}