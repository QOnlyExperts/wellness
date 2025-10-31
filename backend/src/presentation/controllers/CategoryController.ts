import { NextFunction, Request, Response } from "express";
import { z } from "zod"; 
import {
  resolveCreateCategoryUseCase,
  resolveGetCategoriesUseCase,
  resolveGetCategoryByIdUseCase,
  resolveUpdateCategoryUseCase,
} from "../../composition/compositionRoot";

import { idSchema } from "../../application/schemas/IdSchema";
import { CategorySchema } from "../../application/schemas/CategorySchema";

export class CategoryController {
  // ... (propiedades y constructor se mantienen igual)
  private createCategoryUseCase = resolveCreateCategoryUseCase();
  private getCategoriesUseCase = resolveGetCategoriesUseCase();
  private getCategoryByIdUseCase = resolveGetCategoryByIdUseCase();
  private updateCategoryUseCase = resolveUpdateCategoryUseCase();

  public async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    // ... (este método ya estaba bien)
    try {
      const validatedData = CategorySchema.parse(req.body);
      const newCategory = await this.createCategoryUseCase.execute(validatedData);
      
      return res.status(201).json({
        success: true,
        message: "Categoría creada exitosamente.",
        data: newCategory,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    // ... (este método ya estaba bien)
    try {
      const categories = await this.getCategoriesUseCase.execute();
      
      return res.status(200).json({
        success: true,
        message: "Lista de categorías obtenida exitosamente.",
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const result = idSchema.safeParse({ id: req.params.id });

      if (!result.success) {
        // CORRECCIÓN AQUÍ: Usamos z.treeifyError
        const formattedError = z.treeifyError(result.error);
        return res.status(400).json({
          success: false,
          message: "Parámetro de ID inválido.",
          errors: formattedError.properties?.id?.errors, 
        });
      }
      
      const id = result.data.id;
      const category = await this.getCategoryByIdUseCase.execute(id);
      
      return res.status(200).json({
        success: true,
        message: "Categoría obtenida exitosamente.",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const result = idSchema.safeParse({ id: req.params.id });

      if (!result.success) {
        // CORRECCIÓN AQUÍ: Usamos z.treeifyError
        const formattedError = z.treeifyError(result.error);
        return res.status(400).json({
          success: false,
          message: "Parámetro de ID inválido.",
          errors: formattedError.properties?.id?.errors, 
        });
      }

      const id = result.data.id;
      const dataToUpdate = CategorySchema.partial().parse(req.body);

      const updatedCategory = await this.updateCategoryUseCase.execute(id, dataToUpdate);
      
      return res.status(200).json({
        success: true,
        message: "Categoría actualizada exitosamente.",
        data: updatedCategory,
      });
    } catch (error) {
      next(error);
    }
  }
}