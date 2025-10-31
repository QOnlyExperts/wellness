import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import {
  resolveCreateRoleUseCase,
  resolveGetRolesUseCase,
  resolveGetRoleByIdUseCase,
  resolveUpdateRoleUseCase,
} from "../../composition/compositionRoot"; // <-- Los crearemos en el siguiente paso

import { idSchema } from "../../application/schemas/IdSchema";
import { RoleSchema } from "../../application/schemas/RoleSchema";

export class RoleController {
  // Obtenemos todos los casos de uso necesarios
  private createRoleUseCase = resolveCreateRoleUseCase();
  private getRolesUseCase = resolveGetRolesUseCase();
  private getRoleByIdUseCase = resolveGetRoleByIdUseCase();
  private updateRoleUseCase = resolveUpdateRoleUseCase();

  public async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const validatedData = RoleSchema.parse(req.body);
      const newRole = await this.createRoleUseCase.execute(validatedData);
      
      return res.status(201).json({
        success: true,
        message: "Rol creado exitosamente.",
        data: newRole,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const roles = await this.getRolesUseCase.execute();
      
      return res.status(200).json({
        success: true,
        message: "Lista de roles obtenida exitosamente.",
        data: roles,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const result = idSchema.safeParse({ id: req.params.id });

      if (!result.success) {
        const formattedError = z.treeifyError(result.error);
        return res.status(400).json({
          success: false,
          message: "Parámetro de ID inválido.",
          errors: formattedError.properties?.id?.errors,
        });
      }
      
      const id = result.data.id;
      const role = await this.getRoleByIdUseCase.execute(id);
      
      return res.status(200).json({
        success: true,
        message: "Rol obtenido exitosamente.",
        data: role,
      });
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const result = idSchema.safeParse({ id: req.params.id });

      if (!result.success) {
        const formattedError = z.treeifyError(result.error);
        return res.status(400).json({
          success: false,
          message: "Parámetro de ID inválido.",
          errors: formattedError.properties?.id?.errors,
        });
      }

      const id = result.data.id;
      const dataToUpdate = RoleSchema.partial().parse(req.body);

      const updatedRole = await this.updateRoleUseCase.execute(id, dataToUpdate);
      
      return res.status(200).json({
        success: true,
        message: "Rol actualizado exitosamente.",
        data: updatedRole,
      });
    } catch (error) {
      next(error);
    }
  }
}