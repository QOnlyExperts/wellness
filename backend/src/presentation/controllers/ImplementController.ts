// -- src/infrastructure/controllers/ImplementController.ts --

import { Request, Response } from "express"; // O el framework que uses
import { CreateImplement } from "../../application/use-cases/implements/CreateImplement";
// Importa la función que resuelve el caso de uso desde el Composition Root
import { resolveCreateImplementUseCase } from "../../composition/compositionRoot";
import { CreateImplementInputDto } from "../../application/dtos/implements/CreateImplement.input";

export class ImplementController {
  // Declara una propiedad para el caso de uso
  private createImplementUseCase: CreateImplement;

  constructor() {
    // En el constructor, obtienes la instancia ya configurada
    // Aquí ocurre la "inyección" real, pero la lógica de creación está centralizada
    this.createImplementUseCase = resolveCreateImplementUseCase();
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      // Extraemos los datos del cuerpo de la solicitud
      const { prefix, status, condition, group_implement_id, categories_id } = req.body;
      
      console.log("Received prefix:", prefix );
      // Validar y traducir el cuerpo de la petición a un DTO de entrada
      const inputDto: CreateImplementInputDto = {
        prefix: prefix,
        status: status,
        condition: condition,
        group_implement_id: group_implement_id,
        categories_id: categories_id
      };
      // Ejecutar el caso de uso con el DTO actualizado
      const newImplement = await this.createImplementUseCase.execute(inputDto);

      // Devuelve la respuesta al cliente
      return res.status(201).json(newImplement);
    } catch (error) {
      console.error("Error creating implement:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
