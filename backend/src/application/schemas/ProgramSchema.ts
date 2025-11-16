import { z } from 'zod';
// Importamos la función de validación de seguridad de tu proyecto
import { hasNoXSSAndInjectionSql } from '../../utils/validator';

// Define el Schema principal para el DTO de entrada
export const CreateProgramInputDtoSchema = z.object({
  
  // Campo 'name' con validación de seguridad
  name: z.string()
    .min(1, "El nombre no puede estar vacío")
    .max(45, "El nombre no debe exceder los 45 caracteres") // Basado en init.sql
    .refine((val) => !hasNoXSSAndInjectionSql(val), {
      message: "Debe indicar un nombre válido",
    }),

  // Campo 'cod' con validación de seguridad
  cod: z.string()
    .min(1, "El código no puede estar vacío")
    .max(45, "El código no debe exceder los 45 caracteres") // Basado en init.sql
    .refine((val) => !hasNoXSSAndInjectionSql(val), {
      message: "Debe indicar un código válido",
    }),

  // Campo 'facult' con validación de seguridad
  facult: z.string()
    .min(1, "La facultad no puede estar vacía")
    .max(45, "La facultad no debe exceder los 45 caracteres") // Basado en init.sql
    .refine((val) => !hasNoXSSAndInjectionSql(val), {
      message: "Debe indicar una facultad válida",
    }),

  // Campo 'status' con coerción a booleano
  status: z.coerce.boolean(
    "El estado debe ser un valor booleano (true o false)."
  ),

  // Campo 'date' con coerción a fecha
  date: z.coerce.date({
    error: "Debe proporcionar una fecha válida."
  }),
});

// Inferimos el tipo de TypeScript, tal como en el ejemplo
export type CreateProgramInputDto = z.infer<typeof CreateProgramInputDtoSchema>;

export const FindProgramSchema = z.object({
  name: z.string().optional(),
  cod: z.string().optional(),
  facult: z.string().optional()
})
.strict() // No permite parámetros extra
.refine(data => data.name || data.cod || data.facult, { // Valida que al menos uno exista
  message: "Se debe proporcionar al menos un criterio de búsqueda (nombre, código o facultad)."
});