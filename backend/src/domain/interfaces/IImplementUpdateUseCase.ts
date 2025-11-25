import { Transaction } from "sequelize";
import { ImplementOutputDto } from "../../application/dtos/implements/ImplementOutputDto";
import { ImplementEntity } from "../entities/ImplementEntity";


export interface IImplementUpdateUseCase {
  execute(id: number, update: Partial<ImplementEntity>, t: Transaction): Promise<ImplementOutputDto>;
}