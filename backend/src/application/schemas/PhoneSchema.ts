import { z } from 'zod';

export const CreatePhoneInputDtoSchema = z.object({
  

  number: z.coerce.bigint(
    "El número de teléfono debe ser un valor numérico válido."
  ),
  

  info_person_id: z.coerce.number(
      "El ID de la persona debe ser un número"
    )
    .int("El ID de la persona debe ser un número entero")
    .positive("El ID de la persona debe ser un número positivo mayor que 0"),
});


export type CreatePhoneInputDto = z.infer<typeof CreatePhoneInputDtoSchema>;