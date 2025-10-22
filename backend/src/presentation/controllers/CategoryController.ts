import { NextFunction, Request, Response } from "express";
import {
  resolveCreateCategoryUseCase,
  resolveGetCategoriesUseCase,
  resolveGetCategoryByIdUseCase,
  resolveUpdateCategoryUseCase,
} from "../../composition/compositionRoot";

import { idSchema } from "../../application/schemas/IdSchema";
import { CreateCategorySchema, UpdateCategorySchema } from "../../application/schemas/CategorySchema";

export class CategoryController {
  // Obtenemos todos los casos de uso necesarios
  private createCategoryUseCase = resolveCreateCategoryUseCase();
  private getCategoriesUseCase = resolveGetCategoriesUseCase();
  private getCategoryByIdUseCase = resolveGetCategoryByIdUseCase();
  private updateCategoryUseCase = resolveUpdateCategoryUseCase();

  public async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const validatedData = CreateCategorySchema.parse(req.body);
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
      const { id } = idSchema.parse({ id: req.params.id });
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
      const { id } = idSchema.parse({ id: req.params.id });
      const dataToUpdate = UpdateCategorySchema.parse(req.body);

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