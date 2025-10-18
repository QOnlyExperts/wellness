import { NextFunction, Request, Response } from "express"; // O el framework que uses
import { CreateGroupImplement } from "../../application/use-cases/group-implements/CreateGroupImplement";
import { GetGroupImplements } from "../../application/use-cases/group-implements/GetGroupImplements";
// Importa la función que resuelve el caso de uso desde el Composition Root
import { resolveCreateGroupImplementUseCase, resolveGetGroupImplementsUseCase } from "../../composition/compositionRoot";
import { GroupImplementInputDto } from "../../application/dtos/group-implements/GroupImplementInputDto";
import { success } from "zod";

export class GroupImplementController {
  // Declara una propiedad para el caso de uso
  private createGroupImplementUseCase: CreateGroupImplement;
  private getGroupImplementUseCase: GetGroupImplements;

  constructor() {
    // En el constructor, obtienes la instancia ya configurada
    // Aquí ocurre la "inyección" real, pero la lógica de creación está centralizada
    this.createGroupImplementUseCase = resolveCreateGroupImplementUseCase();
    this.getGroupImplementUseCase = resolveGetGroupImplementsUseCase();
  }
  public async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // Extraemos los datos del cuerpo de la solicitud
      const { name, max_hours, time_limit } = req.body as GroupImplementInputDto;
      // Validar y traducir el cuerpo de la petición a un DTO de entrada
      const inputDto: GroupImplementInputDto = {
        name: name,
        max_hours: max_hours,
        time_limit: time_limit
      };
      // Ejecutar el caso de uso con el DTO actualizado
      const newGroupImplement = await this.createGroupImplementUseCase.execute(inputDto);
      // Devuelve la respuesta al cliente
      return res.status(201).json({
        success: true,
        data: newGroupImplement
      });
    } catch (error) {
      next(error);
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const groupImplements = await this.getGroupImplementUseCase.execute();
      return res.status(200).json({
        success: true,
        data: groupImplements
      });
    } catch (error) {
      next(error);
    }
  }
}