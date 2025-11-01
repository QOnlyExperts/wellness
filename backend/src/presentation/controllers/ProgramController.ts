import { NextFunction, Request, Response } from "express";
import { z } from "zod"; // Importamos z para el manejo de errores

// Importamos todos los resolvers para Programas
import {
  resolveCreateProgramUseCase,
  resolveGetProgramsUseCase,
  resolveGetProgramByIdUseCase,
  resolveUpdateProgramUseCase,
  resolveGetProgramBySearchUseCase
} from "../../composition/compositionRoot";

// Importamos los DTOs y Schemas necesarios
import { CreateProgramInputDto } from "../../application/dtos/programs/CreateProgramInputDto";
import { ProgramFindDto } from "../../application/dtos/programs/ProgramFindDto";
import { idSchema } from "../../application/schemas/IdSchema";
import { CreateProgramInputDtoSchema } from "../../application/schemas/ProgramSchema";

// Casos de Uso (para tipado en el constructor)
import { CreateProgram } from "../../application/use-cases/programs/CreateProgram";
import { GetPrograms } from "../../application/use-cases/programs/GetPrograms";
import { GetProgramById } from "../../application/use-cases/programs/GetProgramById";
import { UpdateProgram } from "../../application/use-cases/programs/UpdateProgram";
import { GetProgramBySearch } from "../../application/use-cases/programs/GetProgramBySearch";

export class ProgramController {
  // Declaramos las propiedades para los casos de uso
  private createProgramUseCase: CreateProgram;
  private getProgramsUseCase: GetPrograms;
  private getProgramByIdUseCase: GetProgramById;
  private updateProgramUseCase: UpdateProgram;
  private getProgramBySearchUseCase: GetProgramBySearch;

  constructor() {
    // Instanciamos los casos de uso llamando a los resolvers
    this.createProgramUseCase = resolveCreateProgramUseCase();
    this.getProgramsUseCase = resolveGetProgramsUseCase();
    this.getProgramByIdUseCase = resolveGetProgramByIdUseCase();
    this.updateProgramUseCase = resolveUpdateProgramUseCase();
    this.getProgramBySearchUseCase = resolveGetProgramBySearchUseCase();
  }

  // --- Método Create ---
  public async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // Obtenemos los datos del body
      const inputDto = req.body as CreateProgramInputDto;
      
      // Ejecutamos el caso de uso
      const newProgram = await this.createProgramUseCase.execute(inputDto);

      // Enviamos la respuesta estándar
      return res.status(201).json({
        success: true,
        message: "Programa creado exitosamente.",
        data: newProgram
      });
    } catch (error) {
      next(error); // Manejador de errores centralizado
    }
  }

  // --- Método GetAll ---
  public async getAll(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const programs = await this.getProgramsUseCase.execute();
      return res.status(200).json({
        success: true,
        message: "Lista de programas obtenida exitosamente.",
        data: programs
      });
    } catch (error) {
      next(error);
    }
  }

  // --- Método GetById ---
  public async getById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // Validamos el ID con safeParse, igual que en GroupImplementController
      const result = idSchema.safeParse({ id: req.params.id });
      
      if (!result.success) {
        const formattedError = z.treeifyError(result.error);
        return res.status(400).json({
          success: false,
          message: "Parámetro de ID inválido.",
          errors: formattedError.properties?.id?.errors.map(e => ({
            path: "id",
            message: e
          })),
        });
      }

      const id = result.data.id;
      const program = await this.getProgramByIdUseCase.execute(id);

      return res.status(200).json({
        success: true,
        message: "Programa obtenido exitosamente.",
        data: program
      });
    } catch (error) {
      next(error);
    }
  }

  // --- Método GetBySearch ---
  public async getBySearch(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // Obtenemos los criterios de búsqueda desde req.query
      const { name, cod, facult } = req.query;

      const inputDto: ProgramFindDto = {
        name: name as string | undefined,
        cod: cod as string | undefined,
        facult: facult as string | undefined
      };

      const programs = await this.getProgramBySearchUseCase.execute(inputDto);
      return res.status(200).json({
        success: true,
        message: "Programas obtenidos exitosamente.",
        data: programs
      });
    } catch (error) {
      next(error);
    }
  }

  // --- Método Update ---
  public async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // 1. Validamos el ID del parámetro
      const result = idSchema.safeParse({ id: req.params.id });
      
      if (!result.success) {
        const formattedError = z.treeifyError(result.error);
        return res.status(400).json({
          success: false,
          message: "Parámetro de ID inválido.",
          errors: formattedError.properties?.id?.errors.map(e => ({
            path: "id",
            message: e
          })),
        });
      }

      const id = result.data.id;
      
      // 2. Obtenemos los datos del body
      // Usamos el DTO de Create, pero la lógica de 'update' (usando .partial())
      // se manejará en el schema de la ruta.
      const inputDto = req.body as CreateProgramInputDto;

      const updatedProgram = await this.updateProgramUseCase.execute(id, inputDto);

      return res.status(200).json({
        success: true,
        message: "Programa actualizado exitosamente.",
        data: updatedProgram
      });
    } catch (error) {
      next(error);
    }
  }
}