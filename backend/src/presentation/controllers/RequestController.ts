import { NextFunction, Request, Response } from "express";

import { CreateRequestUseCase } from "../../application/use-cases/request/CreateRequestUseCase";
import { GetRequestUseCase } from "../../application/use-cases/request/GetRequestUseCase";
import { GetRequestByIdUseCase } from "../../application/use-cases/request/GetRequestByIdUseCase";
import { GetRequestByIdInfoPersonUseCase } from "../../application/use-cases/request/GetRequestByIdInfoPersonUseCase";
import { GetRequestByStatusByIdInfoPersonUseCase } from "../../application/use-cases/request/GetRequestByStatusByIdInfoPersonUseCase";

import {
  resolveCreateRequestUseCase,
  resolveGetRequestUseCase,
  resolveGetRequestByIdUseCase,
  resolveGetRequestByIdInfoPersonUseCase,
  resolveGetRequestByStatusByIdInfoPersonUseCase,
  resolveUpdateRequestUseCase,
} from "../../composition/compositionRoot";

import { RequestInputDto } from "../../application/dtos/requests/RequestInputDto";

import { idSchema } from "../../application/schemas/IdSchema";
import { z } from "zod";
import { UpdateRequestUseCase } from "../../application/use-cases/request/UpdateRequestUseCase";

export class RequestController {
  private createRequestUseCase: CreateRequestUseCase;
  private getRequestUseCase: GetRequestUseCase;
  private getRequestByIdUseCase: GetRequestByIdUseCase;
  private getRequestByIdInfoPersonUseCase: GetRequestByIdInfoPersonUseCase;
  private getRequestByStatusByIdInfoPersonUseCase: GetRequestByStatusByIdInfoPersonUseCase;
  private requestUpdateUseCase: UpdateRequestUseCase;

  constructor() {
    this.createRequestUseCase = resolveCreateRequestUseCase();
    this.getRequestUseCase = resolveGetRequestUseCase();
    this.getRequestByIdUseCase = resolveGetRequestByIdUseCase();
    this.getRequestByIdInfoPersonUseCase =
      resolveGetRequestByIdInfoPersonUseCase();
    this.getRequestByStatusByIdInfoPersonUseCase =
      resolveGetRequestByStatusByIdInfoPersonUseCase();
    this.requestUpdateUseCase = resolveUpdateRequestUseCase();
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const body = req.body;
      const inputDto: RequestInputDto = body;
      const request = await this.createRequestUseCase.execute(inputDto);

      return res.status(201).json({
        success: true,
        message: "Solicitud creada correctamente",
        data: request,
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
      const request = await this.getRequestByIdUseCase.execute(id);

      res.status(200).json({
        success: true,
        message: "Solicitud obtenida correctamente",
        data: request,
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
      const requests = await this.getRequestUseCase.execute();
      return res.status(200).json({
        success: true,
        message: "Solicitudes obtenidas correctamente",
        data: requests,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getByIdInfoPerson(
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
      const request = await this.getRequestByIdInfoPersonUseCase.execute(id);

      res.status(200).json({
        success: true,
        message: "Solicitud obtenida correctamente",
        data: request,
      });
    } catch (error) {
      next(error);
    }
  }

    public async getStatusWhitIdInfoPerson(
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
      const request = await this.getRequestByStatusByIdInfoPersonUseCase.execute(id);

      res.status(200).json({
        success: true,
        message: "Solicitud obtenida correctamente",
        data: request,
      });
    } catch (error) {
      next(error);
    }
  }

  // public async update(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<Response | void> {
  //   try {
  //     const updates = req.body;

  //     const result = idSchema.safeParse({ id: req.params.id });

  //     if (!result.success) {
  //       const formattedError = z.treeifyError(result.error);

  //       // Error de validación
  //       return res.status(400).json({
  //         success: false,
  //         message: "Parámetro inválido",
  //         errors: formattedError.properties?.id?.errors.map((e) => ({
  //           path: "id",
  //           message: e,
  //         })),
  //       });
  //     }

  //     const id = result.data.id; // número seguro
  //     // Ejecutar el caso de uso sin necesidad de DTO de entrada
  //     const implementsList = await this.requestUpdateUseCase.execute(
  //       id,
  //       updates
  //     );
  //     // Devuelve la respuesta al cliente
  //     return res.status(200).json({
  //       success: true,
  //       message: "Implemento actualizado correctamente",
  //       data: implementsList,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}
