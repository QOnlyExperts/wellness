import { NextFunction, Request, Response } from "express"; // O el framework que uses

import { GetInfoPersonByIdUserUseCase } from "../../application/use-cases/info-person/GetInfoPersonByIdUserUseCase";
import { resolveGetInfoPersonByIdUserUseCase } from "../../composition/compositionRoot";
import { idSchema } from "../../application/schemas/IdSchema";
import z from "zod";

export class InfoPersonController {
  private getInfoPersonByIdUserUseCase: GetInfoPersonByIdUserUseCase;

  constructor() {
    this.getInfoPersonByIdUserUseCase = resolveGetInfoPersonByIdUserUseCase();
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
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
      const infoPersonId = await this.getInfoPersonByIdUserUseCase.execute(id);
    } catch (e) {
      next(e);
    }
  }
}
