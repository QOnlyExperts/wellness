import { NextFunction, Request, Response } from "express";
import { LoginInputDto } from "../../application/dtos/users/login/LoginInputDto";
import { resolveLoginUseCase } from "../../composition/compositionRoot";
import { LoginUseCase } from "../../application/use-cases/users/login/LoginUseCase";

export class LoginController {


  private loginUseCase: LoginUseCase;

  constructor(){
    this.loginUseCase = resolveLoginUseCase();
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try{
      const body = req.body;

      const inputDto: LoginInputDto = body;

      const loginResult = await this.loginUseCase.execute(inputDto);

      res.cookie('access_token', loginResult.token, {
        httpOnly: true,
        secure: true, // true si es https
        sameSite: 'lax',
      });

      // Eliminamos el token
      const { token, ...rest } = loginResult;
      const newObj = rest;

      return res.status(200).json({
        success: true,
        message: "Login exitoso",
        data: newObj
      })

    }catch(error){
      next(error);
    }
  }

}