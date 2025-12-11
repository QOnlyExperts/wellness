import { useState } from "react";

export function useUserId() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  try {
    // 1. Obtener el ítem (puede ser null)
    const dataJson = sessionStorage.getItem("data");

    // 2. Si no hay datos, retorna null o un valor por defecto (ej. 0 o -1)
    if (!dataJson) {
      return null;
    }

    // 3. Parsear el JSON. Usamos try/catch si el JSON puede estar malformado.
    const data = JSON.parse(dataJson);
    // 4. Devolver la propiedad, si existe
    setUserId(data.user.id || null);
  } catch (e) {
    // En caso de que el JSON no sea válido
    setErrorMessage("Error parsing data from session storage:", e);
  }

  return { userId, errorMessage };
}
