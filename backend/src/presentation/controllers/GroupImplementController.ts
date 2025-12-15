import { NextFunction, Request, Response } from "express"; // O el framework que uses
import { CreateGroupImplement } from "../../application/use-cases/group-implements/CreateGroupImplement";
import { GetGroupImplements } from "../../application/use-cases/group-implements/GetGroupImplements";
import { GetGroupImplementById } from "../../application/use-cases/group-implements/GetGroupImplementById";
import { UpdateGroupImplement } from "../../application/use-cases/group-implements/UpdateGroupImplement";
// Importa la función que resuelve el caso de uso desde el Composition Root
import { resolveCreateGroupImplementUseCase, resolveGetGroupImplementsUseCase, resolveGetGroupImplementByIdUseCase, resolveUpdateGroupImplementUseCase, resolveGetGroupImplementBySearchUseCase } from "../../composition/compositionRoot";
import { GroupImplementInputDto } from "../../application/dtos/group-implements/GroupImplementInputDto";
import z, { success } from "zod";


import { idSchema } from "../../application/schemas/IdSchema";
import { GetGroupImplementBySearch } from "../../application/use-cases/group-implements/GetGroupImplementBySearch";
import { GroupImplementFindDto } from "../../application/dtos/group-implements/GroupImplementFindDto";

export class GroupImplementController {
  // Declara una propiedad para el caso de uso
  private createGroupImplementUseCase: CreateGroupImplement;
  private getGroupImplementUseCase: GetGroupImplements;
  private getGroupImplementByIdUseCase: GetGroupImplementById;
  private updateGroupImplementUseCase: UpdateGroupImplement;
  private getGroupImplementBySearchUseCase: GetGroupImplementBySearch;

  constructor() {
    // En el constructor, obtienes la instancia ya configurada
    // Aquí ocurre la "inyección" real, pero la lógica de creación está centralizada
    this.createGroupImplementUseCase = resolveCreateGroupImplementUseCase();
    this.getGroupImplementUseCase = resolveGetGroupImplementsUseCase();
    this.getGroupImplementByIdUseCase = resolveGetGroupImplementByIdUseCase();
    this.updateGroupImplementUseCase = resolveUpdateGroupImplementUseCase();
    this.getGroupImplementBySearchUseCase = resolveGetGroupImplementBySearchUseCase();
  }
  public async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // Extraemos los datos del cuerpo de la solicitud
      const { name, max_hours} = req.body as GroupImplementInputDto;
      // Validar y traducir el cuerpo de la petición a un DTO de entrada
      const inputDto: GroupImplementInputDto = {
        name: name,
        max_hours: max_hours
      };
      // Ejecutar el caso de uso con el DTO actualizado
      const newGroupImplement = await this.createGroupImplementUseCase.execute(inputDto);
      // Devuelve la respuesta al cliente
      return res.status(201).json({
        success: true,
        message: "Grupo de Implementos creado exitosamente.",
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
        message: "Lista de Grupos de Implementos obtenida exitosamente.",
        data: groupImplements
      });
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {

      const result = idSchema.safeParse({id: req.params.id});
      
      if (!result.success) {
        const formattedError = z.treeifyError(result.error);
        // Error de validación
        return res.status(400).json({
          success: false,
          message: "Parámetro inválido",
          errors: formattedError.properties?.id?.errors.map(e => ({
            path: "id",
            message: e
          })),
        });
      }

      // Ahora TypeScript sabe que result.success === true
      const id = result.data.id; // número seguro

      const groupImplement = await this.getGroupImplementByIdUseCase.execute(id);
      return res.status(200).json({
        success: true,
        message: "Grupo de Implementos obtenido exitosamente.",
        data: groupImplement
      });
    } catch (error) {
      next(error);
    }
  }

  public async getBySearch(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {

      const { name, prefix } = req.query;

      const inputDto: GroupImplementFindDto = {
        name: name as string | undefined,
        prefix: prefix as string | undefined
      };

      const groupImplements = await this.getGroupImplementBySearchUseCase.execute(inputDto);
      return res.status(200).json({
        success: true,
        message: "Grupo de Implementos obtenidos exitosamente.",
        data: groupImplements
      });
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {

      const result = idSchema.safeParse({id: req.params.id});
      
      if (!result.success) {
        const formattedError = z.treeifyError(result.error);
        // Error de validación
        return res.status(400).json({
          success: false,
          message: "Parámetro inválido",
          errors: formattedError.properties?.id?.errors.map(e => ({
            path: "id",
            message: e
          })),
        });
      }

      // Ahora TypeScript sabe que result.success === true
      const id = result.data.id; // número seguro
      const { name, max_hours } = req.body as GroupImplementInputDto;

      const updatedGroupImplement = await this.updateGroupImplementUseCase.execute(id, {
        name,
        max_hours
      });

      return res.status(200).json({
        success: true,
        message: "Grupo de Implementos actualizado exitosamente.",
        data: updatedGroupImplement
      });
    } catch (error) {
      next(error);
    }
  }
}