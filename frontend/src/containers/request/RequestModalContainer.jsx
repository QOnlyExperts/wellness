import { useEffect, useState } from "react";
import Card from "../../components/shared/Card";
import Modal from "../../components/shared/Modal";
import Loader from "../../components/shared/Loader";
import ImplementService from "../../services/ImplementService";
import Button from "../../components/shared/Button";

import NotFoundImage from "../../assets/img/NoImg.svg";

import {
  initialSocket, 
  listenToAdminResponse, 
  sendRequestInstrumentToAdmin, 
  disconnectSocket, 
  refreshClientRoom, 
  deleteInstrumentInUse
} from '../../services/socket/StudentSocket';


const RequestModalContainer = ({ userId, implementId, onClose, onRequest }) => {
  const [implement, setImplement] = useState({});
  const [view, setView] = useState("first"); // 'login' | 'register'
  const [direction, setDirection] = useState("none");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);


  useEffect(() => {
    const fetch = async () => {

      if (implementId && !isNaN(Number(implementId))) {
        
        const response = await ImplementService.getImplementById(implementId);
        if (!response.success) {
          window.showAlert(
            response?.error.message || "Error al obtener el implemento",
            "error"
          );
          return;
        }
        setImplement(response.data);
      
      }
    };

    fetch();
  }, [implementId, isLoading]);

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

		// Escucha las respuestas del administrador
    // Recibe: 
    // {
    //   implement_id: number;
    //   user_id: number;
    //   request_id: number;
    //   status: string;
    //   clientId: string;
    // }
		listenToAdminResponse((err, data) => {
			if(err){
				return
			}

      if(data.status === "accepted"){
        //  Detenemos el loading
        setMessage("solicitud aprobada");

        // Damos tiempo para visualizar el mensaje
        setTimeout(() => {
          setIsLoading(false)
        }, 3000)

      }
		})

		// Para refrescar el estado de los instrumentos en caso de que alguno pase su estado a uso
		refreshClientRoom((err, data) => {
			if(err){
				console.log(err);
				return
			}

      // Se realiza correctamente si success es true
			if(data.success){
				setIsLoading(false);
			}
		})

		return () => {
			disconnectSocket()
		}
	}, [])

  const handleInstrumentRequest = (e) => {
    e.preventDefault();
    setDirection("right");
    setView("second");
    
    // hacemos la solicitud del implemento a la sala de administradores
		sendRequestInstrumentToAdmin({implement_id: implementId, user_id: userId, status: "requested"})
		setIsLoading(true)
  };

	// Id instrument, Realiza la solicitud
	const handleDeleteInstrumentInUse = (id) => {
		deleteInstrumentInUse({idInstrument: id, user: user})
		setIsLoading(true)
	}


  return (
    <Modal title="Información de solicitud">
      <div className="view-wrapper-auto">
        {view === "first" && (
          <div key="first" className={`slide-${direction}`}>
            <Card
              type={implement.status}
              cod={implement.cod}
              title={implement.cod}
              images={
                implement.imgs?.length
                  ? implement.imgs.map(
                      (img) => `http://localhost:4000/${img.description}`
                    )
                  : [NotFoundImage]
              }
              // onClick={}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "20px",
              }}
            >
              <Button
                className="btn-icon"
                text="Cancelar"
                onClick={(e) => {
                  e.preventDefault();
                  // Cerramos el modal
                  onClose();
                }}
              />
              <Button
                className="btn-icon"
                text="Aceptar"
                onClick={handleInstrumentRequest}
              />
            </div>
          </div>
        )}

        {view === "second" && (
          <div
            key="second"
            className={`modal-content slide-${direction}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              height: "auto"
            }}
          >
            {
              isLoading ? 
                <div>
                  <Loader/>
                  <h3 style={{marginTop: "150px"}}>Realizando solicitud</h3>
                  {
                    message  
                    ? <p>{message}</p>
                    : <p>Por favor no cierre el navegador mientras el administrador procede</p>
                  }
                </div>
              : null
            }
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RequestModalContainer;
