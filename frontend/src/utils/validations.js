export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone) => {
  return /^\d{10}$/.test(phone);
};

export const hasNoXSSAndInjectionSql = (input) => {
  const dangerousRegex = /[<>\/"'&;(){}\[\]\\]|(--|\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|SCRIPT|ALERT)\b)/gi;
  return dangerousRegex.test(input);
};

export const onlyLettersRegex = (input) => {
  // (?!.*\d): No permite números en ningún lugar de la cadena.
  // [A-Za-zÁÉÍÓÚáéíóúÑñ]+$: Solo permite letras sin espacios.
  const onlyLettersRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/.test(input);
  return onlyLettersRegex;
}
