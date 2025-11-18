import db from '../../infrastructure/database/db';

import { NextFunction, Request, Response } from "express"; // O el framework que uses

import { RegisterUserUseCase } from "../../application/use-cases/users/register/RegisterUserUseCase";

import { resolveRegisterUserUseCase } from "../../composition/compositionRoot";

import { RegisterUserInputDto } from "../../application/dtos/users/register/RegisterUserInputDto";


export class UserController {
  private registerUserUseCase: RegisterUserUseCase;

  constructor(){
    this.registerUserUseCase = resolveRegisterUserUseCase();
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try{
      const body = req.body;
      console.log(body);

      const inputDto: RegisterUserInputDto = body;
      // Pasamos la entrada de usuario y la transaccion
      const registerUser = await this.registerUserUseCase.execute(inputDto);

      return res.status(201).json({
        success: true,
        message: "Usuario creado correctamente",
        data: registerUser
      })

    }catch(error){
      next(error);
    }
  }
}
