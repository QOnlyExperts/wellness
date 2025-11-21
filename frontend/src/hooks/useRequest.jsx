import { useEffect, useState } from "react";
// Importar servicios simulados para solicitudes (Debes crear RequestService)
import RequestService from "../services/RequestService"; 
import { useLoader } from "../context/LoaderContext";

/**
 * Hook personalizado para obtener y gestionar la lista de solicitudes de implementos.
 * @returns {object} Un objeto con la lista de solicitudes, estadísticas, estado de carga, error y función de refresco.
 */
export function useRequest() {
    // Asumo que useLoader() está disponible en tu contexto
    const { showLoader, hideLoader } = useLoader(); 
    
    // Lista principal de solicitudes
    const [requestList, setRequestList] = useState([]); 
    
    // Estadísticas clave de las solicitudes
    const [stats, setStats] = useState({ 
        totalRequests: 0,
        pendingRequests: 0, // 'requested'
        inProgressRequests: 0, // Ej. 'on_hold' o 'borrowed' (si se cuenta como en proceso)
        completedRequests: 0, // 'completed'
        lateRequests: 0, // Solicitudes con limited_at superado
    });
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Función asíncrona para obtener las solicitudes de la API y calcular estadísticas.
     */
    async function fetchRequests() {
        showLoader();
        setLoading(true);
        setError(null);

        try {
            // 1. Llamada a la API (Reemplazar con RequestService.getRequests())
            // Nota: Se debe implementar RequestService.js
            const response = await RequestService.getRequests();

            if (!response.success) {
                // Asumiendo que window.showAlert existe para notificaciones
                window.showAlert(response.error?.message || "Error desconocido", "error");
                setRequestList([]);
                // No ocultar loader si el error se maneja con el finally, pero lo hacemos explícito por claridad
                hideLoader(); 
                setLoading(false);
                return;
            }

            const requests = response.data;
            
            // 2. Cálculo de Estadísticas Relevantes
            const now = new Date();
            const totalRequests = requests.length;

            const pendingRequests = requests.filter(req => req.status === 'requested').length;
            const completedRequests = requests.filter(req => req.status === 'finished').length;
            
            // Suponemos que 'on_hold' o cualquier otro estado intermedio (diferente a requested/finished)
            // se considera "en curso" o "prestado". En este ejemplo usaremos los que no son 'requested' o 'finished'.
            const inProgressRequests = requests.filter(req => 
                req.status !== 'requested' && req.status !== 'finished'
            ).length;
            
            // Cálculo de solicitudes tardías (limited_at ya pasó y el status no es 'finished')
            const lateRequests = requests.filter(req => {
                const limitedAtDate = req.limited_at ? new Date(req.limited_at) : null;
                // Es tardía si la hora límite ya pasó Y la solicitud no ha sido completada
                return limitedAtDate && limitedAtDate < now && req.status !== 'finished';
            }).length;

            // 3. Actualización del Estado
            setRequestList(requests);
            setStats({
                totalRequests,
                pendingRequests,
                inProgressRequests,
                completedRequests,
                lateRequests,
            });

            setLoading(false);
            hideLoader();

        } catch (e) {
            console.error("Error en useRequests:", e);
            setError(e.message || "Ocurrió un error inesperado al cargar las solicitudes.");
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
        stats, 
        loading, 
        error, 
        refresh: fetchRequests 
    };
}