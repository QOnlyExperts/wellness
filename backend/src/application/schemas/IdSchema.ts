import { z } from "zod";

export const idSchema = z.object({
  id: z.coerce
    .number("El id debe ser un número")
    .int("El id debe ser un número entero")
    .positive("El id debe ser un número positivo mayor que 0"),
});


