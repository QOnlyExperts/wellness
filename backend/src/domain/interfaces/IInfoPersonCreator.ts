import { Transaction } from "sequelize";
import { InfoPersonInputDto } from "../../application/dtos/info-person/InfoPersonInputDto";
import { InfoPersonOutputDto } from "../../application/dtos/info-person/InfoPersonOutputDto";

// interfaces/IInfoPersonCreator.ts
export interface IInfoPersonCreator {
  execute(input: InfoPersonInputDto, t: Transaction): Promise<InfoPersonOutputDto>;
}