import { z } from 'zod';

import { hasNoXSSAndInjectionSql } from '../../utils/validator';
// Define los Enums de TypeScript como Enums de Zod.

const ImplementStatusSchema = z.enum(['available', 'borrowed', 'retired', 'maintenance']);
const ImplementConditionSchema = z.enum(['new']);

// Define el Schema principal para el DTO.
export const CreateImplementInputDtoSchema = z.object({
  // 'cod' es una cadena (string)
  prefix: z.string()
  .min(1, "El código no puede estar vacío")
  .refine((val) => !hasNoXSSAndInjectionSql(val) && !/\d/.test(val), {
    message: "Debe indicar un barrio válido",
  }),
  // 'status' usa el enum de Zod
  status: ImplementStatusSchema,
  // 'condition' usa el enum de Zod
  condition: ImplementConditionSchema,
  // 'group_implement_id' es un número entero positivo
  group_implement_id: z.number()
  // .min(1, "El ID de grupo debe ser un número entero positivo")
  .int("Debe ser un número entero")
  .positive("Debe ser un número positivo"),

  // 'categories_id' es un número entero positivo
  categories_id: z.number()
  // .min(1, "El ID de categoría debe ser un número entero positivo")
  .int("Debe ser un número entero")
  .positive("Debe ser un número positivo"),
});

// 3. (Opcional pero recomendado) Infiere el tipo de TypeScript a partir del Schema.
// Esto garantiza que el tipo de TS esté siempre sincronizado con las reglas de Zod.
export type CreateImplementInputDto = z.infer<typeof CreateImplementInputDtoSchema>;