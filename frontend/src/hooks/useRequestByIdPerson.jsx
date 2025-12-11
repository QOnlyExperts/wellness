import { useEffect, useState } from "react";
// Importar servicios simulados para solicitudes (Debes crear RequestService)
import RequestService from "../services/RequestService";
import { useLoader } from "../context/LoaderContext";

/**
 * Hook personalizado para obtener y gestionar la lista de solicitudes de implementos.
 * @returns {object} Un objeto con la lista de solicitudes, estadísticas, estado de carga, error y función de refresco.
 */
export function useRequestByIdPerson({infoPersonId}) {
  // Asumo que useLoader() está disponible en tu contexto
  const { showLoader, hideLoader } = useLoader();

  // Lista principal de solicitudes
  const [requestList, setRequestList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hours, setHours] = useState(null);

  /**
   * Función asíncrona para obtener las solicitudes de la API y calcular estadísticas.
   */
  async function fetchRequests() {
    if (!infoPersonId || isNaN(Number(infoPersonId))) return;
    showLoader();
    setLoading(true);
    setError(null);

    try {
      const response = await RequestService.getRequestsByIdPerson(infoPersonId);

      if (!response.success) {
        window.showAlert(
          response?.error?.message || "Error al obtener las solicitudes",
          "Error"
        );
        setError(
          response?.error?.message || "Error al obtener las solicitudes"
        );
        setRequestList([]);
        return;
      }


      const countHours = response.data.reduce((acc, value) => {
        return acc = acc + parseInt( value.duration_hours);
      }, 0);

      setRequestList(response.data);
      setHours(countHours);

      setLoading(false);
      hideLoader();
    } catch (e) {
      console.error("Error en useRequestByIdPersons:", e);
      setError(
        e.message || "Ocurrió un error inesperado al cargar las solicitudes."
      );
    } finally {
      // Asegura que el estado de carga y el loader se oculten en cualquier caso
      hideLoader();
      setLoading(false);
    }
  }

  // Carga inicial de datos
  useEffect(() => {
    fetchRequests();
  }, []);

  // Retorna los datos y funciones para ser consumidos
  return {
    requestList,
    hours,
    loading,
    error,
    refresh: fetchRequests,
  };
}
