import { useState, useEffect, use } from "react";
import { useRequest } from "../../hooks/useRequest";

import RequestListContainer from "../../containers/request/RequestListContainer";
import RequestStatsContainer from "../../containers/request/RequestStatsContainer";
import RequestHeadContainer from "../../containers/request/RequestHeadContainer";

import {
  initialSocket,
  listenToAdminRequest,
  sendResponseToClient,
  refreshAdminRoom,
  disconnectSocket,
  requestFailed
} from "../../services/socket/AdminSocket";


// Importación simulada (asegúrate de que este servicio existe en tu proyecto)
import RequestService from "../../services/RequestService"; 

import { ASSET_STATUS_REQUEST_FILTERS, STATUS_ACCEPTED, STATUS_FINISHED } from "../../constants/requestsStatuses";
import RequestAdminModalContainer from "../../containers/request/RequestAdminModalContainer";
import UserService from "../../services/UserService";
import { useUserId } from "../../hooks/useUserId";

const RequestPage = () => {
  // Obtiene stats, requestList (solicitudes completas), loading, error
  const { stats, requestList, loading, error, refresh } = useRequest();
  const [userId, setUserId] = useState(() => {
    // 1. Obtener el ítem (puede ser null)
    const dataJson = sessionStorage.getItem("data");

    // 2. Si no hay datos, retorna null o un valor por defecto (ej. 0 o -1)
    if (!dataJson) {
      return null;
    }

    // 3. Parsear el JSON. Usamos try/catch si el JSON puede estar malformado.
    try {
      const data = JSON.parse(dataJson);
      // 4. Devolver la propiedad, si existe
      return data.user.id || null;
    } catch (e) {
      // En caso de que el JSON no sea válido
      console.error("Error parsing data from session storage:", e);
      return null;
    }
  });
  
  // Estado para el formulario del modal
  const [currentForm, setCurrentForm] = useState({
    limited_at: "",
  });
  
  // Asumo que userId, isLoading, y otros hooks existen aquí
  
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  // ESTADO CLAVE: Contiene solo las solicitudes que requieren atención (estado 'requested')
  const [requestPending, setRequestPending] = useState([]);
  
  const [requestFinished, setRequestFinished]= useState(null);

  const getUserIdByInfoPerson = async (infoPersonId) => {
    try {
      const response = await UserService.getUserIdByIdInfoPerson(infoPersonId);

      if (!response.success) {
        console.log(response.error.message);
        return;
      }

      return response.data.user_id;
    } catch (e) {
      console.log(e);
    }
  };

  // --- 1. Inicialización de requestPending con solicitudes REQUESTED (Autocarga Inicial) ---
  useEffect(() => {

    // 1. Ejecutar solo si la lista cargó, no está vacía, y aún no hemos inicializado requestPending
      if (requestList && requestList.length > 0) {
        const initialPendingPromises = requestList
          .filter(
            (req) => req.status === "requested" || req.status === "REQUESTED"
          )
          .map(async (req) => {
            const mappedUserId = await getUserIdByInfoPerson(req.info_person_id);

            return {
              implement_id: req.implement_id,
              user_id: mappedUserId,
              request_id: req.id,
              // clientId: req.clientId || null,
            };
          });

        // Esperamos a que todas las consultas de ID de usuario terminen
        Promise.all(initialPendingPromises).then((results) => {
          const validResults = results.filter((r) => r.user_id);

          // 2. Establecer la cola de pendientes
          setRequestPending(validResults);

          // 3. Abrir el modal si encontramos solicitudes pendientes
          if (validResults.length > 0) {
            setIsOpenModal(true);
          }
        });

        // De lo contrario si no hay solicitudes pendientes 
        // Verificamos si hay una solicitud activa. (Verificar si se debe ver primero)
      }

  }, [requestList, requestFinished, loading]);

useEffect(() => {
  if (!userId) return;

  const sock = initialSocket(userId);

  const handleAdminRequest = (data) => {
    const { implement_id, user_id, request_id, status } = data;

    if (status === STATUS_FINISHED) {
      setRequestFinished({ implement_id, user_id, request_id, status });
    } else {
      setRequestPending((prev) => [
        ...prev,
        { implement_id, user_id, request_id },
      ]);
    }
    setIsOpenModal(true);
  };

  const handleRefreshRoom = (data) => {
    if (data.success) {
      refresh(); // refresca la UI
      console.log("Refrescado");
    }
  };

  const handleRequestFailed = (data) => {
    if (!data.success) {
      setIsLoadingModal(false);
      setOnRequest(true);
      setMessage(data.message);

      setTimeout(() => {
        setMessage(null);
        setOnRequest(false);
      }, 5000);
    }
  };

  // Registrar listeners
  listenToAdminRequest(handleAdminRequest);
  refreshAdminRoom(handleRefreshRoom);
  requestFailed(handleRequestFailed);

  // Cleanup: eliminar listeners al desmontar
  return () => {
    sock.off("adminRequestFromClient", handleAdminRequest);
    sock.off("refreshAdminRoom", handleRefreshRoom);
    sock.off("requestFailed", handleRequestFailed);
    // No desconectamos socket si quieres mantener la sesión activa
  };
}, [userId]);


  /**
   * Procesa la solicitud pendiente actual (el primer elemento de la cola).
   * @param {string} status - El estado de la respuesta ('accepted' o 'refused').
   * @param {string} [limitedAt=null] - El tiempo límite (necesario solo si status es 'accepted').
   */
  const handleResponseToClient = async (status, limitedAt = null) => {
    // La solicitud que se va a procesar es la PRIMERA en el array requestPending
    const currentRequest = requestPending[0];

    if (!currentRequest && !requestFinished) {
      setIsOpenModal(false);
      return;
    }

    // --- 1. VALIDACIÓN INICIAL DE INTEGRIDAD Y ESTADO ---
    if (
      !status ||
      !ASSET_STATUS_REQUEST_FILTERS.find((stat) => stat.value === status)
    ) {
      console.error(`Status inválido recibido: ${status}`);
      return;
    }

    // Si se ACEPTA, se exige el tiempo límite
    if (status === STATUS_ACCEPTED && !limitedAt) {
      window.showAlert(
        "Debe especificar el tiempo límite para aceptar la solicitud.",
        "warning"
      );
      return;
    }

    // Validación de datos de la solicitud
    const { implement_id, request_id, user_id } = requestFinished
      ? requestFinished
      : currentRequest;

    if (request_id === 0 || user_id === 0 || implement_id === 0) {
      window.showAlert(
        "Error interno: Datos de solicitud incompletos.",
        "error"
      );
      return;
    }

    // Usamos un try-catch para manejar errores de la API
    try {
      const payload = {
        request_id: request_id,
        status: status,
        implement_id: implement_id,
        user_id: user_id,
      };

      console.log(user_id)

      // Si el estado requiere límite, lo agregamos
      if (status === STATUS_ACCEPTED && limitedAt) {
        payload.limited_at = limitedAt;
      }

      sendResponseToClient(payload);

      setRequestPending((prevRequests) => prevRequests.slice(1));
      setCurrentForm({ limited_at: "" }); // Resetear el formulario
      setIsOpenModal(false);

      if (requestFinished) {
        setRequestFinished(null);
      }

      refresh();
    } catch (error) {
      window.showAlert(
        error.message || "Fallo al procesar la solicitud en el servidor.",
        "error"
      );
      console.error("Error al procesar solicitud:", error);
    }
  };

  // --- 4. Efecto para cerrar el modal si no hay pendientes ---
  useEffect(() => {
    if (requestPending.length === 0) {
      setIsOpenModal(false);
    } 
    // No necesitamos un else, ya que el useEffect de inicialización y el listener de socket 
    // se encargan de abrirlo cuando hay pendientes. 
    // Mantener la línea de abajo no es necesario, pero es inofensivo si quieres reforzar la apertura.
    else {
      setIsOpenModal(true);
    }
  }, [requestPending.length]);

  const handleModalFormChange = ({ name, value }) => {
    setCurrentForm((prev) => ({ ...prev, [name]: value }));
  };

  // --- Renderizado ---
  return (
    <div className="div-principal">
      {/* Muestra el modal SOLO si está abierto Y hay elementos pendientes */}
      {isOpenModal && (
        (() => {
          // Corrección agregada: obtener el ítem actual de forma segura
          const currentItem = requestFinished || requestPending[0];

          // Si no hay item, no renderizamos el modal para evitar errores
          if (!currentItem) return null;

          return (
            <RequestAdminModalContainer
              implementId={currentItem.implement_id}
              userId={currentItem.user_id}
              form={currentForm}
              finished={requestFinished}
              onFinish={() => handleResponseToClient("finished")}
              onFormChange={handleModalFormChange}
              onAccepted={(limitedAt) =>
                handleResponseToClient("accepted", limitedAt)
              }
              onRefused={() => handleResponseToClient("refused")}
              onClose={() => {
                setRequestPending((prev) => prev.slice(1));
                setCurrentForm({ limited_at: "" });
              }}
            />
          );
        })()
      )}

      <RequestHeadContainer />
      <RequestStatsContainer stats={stats} loading={loading} error={error} />
      <RequestListContainer
        requestList={requestList}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default RequestPage;