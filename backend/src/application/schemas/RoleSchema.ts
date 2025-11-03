// src/application/schemas/RoleSchema.ts
import { z } from 'zod';
// Importamos la función de validación personalizada de tu proyecto
import { hasNoXSSAndInjectionSql } from '../../utils/validator';

/**
 * Define el schema de validación para los datos de entrada de un Rol.
 * Sigue los patrones de validación del resto del proyecto.
 */
export const RoleSchema = z.object({
  /**
   * Nombre del rol.
   * Aplicamos .refine para la validación de seguridad (XSS/SQL).
   */
  name: z.string()
    .trim()
    .min(1, "El nombre del rol no puede estar vacío.")
    .max(45, "El nombre no debe exceder los 45 caracteres.")
    .refine((val) => !hasNoXSSAndInjectionSql(val), {
      message: "Debe indicar un nombre válido (sin caracteres especiales).",
    }),
  
  /**
   * Estado del rol (activo o inactivo).
   * Aplicamos z.coerce.boolean() para convertir entradas como "true" o "1"
   * en un booleano, tal como lo hace z.coerce.number() en el ejemplo.
   */
 status: z.coerce.boolean(
    "El estado debe ser un valor booleano (true o false)."
  ),
});