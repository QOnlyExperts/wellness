import { z } from 'zod';

// Valida el cuerpo (body) para crear una categoría. NO LLEVA ID.
export const CreateCategorySchema = z.object({
  name: z.string().trim().min(1, "El nombre de la categoría no puede estar vacío."),
  description: z.string().trim().optional(), 
});

// Valida el cuerpo (body) para actualizar.
export const UpdateCategorySchema = z.object({
  name: z.string().trim().min(1, "El nombre de la categoría no puede estar vacío.").optional(),
  description: z.string().trim().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "Debe proporcionar al menos un campo para actualizar.",
});