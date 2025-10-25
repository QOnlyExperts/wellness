// src/application/schemas/RoleSchema.ts
import { z } from 'zod';

/**
 * Define el schema de validación para los datos de entrada de un Rol.
 * Se basa en la tabla `roles` de la base de datos.
 */
export const RoleSchema = z.object({
  /**
   * Nombre del rol.
   * Es un string, se limpian espacios, y debe tener entre 1 y 45 caracteres.
   */
  name: z.string()
    .trim()
    .min(1, "El nombre del rol no puede estar vacío.")
    .max(45, "El nombre no debe exceder los 45 caracteres."),
  
  /**
   * Estado del rol (activo o inactivo).
   * Debe ser un valor booleano (true o false).
   */
  status: z.boolean({
    message: "El estado debe ser un valor booleano (true o false)."
  }),
});