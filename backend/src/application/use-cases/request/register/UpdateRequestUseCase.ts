import { IImplementUpdateStatusUseCase } from "../../../../domain/interfaces/IImplementUpdateStatusUseCase";
import { IRequestUpdateUseCase } from "../../../../domain/interfaces/IRequestUpdateUseCase";
import db from "../../../../infrastructure/database/db";
import { UpdateRequestInputDto } from "../../../dtos/requests/register/UpdateRequestInputDto";
import { UpdateRequestOutputDto } from "../../../dtos/requests/register/UpdateRequestOutputDto";


export class UpdateRequestUseCase {
  constructor(
    private readonly requestUpdateUseCase: IRequestUpdateUseCase,
    private readonly implementUpdateStatusUseCase: IImplementUpdateStatusUseCase
  ){}

  async execute(input: UpdateRequestInputDto): Promise<UpdateRequestOutputDto>{
    
    const t = await db.transaction();

    try{
      console.log(input)

      // Actualizamos el estado del implemento
      await this.implementUpdateStatusUseCase.execute(
        input.implement_id, {
          status: input.implement_status
        },
        t
      );

      // Actualizamos la solicitud y asociamos el implemento con la solicitud
      const request = await this.requestUpdateUseCase.execute(
        input.request_id, {
          status: input.status,
          limited_at: input.limited_at,
          implement_id: input.implement_id,
        },
        t
      );
      
      await t.commit();

      return {
        request_id: request.request_id
      }

    }catch(e) {
      await t.rollback();
      throw e;
    }
  }
}