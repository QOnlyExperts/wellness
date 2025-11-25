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
import InputField from "../../components/shared/InputField";
import Badge from "../../components/shared/Badge";
import DateTimeSelector from "../../components/shared/DateTimeSelector";




const RequestAdminModalContainer = ({ implementId, userId, onAccepted, onRefused, onRefresh}) => {
  const [implement, setImplement] = useState({});
  const [user, setUser] = useState({});
  
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    limited_at: "",
    info_person_id: 0,
    implement_id: 0
  })

  useEffect(() => {

    const fetch = async () => {

      
      // Ejecuta las llamadas al servicio solo si (Implemento ID es válido y no es NaN) Y (Usuario ID es válido y no es NaN).
      if ((implementId && !isNaN(Number(implementId))) && (userId && !isNaN(Number(userId)))) {
        setIsLoading(true);
        
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
      
        setIsLoading(false);
      }
    };
    fetch();

  }, []);

  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
	// Id instrument, guarda el estado de la solicitud y lo envia al usuario
  // {
  //   implement_id: number;
  //   user_id: number;
  //   request_id: number;
  //   status: string;
  //   clientId: string;
  // }

  if (isLoading) {
    return (
      <Modal>
        <Loader />
        <p>Cargando datos de la solicitud</p>
      </Modal>
    );
  }

  return (
    <Modal title="Información de solicitud">
      {/* <div className="view-wrapper-auto">
        {view === "first" && ( */}
        <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px"
            }}
          >
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
              flexDirection: "column",
              width: "240px",
              gap: "10px",
            }}
          >
            <InputField 
              disabled={true}
              type="text"
              label="Nombres"
              value={`${user.info_person?.name1 || ''} ${user.info_person?.name2 || ''}`}
            />
            
            <InputField 
              disabled={true}
              type="text"
              label="Apellidos"
              value={`${user.info_person?.last_name1 || ''} ${user.info_person?.last_name2 || ''}`}
            />
            <InputField 
              disabled={true}
              type="text"
              label="Identificación"
              value={`${user.info_person?.identification || ''}`}
            />
            <InputField 
              disabled={true}
              type="text"
              label="Correo institucional"
              value={`${user?.email || ''}`}
            />
            <InputField 
              disabled={true}
              type="text"
              label="Programa"
              value={`${user.info_person?.program?.name || ''}`}
            />

            {/* <Badge value={user?.is_verified && "is_verified"} /> */}
          </div>
        </div>
        
            
            <DateTimeSelector 
              type="time"
              value={form.limited_at || ""}
              onChange={(e) => {
                console.log(e)
                setForm({
                  ...form,
                  limited_at: e
                });
              }}
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
                className="btn-secondary"
                text="Rechazar"
                onClick={onRefused}
              />
              <Button
                className="btn-primary"
                text="Aceptar"
                onClick={onAccepted}
              />
            </div>
        {/*   </div>
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
    </Modal>
  );
};

export default RequestAdminModalContainer;
