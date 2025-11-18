import { z } from 'zod';

export const CreatePhoneInputDtoSchema = z.object({
  

  number: z.coerce.string()
    .length(10, "El número de teléfono debe tener 10 dígitos.")
    .regex(/^\d+$/, "El número de teléfono debe contener solo números.")
    .transform((val) => BigInt(val)),
  

  info_person_id: z.coerce.number(
      "El ID de la persona debe ser un número"
    )
    .int("El ID de la persona debe ser un número entero")
    .positive("El ID de la persona debe ser un número positivo mayor que 0"),
});


export type CreatePhoneInputDto = z.infer<typeof CreatePhoneInputDtoSchema>;