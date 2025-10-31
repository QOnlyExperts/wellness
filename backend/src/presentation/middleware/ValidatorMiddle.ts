import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod"; // Importamos 'z' y 'ZodError'

// Definición de la clase Validator
export class Validator {
  /**
   * Crea un middleware Express que valida el cuerpo de la petición (req.body)
   * contra un esquema de Zod dado.
   * @param schema El esquema de Zod a usar. Usamos z.ZodType en lugar de ZodSchema.
   * @returns Un middleware Express.
   */
  static validateSchema =
    (schema: z.ZodType<any, any, any>) =>
    (req: Request, res: Response, next: NextFunction) => {
      // ... (El resto de la lógica permanece igual)
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const zodError = result.error as ZodError;

        return res.status(400).json({
          success: false,
          message: "Datos de la petición inválidos",
          errors: zodError.issues.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
      }

      req.body = result.data;
      next();
    };
}
