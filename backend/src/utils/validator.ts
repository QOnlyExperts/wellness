/**
 * Verifica si una cadena tiene el formato básico de un email.
 * @param email La cadena a validar.
 * @returns true si el email es válido.
 */
export const isValidEmail = (email: string): boolean => {
  // Nota: Zod's .email() es generalmente superior a una regex simple.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Verifica si una cadena es un número de teléfono de 10 dígitos.
 * @param phone La cadena a validar.
 * @returns true si el teléfono es válido.
 */
export const isValidPhone = (phone: string): boolean => {
  return /^\d{10}$/.test(phone);
};

/**
 * Detecta patrones de inyección comunes (XSS y SQLi).
 * NOTA: Esta función es una validación negativa (devuelve TRUE si es peligroso).
 * @param input La cadena a verificar.
 * @returns true si se detecta contenido peligroso.
 */
export const hasNoXSSAndInjectionSql = (input: string): boolean => {
  // Expresión regex para caracteres peligrosos y palabras clave SQL/XSS
  const dangerousRegex = /[<>"'&;(){}\[\]\\]|(--|\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|SCRIPT|ALERT)\b)/gi;
  return dangerousRegex.test(input);
};

/**
 * Verifica si una cadena contiene solo letras y espacios (incluyendo acentos y 'ñ').
 * @param input La cadena a validar.
 * @returns true si la cadena contiene solo letras.
 */
export const onlyLettersRegex = (input: string): boolean => {
  // La regex que devuelve true si la cadena es válida (solo letras y espacios)
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/.test(input);
};

// Ya no necesitas module.exports
// export { isValidEmail, isValidPhone, hasNoXSSAndInjectionSql, onlyLettersRegex };