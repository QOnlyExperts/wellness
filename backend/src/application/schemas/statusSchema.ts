import { z } from 'zod';

// Define los Enums de TypeScript como Enums de Zod.

const ImplementStatusSchema = z.enum(['available', 'borrowed', 'retired', 'maintenance']);

// Define el Schema principal para el DTO.
export const statusSchema = z.object({
  // 'status' usa el enum de Zod
  status: ImplementStatusSchema,
});
// 