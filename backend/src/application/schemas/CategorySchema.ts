import { z } from 'zod';

// Schema para la creación de una categoría
export const CreateCategorySchema = z.object({
  name: z.string()
    .trim()
    .min(1, "El nombre de la categoría no puede estar vacío."),
  
  description: z.string()
    .trim()
    .optional(), // La descripción es opcional
});

// Schema para la actualización de una categoría
export const UpdateCategorySchema = z.object({
  name: z.string()
    .trim()
    .min(1, "El nombre de la categoría no puede estar vacío.")
    .optional(),

  description: z.string()
    .trim()
    .optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "Debe proporcionar al menos un campo para actualizar.",
});