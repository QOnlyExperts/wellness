import { useEffect, useState } from "react";
import Card from "../../components/shared/Card";
import Modal from "../../components/shared/Modal";
import Loader from "../../components/shared/Loader";
import Button from "../../components/shared/Button";

import NotFoundImage from "../../assets/img/NoImg.svg";

import {
  initialSocket,
  listenToAdminRequest,
  sendResponseToClient,
  disconnectSocket
} from '../../services/socket/AdminSocket';

import ImplementService from "../../services/ImplementService";
import UserService from "../../services/UserService";




const RequestAdminModalContainer = ({ implementId, userId, onClick, onClose, onRefresh}) => {
  const [implement, setImplement] = useState({});
  const [user, setUser] = useState({});

  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    limited_at: "",
    info_person_id: 0,
    implement_id: 0
  })

  useEffect(() => {


    const fetch = async () => {

      if ((implementId && !isNaN(Number(implementId)) || userId && !isNaN(Number(userId)))) {
        
        const response = await ImplementService.getImplementById(implementId);
        const responseUser = await UserService.getUserById(userId);

        if (!response.success || !responseUser.success) {
          window.showAlert(
            response?.error.message || "Error al obtener el implemento o usuario",
            "error"
          );
          return;
        }

        setImplement(response.data);
        setUser(responseUser.data);
      
      }
    };
    fetch();

  }, []);

	// Id instrument, guarda el estado de la solicitud y lo envia al usuario
  // {
  //   implement_id: number;
  //   user_id: number;
  //   request_id: number;
  //   status: string;
  //   clientId: string;
  // }



  return (
    <Modal title="Información de solicitud">
      {/* <div className="view-wrapper-auto">
        {view === "first" && (
          <div key="first" className={`slide-${direction}`}> */}
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
                onClick={onClick}
              />
            {/* </div>
          </div>
        )} */}
{/* 
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
        )} */}
      </div>
    </Modal>
  );
};

export default RequestAdminModalContainer;
