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
} from "../../services/socket/AdminSocket";

// Importación simulada (asegúrate de que este servicio existe en tu proyecto)
import RequestService from "../../services/RequestService"; 

import { ASSET_STATUS_REQUEST_FILTERS } from "../../constants/requestsStatuses";
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
    }
  }, [requestList]);

  // --- 2. Lógica del Socket y Escucha (Autocarga en Tiempo Real) ---
  useEffect(() => {
    const user = userId;
    if (!user) {
      return;
    }

    initialSocket(user);

    listenToAdminRequest(async (err, data) => {
      if (err) {
        return;
      }

      const { implement_id, user_id, request_id} = data;

      // Añadir el nuevo objeto AL ARRAY DE PENDIENTES
      setRequestPending((prevRequests) => [
        ...prevRequests,
        { implement_id, user_id, request_id },
      ]);

      setIsOpenModal(true); // Abrir el modal si no lo estaba
    });

    refreshAdminRoom((err, data) => {
      if (err) {
        return;
      }
      if (data.success) {
        refresh();
      }
    });

    return () => {
      disconnectSocket();
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

    if (!currentRequest) {
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
    if (status === "accepted" && !limitedAt) {
      window.showAlert(
        "Debe especificar el tiempo límite para aceptar la solicitud.",
        "warning"
      );
      return;
    }

    console.log(currentRequest);
    const { implement_id, request_id, user_id} = currentRequest;

    // Validación de datos de la solicitud
    if (request_id === 0 || user_id === 0 || implement_id === 0) {
      window.showAlert(
        "Error interno: Datos de solicitud incompletos.",
        "error"
      );
      return;
    }

    // Usamos un try-catch para manejar errores de la API
    try {
      // **********************************************
      // CRÍTICO: ACTUALIZAR EL ESTADO EN LA BASE DE DATOS (DB)
      // **********************************************
      // const response = await RequestService.updateRequest({
      //   request_id: request_id,
      //   status: status.toUpperCase(), // Tu backend espera mayúsculas
      //   limited_at: limitedAt, // Será null si es 'refused'
      //   implement_id: implement_id,
      // });

      // if (!response.success) {
      //   throw new Error(response.error.message || "Fallo la actualización de la solicitud en la DB.");
      // }
      
      // **********************************************
      // RESPUESTA AL CLIENTE POR SOCKET (Solo si DB es exitoso)
      // **********************************************
      sendResponseToClient({
        request_id: request_id,
        status: status, 
        limited_at: limitedAt, // Enviamos el tiempo límite al cliente
        implement_id: implement_id,
        user_id: user_id,
      });

      // console.log({
      //   request_id: request_id,
      //   status: status, 
      //   limited_at: limitedAt, // Enviamos el tiempo límite al cliente
      //   implement_id: implement_id,
      //   user_id: user_id,
      //   clientId: clientId, // Importante para que el socketAdapter encuentre al cliente
      // })
      // **********************************************
      // ACTUALIZACIÓN DE LA UI (Remover de la Cola)
      // **********************************************
      setRequestPending((prevRequests) => prevRequests.slice(1));
      setCurrentForm({ limited_at: '' }); // Resetear el formulario

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
      {
        isOpenModal && requestPending.length > 0 && (
          <RequestAdminModalContainer
            // Siempre pasa los datos del PRIMER elemento en la cola [0]
            implementId={requestPending[0].implement_id}
            userId={requestPending[0].user_id}
            form={currentForm}
            onFormChange={handleModalFormChange}
            onAccepted={(limitedAt) =>
              handleResponseToClient("accepted", limitedAt)
            }
            onRefused={() => handleResponseToClient("refused")}
            // Al cerrar el modal manualmente, saltamos la solicitud y vamos a la siguiente
            onClose={() => {
                setRequestPending((prev) => prev.slice(1));
                setCurrentForm({ limited_at: '' }); // Resetear al saltar
            }} 
          />
        )
      }

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