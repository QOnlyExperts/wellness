import { z } from 'zod';

import { hasNoXSSAndInjectionSql } from '../../utils/validator';
// Define los Enums de TypeScript como Enums de Zod.

const ImplementStatusSchema = z.enum(['available', 'borrowed', 'retired', 'maintenance']);
const ImplementConditionSchema = z.enum(['new']);

// Define el Schema principal para el DTO.
export const CreateImplementInputDtoSchema = z.object({
  // 'cod' es una cadena (string)
  prefix: z.string()
  .min(1, "El prefijo no puede estar vacío")
  .refine((val) => !hasNoXSSAndInjectionSql(val) && !/\d/.test(val), {
    message: "El prefijo no debe contener números ni caracteres especiales",
  }),

  // 'status' usa el enum de Zod
  status: ImplementStatusSchema,
  // 'condition' usa el enum de Zod
  condition: ImplementConditionSchema,
  // 'group_implement_id' es un número entero positivo
  group_implement_id: z.coerce
    .number("El group_implement_id debe ser un número")
    .int("El group_implement_id debe ser un número entero")
    .positive("El group_implement_id debe ser un número positivo mayor que 0"),

  // 'categories_id' es un número entero positivo
  categories_id: z.coerce
    .number("El categories_id debe ser un número")
    .int("El categories_id debe ser un número entero")
    .positive("El categories_id debe ser un número positivo mayor que 0"),

  user_id: z.coerce
    .number("El user_id debe ser un número")
    .int("El user_id debe ser un número entero")
    .positive("El user_id debe ser un número positivo mayor que 0"),

    
  amount: z.coerce
    .number("La cantidad debe ser un número")
    .int("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser un número positivo mayor que 0")
    .refine((val) => val <= 10, {
      message: "La cantidad no puede ser mayor a 10"
    }),

  imgs: z
    .array(z.any())
    .optional()
    .refine((files) => (files ? files.length <= 1 : true), {
      message: "Solo puedes subir 1 imagen",
    }),
});

// 3. (Opcional pero recomendado) Infiere el tipo de TypeScript a partir del Schema.
// Esto garantiza que el tipo de TS esté siempre sincronizado con las reglas de Zod.
export type CreateImplementInputDto = z.infer<typeof CreateImplementInputDtoSchema>;