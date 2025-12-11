

import { RequestInputDto } from "../../application/dtos/requests/RequestInputDto";
import { RequestOutputDto } from "../../application/dtos/requests/RequestOutputDto";


export interface IRequestCreator {
  execute(input: RequestInputDto): Promise<RequestOutputDto>;
}