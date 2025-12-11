import { ImplementInputDto } from "../../application/dtos/implements/ImplementInputDto";

export interface IImplementCreator {
  execute(input: ImplementInputDto): Promise<ImplementInputDto>;
}