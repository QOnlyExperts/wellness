import { z } from 'zod';
import { hasNoXSSAndInjectionSql, onlyLettersRegex, isValidEmail} from '../../utils/validator';

// Reglas base para contraseña
const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener entre 8 y 16 caracteres válidos")
  .max(16, "La contraseña debe tener entre 8 y 16 caracteres válidos")
  .refine((val) => !hasNoXSSAndInjectionSql(val) && !/\d/.test(val), {
    message: "La contraseña contiene caracteres no permitidos",
  });

// Schema para creación/actualización de usuario
export const RegisterUserInputDtoSchema = z.object({
  email: z
    .string()
    .min(1, "El email tiene que ser válido. ejemplo@ejemplo.com")
    .refine((val) => isValidEmail(val.trim()), {
      message: "El email tiene que ser válido. ejemplo@ejemplo.com",
    }),
  password: passwordSchema,
  confirmPassword: passwordSchema,
  name1: z
    .string()
    .min(1, "El primer nombre debe contener solo letras y no debe estar vacío")
    .refine((val) => !hasNoXSSAndInjectionSql(val) && onlyLettersRegex(val), {
      message: "El primer nombre debe contener solo letras",
    }),
  name2: z
    .string()
    .optional()
    .refine((val) => !val || (!hasNoXSSAndInjectionSql(val) && onlyLettersRegex(val)), {
      message: "El segundo nombre debe contener solo letras",
    }),
  last_name1: z
    .string()
    .min(1, "El primer apellido debe contener solo letras y no debe estar vacío")
    .refine((val) => !hasNoXSSAndInjectionSql(val) && onlyLettersRegex(val), {
      message: "El primer apellido debe contener solo letras",
    }),
  last_name2: z
    .string()
    .min(1, "El segundo apellido debe contener solo letras y no debe estar vacío")
    .refine((val) => !hasNoXSSAndInjectionSql(val) && onlyLettersRegex(val), {
      message: "El segundo apellido debe contener solo letras",
    }),
  number_phone: z
    .string()
    .regex(/^\d{10} $/, "El número de teléfono debe contener exactamente 10 dígitos y solo números"),
  identification: z.coerce
    .string("La identificación debe ser un número")
    .min(1, "La identificación debe ser un número entero")
    .refine((val) => val.length >= 8 && val.length <= 10, {
      message: "La identificación no puede ser menor a 8 ni mayor a 10"
    }),
  program_id: z.coerce
    .number("El program_id debe ser un número")
    .int("El program_id debe ser un número entero")
    .positive("El program_id debe ser un número positivo mayor que 0"),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"], // indica que el error se asocia al campo confirmPassword
  });

// Schema para reset de contraseña
// const passwordResetSchema = z
//   .object({
//     passwordOld: passwordSchema,
//     password: passwordSchema,
//     confirmPassword: passwordSchema,
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Las contraseñas no coinciden",
//     path: ["confirmPassword"],
//   });


export type RegisterUserInputDto = z.infer<typeof RegisterUserInputDtoSchema>;