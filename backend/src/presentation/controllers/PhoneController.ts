import { NextFunction, Request, Response } from "express";
import { z } from "zod"; // Para el manejo de errores

// Importamos todos los resolvers para Phones (darán error por ahora)
import {
  resolveCreatePhoneUseCase,
  resolveGetPhonesUseCase,
  resolveGetPhoneByIdUseCase,
  resolveUpdatePhoneUseCase,
  resolveGetPhonesByInfoPersonIdUseCase
} from "../../composition/compositionRoot";

// Importamos los DTOs y Schemas necesarios
import { CreatePhoneInputDto } from "../../application/dtos/phones/CreatePhoneInputDto";
import { idSchema } from "../../application/schemas/IdSchema";
import { CreatePhoneInputDtoSchema } from "../../application/schemas/PhoneSchema";

// Casos de Uso (para tipado en el constructor)
import { CreatePhone } from "../../application/use-cases/phones/CreatePhone";
import { GetPhones } from "../../application/use-cases/phones/GetPhones";
import { GetPhoneById } from "../../application/use-cases/phones/GetPhoneById";
import { UpdatePhone } from "../../application/use-cases/phones/UpdatePhone";
import { GetPhonesByInfoPersonId } from "../../application/use-cases/phones/GetPhonesByInfoPersonId";
import { UpdatePhoneInputDto } from "../../application/dtos/phones/UpdatePhoneInputDto";

export class PhoneController {
  // Declaramos las propiedades para los casos de uso
  private createPhoneUseCase: CreatePhone;
  private getPhonesUseCase: GetPhones;
  private getPhoneByIdUseCase: GetPhoneById;
  private updatePhoneUseCase: UpdatePhone;
  private getPhonesByInfoPersonIdUseCase: GetPhonesByInfoPersonId;

  constructor() {
    // Instanciamos los casos de uso llamando a los resolvers
    this.createPhoneUseCase = resolveCreatePhoneUseCase();
    this.getPhonesUseCase = resolveGetPhonesUseCase();
    this.getPhoneByIdUseCase = resolveGetPhoneByIdUseCase();
    this.updatePhoneUseCase = resolveUpdatePhoneUseCase();
    this.getPhonesByInfoPersonIdUseCase = resolveGetPhonesByInfoPersonIdUseCase();
  }

  // --- Método Create ---
  public async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const inputDto = req.body as CreatePhoneInputDto;
      const newPhone = await this.createPhoneUseCase.execute(inputDto);
      return res.status(201).json({
        success: true,
        message: "Teléfono creado exitosamente.",
        data: newPhone
      });
    } catch (error) {
      next(error);
    }
  }

  // --- Método GetAll ---
  public async getAll(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const phones = await this.getPhonesUseCase.execute();
      return res.status(200).json({
        success: true,
        message: "Lista de teléfonos obtenida exitosamente.",
        data: phones
      });
    } catch (error) {
      next(error);
    }
  }

  // --- Método GetById ---
  public async getById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // Validamos el ID con safeParse
      const result = idSchema.safeParse({ id: req.params.id });
      
      if (!result.success) {
        const formattedError = z.treeifyError(result.error);
        return res.status(400).json({
          success: false,
          message: "Parámetro de ID inválido.",
          errors: formattedError.properties?.id?.errors.map(e => ({ path: "id", message: e })),
        });
      }

      const id = result.data.id;
      const phone = await this.getPhoneByIdUseCase.execute(id);

      return res.status(200).json({
        success: true,
        message: "Teléfono obtenido exitosamente.",
        data: phone
      });
    } catch (error) {
      next(error);
    }
  }

  // --- Método GetByInfoPersonId (NUEVO) ---
  public async getByInfoPersonId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // Reutilizamos idSchema para validar el 'infoPersonId' de la ruta
      const result = idSchema.safeParse({ id: req.params.infoPersonId });
      
      if (!result.success) {
        const formattedError = z.treeifyError(result.error);
        return res.status(400).json({
          success: false,
          message: "Parámetro de ID de persona inválido.",
          errors: formattedError.properties?.id?.errors.map(e => ({ path: "id", message: e })),
        });
      }

      const infoPersonId = result.data.id;
      const phones = await this.getPhonesByInfoPersonIdUseCase.execute(infoPersonId);

      return res.status(200).json({
        success: true,
        message: `Teléfonos de la persona ${infoPersonId} obtenidos exitosamente.`,
        data: phones
      });
    } catch (error) {
      next(error);
    }
  }

  // --- Método Update ---
  public async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // 1. Validamos el ID del teléfono (en params)
      const result = idSchema.safeParse({ id: req.params.id });
      
      if (!result.success) {
        const formattedError = z.treeifyError(result.error);
        return res.status(400).json({
          success: false,
          message: "Parámetro de ID inválido.",
          errors: formattedError.properties?.id?.errors.map(e => ({ path: "id", message: e })),
        });
      }

      const id = result.data.id;
      
      // 2. Validamos el body (con .partial() para que los campos sean opcionales)
      // Usamos el DTO de Create, pero la lógica de 'update' se maneja en la ruta
      const inputDto = req.body as UpdatePhoneInputDto;

      const updatedPhone = await this.updatePhoneUseCase.execute(id, inputDto);

      return res.status(200).json({
        success: true,
        message: "Teléfono actualizado exitosamente.",
        data: updatedPhone
      });
    } catch (error) {
      next(error);
    }
  }
}