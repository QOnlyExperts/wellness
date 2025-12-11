import { z } from 'zod';
import { hasNoXSSAndInjectionSql, isPasswordComplex, isValidEmail } from '../../utils/validator';

// Reglas base para email (reutilizadas del schema de registro)
const emailSchema = z
  .string()
  .min(1, "El email tiene que ser válido. ejemplo@ejemplo.com")
  .refine((val) => isValidEmail(val.trim()), {
    message: "El email tiene que ser válido. ejemplo@ejemplo.com",
  });

// Reglas base para contraseña (simplificadas del schema de registro)
// NOTA: Para login, usualmente solo validas la longitud y la seguridad básica, 
// no la complejidad (como la presencia de números), ya que esa validación 
// se hace al momento del registro.
// Reglas base para contraseña (USANDO FUNCIONES)
const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener entre 8 y 16 caracteres.")
  .max(16, "La contraseña debe tener entre 8 y 16 caracteres.")
  
  // Mantenemos la ÚNICA validación de seguridad crucial: Anti-Inyección
  .refine((val) => !hasNoXSSAndInjectionSql(val), { 
    message: "La contraseña contiene caracteres no permitidos",
  });

// Schema para el Login
export const LoginInputDtoSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});


export type LoginInputDto = z.infer<typeof LoginInputDtoSchema>;