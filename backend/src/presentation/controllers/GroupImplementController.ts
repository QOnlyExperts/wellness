import { Request, Response } from "express"; // O el framework que uses
import { CreateGroupImplement } from "../../application/use-cases/group-implements/CreateGroupImplement";
// Importa la función que resuelve el caso de uso desde el Composition Root
import { resolveCreateGroupImplementUseCase } from "../../composition/compositionRoot";
import { GroupImplementInputDto } from "../../application/dtos/group-implements/GroupImplementInputDto";

export class GroupImplementController {
  // Declara una propiedad para el caso de uso
  private createGroupImplementUseCase: CreateGroupImplement;
  constructor() {
    // En el constructor, obtienes la instancia ya configurada
    // Aquí ocurre la "inyección" real, pero la lógica de creación está centralizada
    this.createGroupImplementUseCase = resolveCreateGroupImplementUseCase();
  }
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      // Extraemos los datos del cuerpo de la solicitud
      const { name, max_hours, time_limit } = req.body;
      // Validar y traducir el cuerpo de la petición a un DTO de entrada
      const inputDto: GroupImplementInputDto = {
        name: name,
        max_hours: max_hours,
        time_limit: time_limit
      };
      // Ejecutar el caso de uso con el DTO actualizado
      const newGroupImplement = await this.createGroupImplementUseCase.execute(inputDto);
      // Devuelve la respuesta al cliente
      return res.status(201).json(newGroupImplement);
    } catch (error) {
      console.error("Error creating group implement:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}