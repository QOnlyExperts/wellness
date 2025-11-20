import db from '../../infrastructure/database/db';

import { NextFunction, Request, Response } from "express"; // O el framework que uses

import { RegisterUserUseCase } from "../../application/use-cases/users/register/RegisterUserUseCase";

import { 
  resolveGetUserByIdUseCase, 
  resolveRegisterUserUseCase,
  resolveGetUsersUseCase
} from "../../composition/compositionRoot";

import { RegisterUserInputDto } from "../../application/dtos/users/register/RegisterUserInputDto";
import { GetUserByIdUseCase } from '../../application/use-cases/users/GetUserByIdUseCase';
import { idSchema } from '../../application/schemas/IdSchema';

import z, { success } from "zod";
import { GetUsersUseCase } from '../../application/use-cases/users/GetUsersUSeCase';


export class UserController {
  private registerUserUseCase: RegisterUserUseCase;
  private getUserByIdUseCase: GetUserByIdUseCase;
  private getUsersUseCase: GetUsersUseCase;

  constructor() {
    this.registerUserUseCase = resolveRegisterUserUseCase();
    this.getUserByIdUseCase = resolveGetUserByIdUseCase();
    this.getUsersUseCase = resolveGetUsersUseCase();
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const body = req.body;
      console.log(body);

      const inputDto: RegisterUserInputDto = body;
      // Pasamos la entrada de usuario y la transaccion
      const registerUser = await this.registerUserUseCase.execute(inputDto);

      return res.status(201).json({
        success: true,
        message: "Usuario creado correctamente",
        data: registerUser,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const result = idSchema.safeParse({ id: req.params.id });

      if (!result.success) {
        const formattedError = z.treeifyError(result.error);
        // Error de validación
        return res.status(400).json({
          success: false,
          message: "Parámetro inválido",
          errors: formattedError.properties?.id?.errors.map((e) => ({
            path: "id",
            message: e,
          })),
        });
      }

      const id = result.data.id; // número seguro
      
      const user = await this.getUserByIdUseCase.execute(id);
      return res.status(200).json({
        success: true,
        message: "Usuario obtenido correctamente",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      // Aquí deberías implementar la lógica para obtener todos los usuarios
      // Por ejemplo, podrías tener un caso de uso llamado GetUsersUseCase
      const users = await this.getUsersUseCase.execute(); 
      return res.status(200).json({
        success: true,
        message: "Lista de usuarios obtenida correctamente",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
}
