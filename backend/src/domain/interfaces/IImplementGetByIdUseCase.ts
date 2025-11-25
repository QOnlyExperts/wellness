import { ImplementOutputDto } from "../../application/dtos/implements/ImplementOutputDto";

export interface IImplementGetByIdUseCase {
  execute(id: number): Promise<ImplementOutputDto>;
}