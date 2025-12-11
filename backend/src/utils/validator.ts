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
  const dangerousRegex = /[<>"'`=;(){}\[\]\\]|(--|\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|SCRIPT|ALERT|EXEC)\b)/gi;
  return dangerousRegex.test(input.trim());
};

/**
 * Verifica si la contraseña cumple con los requisitos de complejidad:
 * - Longitud entre 8 y 16.
 * - Al menos una mayúscula, un número y una letra.
 * - Sin espacios en blanco.
 */
export function isPasswordComplex(password: string): boolean {
  // Regex de complejidad:
  // ^: inicio
  // (?=.*[A-Z]): lookahead para al menos una mayúscula
  // (?=.*\d): lookahead para al menos un dígito
  // (?=.*[a-zA-Z]): lookahead para al menos una letra (cubierto por A-Z y a-z)
  // [^\s]{8,16}: 8 a 16 caracteres, sin espacios
  // $: fin
  const complexityRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[a-zA-Z])[^\s]{8,16}$/;
  
  // Devuelve true si la contraseña pasa la regex
  return complexityRegex.test(password);
}
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