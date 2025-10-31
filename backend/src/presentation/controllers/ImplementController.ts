// -- src/infrastructure/controllers/ImplementController.ts --

import { NextFunction, Request, Response } from "express"; // O el framework que uses
import { CreateImplement } from "../../application/use-cases/implements/CreateImplement";
// Importa la función que resuelve el caso de uso desde el Composition Root
import { resolveCreateImplementUseCase, resolveGetImplementsUseCase, resolveGetImplementByIdGroup } from "../../composition/compositionRoot";
import { ImplementInputDto } from "../../application/dtos/implements/ImplementInputDto";
import { GetImplements } from "../../application/use-cases/implements/GetImplements";
import { idSchema } from "../../application/schemas/IdSchema";
import z, { success } from "zod";
import { GetImplementByIdGroup } from "../../application/use-cases/implements/GetImplementByIdGroup";
import { UploadedFile } from "express-fileupload";
import { ImgInputDto } from "../../application/dtos/img-file/ImgInputDto";

export class ImplementController {
  // Declara una propiedad para el caso de uso
  private createImplementUseCase: CreateImplement;
  private getImplementsUseCase: GetImplements;
  private getImplementByIdGroup: GetImplementByIdGroup;

  constructor() {
    // En el constructor, obtienes la instancia ya configurada
    // Aquí ocurre la "inyección" real, pero la lógica de creación está centralizada
    this.createImplementUseCase = resolveCreateImplementUseCase();
    this.getImplementsUseCase = resolveGetImplementsUseCase();
    this.getImplementByIdGroup = resolveGetImplementByIdGroup();
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // Extraemos los datos del cuerpo de la solicitud
      const { prefix, status, condition, group_implement_id, categories_id, user_id, amount } = req.body;
      const folder = "uploads/implement";
      const files = req.files?.imgs as UploadedFile | UploadedFile[];

      // Convertir a array siempre
      const filesArray = Array.isArray(files) ? files:[files];
      
      // Pasamos los datos del array al dto respectivo
      const inputImg: ImgInputDto[] = [{
        file_path: `${folder}`,
        mime_type: filesArray[0].mimetype,
        size_bytes: filesArray[0].size,
        uploaded_by: user_id,
        description: filesArray[0].name,
      }]
      // Validar y traducir el cuerpo de la petición a un DTO de entrada
      const inputDto: ImplementInputDto = {
        prefix: prefix,
        status: status,
        condition: condition,
        group_implement_id: group_implement_id,
        categories_id: categories_id,
        user_id: user_id,
        amount: amount,
        imgs: inputImg
      };
      // Ejecutar el caso de uso con el DTO actualizado
      const newImplement = await this.createImplementUseCase.execute(inputDto, filesArray, folder);

      // Devuelve la respuesta al cliente
      return res.status(201).json({
        success: true,
        message: "Implemento creado correctamente",
        data: newImplement
      });
    } catch (error) {
      next(error);
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // Ejecutar el caso de uso sin necesidad de DTO de entrada
      const implementsList = await this.getImplementsUseCase.execute();
      // Devuelve la respuesta al cliente
      return res.status(200).json({
        success: true,
        message: "Implementos obtenidos correctamente",
        data: implementsList
      });
    } catch (error) {
      next(error);
    }
  }

  public async getImplementsByIdGroup(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try{
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
      const implement = await this.getImplementByIdGroup.execute(id);
      
      return res.status(200).json({
        success: true,
        message: "Implementos obtenido exitosamente",
        data: implement
      });

    }catch (error){
      next(error);
    }
  }
  
}
