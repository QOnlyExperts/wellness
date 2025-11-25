import { useState, useEffect } from "react";
import { useRequest } from "../../hooks/useRequest";

import RequestListContainer from "../../containers/request/RequestListContainer";
import RequestStatsContainer from "../../containers/request/RequestStatsContainer";
import RequestHeadContainer from "../../containers/request/RequestHeadContainer";

import {
  initialSocket,
  listenToAdminRequest,
  sendResponseToClient,
  refreshAdminRoom,
  disconnectSocket
} from '../../services/socket/AdminSocket';
import RequestAdminModalContainer from "../../containers/request/RequestAdminModalContainer";
import { hslaToRgba } from "framer-motion";

import { ASSET_STATUS_REQUEST_FILTERS } from "../../constants/requestsStatuses";

const RequestPage = () => {  
  
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
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [form, setForm] = useState({
    implement_id: 0,
    user_id: 0,
    request_id: 0,
    clientId: 0,
  })

  const filterStatusRequested = () => {
    
  }

  // Inicia el socket y escucha el canal
	useEffect(() => {
		const user = userId;
    
		if(!user){
			return
		}
    // Iniciamos el socket
		initialSocket(user)
		// setUser(user)
		// setSocketIo(socket)

		// Escucha las solicitudes de los estudiantes
    // Recibe: 
    // {
    //   implement_id: number;
    //   user_id: number;
    //   status: string;
    // }
		listenToAdminRequest(async (err, data) => {
      if (err) {
        return;
      }

      const { implement_id, user_id, request_id, clientId } = data;
      // Guardamos la información recibida
      setForm({
        implement_id,
        user_id,
        request_id,
        clientId: clientId,
      });

      //
      setIsOpenModal(true);
    });

    // Para refrescar la tabla de solicitudes creadas
    refreshAdminRoom((err, data) => {
      if (err) {
        return;
      }
      // Se realiza correctamente si success es true
      if (data.success) {
        // Refrescamos la vista
        refresh(); // Refresh del hook
      }
    });

		return () => {
			disconnectSocket()
		}
	}, [])

  const handleResponseToClient = async(status) => {
    // 1. Definir los estados permitidos

    // 2. Verificar si el status NO está en el array
    if (!status || !ASSET_STATUS_REQUEST_FILTERS.find(stat => stat.value === status)) {
        console.error(`Status inválido recibido: ${status}`);
        // Muestra una alerta si estás en el frontend
        // window.showAlert("Respuesta de estado inválida.", "error"); 
        return;
    }
    // --- 2. VALIDACIÓN DE INTEGRIDAD DE IDs (¡Crucial!) ---
    const { implement_id, request_id, user_id } = form;

    if (request_id === 0 || user_id === 0 || implement_id === 0) {
        // console.error("Fallo de integridad: Falta request_id, implement_id o clientId en el formulario.");
        // Muestra una alerta, ya que este es un error interno del flujo
        window.showAlert("Error interno: Datos de solicitud incompletos.", "error"); 
        return;
    }
    // Aqui creamos la solicitud 
    // const response = await RequestService.postRequest({})

		sendResponseToClient({implement_id: form.implement_id, request_id: form.request_id, status: status, user_id: form.user_id})
		setIsOpenModal(false)
	}


  return (    
    <div className="div-principal">

      {
        isOpenModal &&
          <RequestAdminModalContainer
            implementId={form.implement_id}
            userId={form.user_id}
            onAccepted={() =>handleResponseToClient('accepted')}
            onRefused={() => handleResponseToClient('refused')}
          />
      }

      <RequestHeadContainer />
      <RequestStatsContainer stats={stats} loading={loading} error={error}/>
      <RequestListContainer requestList={requestList} loading={loading} error={error}/>
    </div>
  );
}

export default RequestPage;