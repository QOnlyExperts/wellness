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
  max_hours: z
    .string()
    .regex(/^\d+$/, "El numero de horas máximas debe ser numérico")
    .transform(Number)
    .refine((val) => val > 0, {
      message: "El numero de horas máximas debe ser un número positivo mayor que 0",
    })
    .refine((val) => val <= 3, {
      message: "El numero de horas máximas no debe ser mayor a 3 horas",
    }),
  // 'time_limit' es un número entero positivo
  time_limit: z
    .string()
    .regex(/^\d+$/, "El tiempo límite debe ser numérico")
    .transform(Number)
    .refine((val) => val > 0, {
      message: "El tiempo límite debe ser un número positivo mayor que 0",
    })
    .refine((val) => val <= 12, {
      message: "El tiempo límite no debe ser mayor a 12 horas",
    }),
});

// 3. (Opcional pero recomendado) Infiere el tipo de TypeScript a partir del Schema.
// Esto garantiza que el tipo de TS esté siempre sincronizado con las reglas de Zod.
export type CreateGroupImplementInputDto = z.infer<typeof CreateGroupImplementInputDtoSchema>;