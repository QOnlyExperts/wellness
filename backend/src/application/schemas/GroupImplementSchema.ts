import { z } from 'zod';

import { hasNoXSSAndInjectionSql } from '../../utils/validator';
// Define los Enums de TypeScript como Enums de Zod.

export const CreateGroupImplementInputDtoSchema = z.object({
  // 'cod' es una cadena (string)
  name: z.string()
  .min(1, "El nombre no puede estar vacío")
  .refine((val) => !hasNoXSSAndInjectionSql(val) && !/\d/.test(val), {
    message: "Debe indicar un nombre válido",
  }),
  // 'max_hours' es un número entero positivo
  max_hours: z.number()
  .int("Debe ser un número entero")
  .positive("Debe ser un número positivo"),
  // 'time_limit' es un número entero positivo
  time_limit: z.number()
  .int("Debe ser un número entero")
  .positive("Debe ser un número positivo")
  .max(24, "No puede ser mayor a 24 horas"),
});

// 3. (Opcional pero recomendado) Infiere el tipo de TypeScript a partir del Schema.
// Esto garantiza que el tipo de TS esté siempre sincronizado con las reglas de Zod.
export type CreateGroupImplementInputDto = z.infer<typeof CreateGroupImplementInputDtoSchema>;