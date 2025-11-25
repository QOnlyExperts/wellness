import { IRequestCreator } from "../../../../domain/interfaces/IRequestCreator";
import { IImplementGetByIdUseCase } from "../../../../domain/interfaces/IImplementGetByIdUseCase";
import { RegisterRequestInputDto } from "../../../dtos/requests/register/RegisterRequestInputDto";
import { IInfoPersonGetByIdUserUseCase } from "../../../../domain/interfaces/IInfoPersonGetByIdUserUseCase";
import { ConflictError, DomainError, NotFoundError } from "../../../../shared/errors/DomainErrors";
import { RegisterRequestOutputDto } from "../../../dtos/requests/register/RegisterRequestOutputDto";

export class RegisterRequestUseCase {
  constructor(
    private readonly requestCreator: IRequestCreator,
    private readonly infoPersonGetByIdUserUseCase: IInfoPersonGetByIdUserUseCase,
    private readonly implementGetByIdUseCase: IImplementGetByIdUseCase
  ) {}

  async execute(input: RegisterRequestInputDto): Promise<RegisterRequestOutputDto> {
    // const t: Transaction = await db.transaction();

    // 1. Confía en que el Use Case de búsqueda lanzará NotFoundError si no existe.
    const infoPerson = await this.infoPersonGetByIdUserUseCase.execute(
      input.user_id // Consultamos el id de persona con el id del usuario
    );
    const implement = await this.implementGetByIdUseCase.execute(
      input.implement_id // Consultamos el implemento por id y validamos si existe o si esta en uso
    );

    // 2. Regla de negocio de coordinación (ESTÁ EN EL LUGAR CORRECTO)
    // Si es borrowed (Ocupado) salta un error 
    if(implement.status === "borrowed"){
      throw new ConflictError("El implemento ya se encuentra en uso");
    }

    // Si todo se encuentra bien
    // 3. Crear solicitud
    const request = await this.requestCreator.execute(
      {
        info_person_id: infoPerson.id, // infoPerson.id! Se confía en que va a ser un numero
        implement_id: input.implement_id,
      }
    );

    // Esta información se le envía al administrador
    return{
      request_id: request.id,
      user_id: input.user_id, // Enviamos el mismo id de entrada ya que deberá consultar toda la información del estudiante
      implement_id: input.implement_id
    }
  }
}
