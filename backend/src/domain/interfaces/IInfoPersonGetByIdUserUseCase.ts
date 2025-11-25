import { Transaction } from "sequelize";
import { InfoPersonOutputDto } from "../../application/dtos/info-person/InfoPersonOutputDto";

// interfaces/IInfoPersonCreator.ts
export interface IInfoPersonGetByIdUserUseCase {
  execute(input: number): Promise<InfoPersonOutputDto>;
}