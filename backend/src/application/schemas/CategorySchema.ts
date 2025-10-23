import { z } from 'zod';

// Un único schema que se usará para crear y actualizar
export const CategorySchema = z.object({
  name: z.string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres."),
  
  description: z.string()
    .trim()
    .optional(),
});