import { useEffect, useState } from "react";
import Card from "../../components/shared/Card";
import Modal from "../../components/shared/Modal";
import Loader from "../../components/shared/Loader";
import ImplementService from "../../services/ImplementService";
import Button from "../../components/shared/Button";

import NotFoundImage from "../../assets/img/NoImg.svg";
import CancelIcon from "../../components/icons/CancelIcon";
import CheckIcon from "../../components/icons/CheckIcon";



const RequestModalContainer = ({
  implementId,
  status,
  onClick,
  onClose,
  onRequest,
  isLoading,
  message,
}) => {
  const [implement, setImplement] = useState({});
  const [view, setView] = useState("first");
  const [direction, setDirection] = useState("none");

  useEffect(() => {
    // 1. Lógica de Sincronización de Vistas (Transiciones)
    // -----------------------------------------------------

    // A. Estado de Carga (View 'second')
    // Si isLoading es TRUE, siempre mostramos el Loader/Mensaje de espera.
    if (isLoading) {
      setView("second");
      setDirection("left"); // O 'right', dependiendo de tu animación deseada
    }
    // B. Estado de Finalización/Resultado (View 'third')
    // Si la solicitud ha finalizado (onRequest es TRUE) Y NO estamos cargando.
    else if (onRequest) {
      setView("third");
      setDirection("left"); // O 'right'
    }
    // C. Estado Inicial (View 'first')
    // Si NO estamos cargando Y NO ha finalizado la solicitud.
    else {
      setView("first");
      setDirection("none"); // Sin animación
    }

    // 2. Lógica de Carga de Datos (Implemento)
    // ---------------------------------------
    const fetch = async () => {
      if (implementId && !isNaN(Number(implementId)) && !implement.id) {
        // Añadido !implement.id para evitar recargar si ya tiene datos
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
  }, [implementId, isLoading, onRequest]); // Dependencias: implementId (para fetch), isLoading y onRequest (para las vistas)

  return (
    // ... (El JSX de tu componente se mantiene igual, ya que solo cambiamos la lógica interna)
    <Modal title="Información de solicitud">
      <div className="view-wrapper-auto">
        {view === "first" && (
          // ... (Contenido de Card y Botones)
          <div key="first" className={`view slide-${direction}`}>
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
                  onClose();
                }}
              />
              <Button className="btn-icon" text="Aceptar" onClick={onClick} />
            </div>
          </div>
        )}

        {view === "second" && (
          <div
            key="second"
            className={`view slide-${direction}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              height: "auto",
            }}
          >
            {/* Solo mostramos el loader y el mensaje de espera si isLoading es TRUE y NO se ha finalizado la solicitud (onRequest) */}
            
              <div>
                <Loader />
                <div style={{ marginTop: "150px" }}>
                  {message ? (
                    <p>{message}</p>
                  ) : (
                    <p>
                      Por favor no cierre el navegador mientras el administrador
                      procede
                    </p>
                  )}
                </div>
              </div>
          </div>
        )}

        {view === "third" && (
          <div
            key="third"
            className={`view slide-${direction}`}
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
              status === "refused" ?
                <CancelIcon color="red" size={45}/> 
              : status === "accepted" ?
                <CheckIcon   color="green" size={45}/>
              : null
            }
            <h3>{
              message
            }</h3>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RequestModalContainer;
