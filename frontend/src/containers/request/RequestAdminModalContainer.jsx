import { useEffect, useState } from "react";
import Card from "../../components/shared/Card";
import Modal from "../../components/shared/Modal";
import Loader from "../../components/shared/Loader";
import Button from "../../components/shared/Button";

import NotFoundImage from "../../assets/img/NoImg.svg";

import ImplementService from "../../services/ImplementService";
import UserService from "../../services/UserService";
import InputField from "../../components/shared/InputField";
import DateTimeSelector from "../../components/shared/DateTimeSelector";

const RequestAdminModalContainer = ({
  implementId,
  userId,
  onAccepted, // Recibe la función handleResponseToClient del padre
  onRefused,
  form, // Objeto del estado del formulario (contiene limited_at)
  onFormChange, // Función para actualizar el estado del formulario en el padre
  onClose, // Handler para cerrar/saltar el modal
}) => {
  const [implement, setImplement] = useState({});
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // useEffect: No necesita cambios, sigue cargando los datos del implemento y usuario
  useEffect(() => {
    const fetch = async () => {
      // Ejecuta las llamadas al servicio solo si los IDs son válidos.
      if (
        implementId &&
        !isNaN(Number(implementId)) &&
        userId &&
        !isNaN(Number(userId))
      ) {
        setIsLoading(true);

        const response = await ImplementService.getImplementById(implementId);
        const responseUser = await UserService.getUserById(userId);

        if (!response.success || !responseUser.success) {
          window.showAlert(
            response?.error.message ||
              "Error al obtener el implemento o usuario",
            "error"
          );
          // Opcional: Llamar a onClose aquí si el fetch falla y queremos descartar la solicitud.
          return;
        }

        setImplement(response.data);
        setUser(responseUser.data);

        setIsLoading(false);
      }
    };
    fetch();
    // Nota: Agregamos implementId y userId a las dependencias si se reusa el componente
  }, [implementId, userId]);

  if (isLoading) {
    return (
      <Modal>
        <Loader />
        <p>Cargando datos de la solicitud</p>
      </Modal>
    );
  }

  // Validación de que el campo limited_at no esté vacío antes de aceptar
  const canAccept = form.limited_at && String(form.limited_at).length > 0;

  return (
    <Modal title="Información de solicitud" onClose={onClose}>
      {" "}
      {/* Añadido onClose */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        {/* ... Renderizado del Card e InputFields ... */}
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
            flexDirection: "column",
            width: "240px",
            gap: "10px",
          }}
        >
          {/* ... InputFields del Usuario ... */}
          <InputField
            disabled={true}
            type="text"
            label="Nombres"
            value={`${user.info_person?.name1 || ""} ${
              user.info_person?.name2 || ""
            }`}
          />
          <InputField
            disabled={true}
            type="text"
            label="Apellidos"
            value={`${user.info_person?.last_name1 || ""} ${
              user.info_person?.last_name2 || ""
            }`}
          />
          <InputField
            disabled={true}
            type="text"
            label="Identificación"
            value={`${user.info_person?.identification || ""}`}
          />
          <InputField
            disabled={true}
            type="text"
            label="Correo institucional"
            value={`${user?.email || ""}`}
          />
          <InputField
            disabled={true}
            type="text"
            label="Programa"
            value={`${user.info_person?.program?.name || ""}`}
          />
        </div>
      </div>
      {/* DateTimeSelector ahora usa los props form y onFormChange */}
      <DateTimeSelector
        type="time"
        value={form.limited_at || ""}
        onChange={(e) => {
          // Llama al handler que está en el componente padre
          onFormChange({ name: "limited_at", value: e });
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
        <Button className="btn-secondary" text="Rechazar" onClick={onRefused} />
        <Button
          className="btn-primary"
          text="Aceptar"
          // Deshabilita el botón si no se ha seleccionado el tiempo límite
          disabled={!canAccept}
          // *************************************************************
          // CRÍTICO: Aquí es donde se pasa form.limited_at al padre (onAccepted)
          // *************************************************************
          onClick={() => onAccepted(form.limited_at)}
        />
      </div>
    </Modal>
  );
};

export default RequestAdminModalContainer;