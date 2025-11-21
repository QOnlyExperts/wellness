import { useState, useEffect } from "react";

import RequestListContainer from "../../containers/request/RequestListContainer";
import RequestStatsContainer from "../../containers/request/RequestStatsContainer";
import RequestHeadContainer from "../../containers/request/RequestHeadContainer";

import {
  initialSocket,
  listenToAdminRequest,
  sendResponseToClient,
  disconnectSocket
} from '../../services/socket/AdminSocket';
import RequestAdminModalContainer from "../../containers/request/RequestAdminModalContainer";
import { hslaToRgba } from "framer-motion";

const RequestPage = () => {  
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
      console.log(data.user)
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
    user_id: 0
  })


  
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
		listenToAdminRequest(async(err, data) => {
			if(err){
				return
			}

      const {implement_id, user_id, status} = data;
      console.log("hola")
      // Consultamos la información enviada
      setForm({
        implement_id,
        user_id
      })

      //
      setIsOpenModal(true);
		})

		return () => {
			disconnectSocket()
		}
	}, [])

  const handleResponseToClient = async() => {

    // Aqui creamos la solicitud 
    // const response = await RequestService.postRequest({})

		sendResponseToClient({request_id: 1, status: "accepted", clientId: form.user_id})
		setIsOpenModal(false)
	}

	const handleResponseToRequest = () => {
		console.log(sessionStorage.getItem('idRequest', id));
		setIsOpenModal(false)
	}

  return (    
    <div className="div-principal">

      {
        isOpenModal &&
          <RequestAdminModalContainer
            implementId={form.implement_id}
            userId={form.user_id}
            onClick={handleResponseToClient}
          />
      }

      <RequestHeadContainer />
      <RequestStatsContainer />
      <RequestListContainer />
    </div>
  );
}

export default RequestPage;