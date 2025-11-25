import { NextFunction, Request, Response } from "express"; // O el framework que uses

import { GetInfoPersonByIdUserUseCase } from "../../application/use-cases/info-person/GetInfoPersonByIdUserUseCase";
import { 
  resolveGetInfoPersonByIdUserUseCase
} from "../../composition/compositionRoot";
import { idSchema } from "../../application/schemas/IdSchema";


export class InfoPersonController {
  private getInfoPersonByIdUserUseCase
}