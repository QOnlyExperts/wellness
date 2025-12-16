import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoader } from "../context/LoaderContext";

import Badge from "../components/shared/Badge";
import Card from "../components/shared/Card";
import ImplementService from "../services/ImplementService";
import AlertContainer from "../containers/shared/AlertContainer";
import Head from "../components/shared/Head";
import InputField from "../components/shared/InputField";
import HorizontalScroll from "../components/shared/HorizontalScroll";
import Button from "../components/shared/Button";
import ProgressBar from "../components/shared/ProgressBar";

import CountdownTimer from "../components/shared/CountDownTimer";

import "./HomePage.css";
import Modal from "../components/shared/Modal";
import GroupImplementService from "../services/GroupImplementService";

import NotFoundImage from "../assets/img/NoImg.svg";
import Chart from "../components/shared/Chart";
import ChartDoughnutContainer from "../containers/shared/ChartDoughnutContainer";
import DashboardCard from "../components/shared/DashboardCardDoughnut";
import ImplementListContainer from "../containers/implement/ImplementListContainer";
import ImplementUsedList from "../containers/home/ImplementUsedList";
import CheckIcon from "../components/icons/CheckIcon";
import { ASSET_STATUS_FILTERS } from "../constants/assetStatuses";
import InfoIcon from "../components/icons/InfoIcon";
import RequestModalContainer from "../containers/request/RequestModalContainer";
import RequestListByIdPersonContainer from "../containers/request/RequestListByIdPersonContainer";
import { translateStatus } from "../utils/formatStatus";
import RequestService from "../services/RequestService";

import {
  initialSocket,
  listenToAdminResponse,
  sendRequestInstrumentToAdmin,
  sendFinishRequestInstrumentToAdmin,
  disconnectSocket,
  refreshClientRoom,
  requestFailed,
  deleteInstrumentInUse,
} from "../services/socket/StudentSocket";
import {
  STATUS_FINISHED,
  STATUS_REQUESTED,
} from "../constants/requestsStatuses";
import { useRequestByIdPerson } from "../hooks/useRequestByIdPerson";
import HoursByMonthChart from "../components/shared/HoursByMonthChart";


const apiUrl = import.meta.env.VITE_API_URL;

// Función auxiliar para calcular el umbral automáticamente
const calculateThresholdHours = (createdAt, limitedAt) => {
  if (!createdAt || !limitedAt) {
    return 12; // Valor por defecto si faltan las fechas
  }

  // Convertir las fechas a objetos Date. Asumimos que son strings ISO o timestamps.
  const createdDate = new Date(createdAt);
  const limitedDate = new Date(limitedAt);

  // Calcular la duración total en milisegundos
  const totalDurationMs = limitedDate.getTime() - createdDate.getTime();

  // Convertir la duración total a horas
  const totalDurationHours = totalDurationMs / (1000 * 60 * 60);

  // Usar un porcentaje (ej. 15%) de la duración total para el umbral
  const THRESHOLD_PERCENTAGE = 0.15;

  // Calcular el umbral automático. Aseguramos que sea al menos 1 hora para evitar 0 o valores negativos.
  const automaticThreshold = Math.max(
    1,
    totalDurationHours * THRESHOLD_PERCENTAGE
  );

  // Limitar el resultado a un máximo de 24 horas si el período es muy largo, para mantener la sensación de urgencia.
  return Math.min(automaticThreshold, 24);
};

const HomePage = () => {
  const [infoPersonId, setInfoPersonId] = useState(() => {
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
      return data.user.info_person_id || null;
    } catch (e) {
      // En caso de que el JSON no sea válido
      console.error("Error parsing data from session storage:", e);
      return null;
    }
  });

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

  const [status, setStatus] = useState(null);

  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [onRequest, setOnRequest] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const [isOpenModal, setIsModalOpen] = useState(false);

  const [typeRequest, setTypeRequest] = useState(null);
  const [isOpenModalRequest, setIsModalOpenRequest] = useState(false);
  const [formRequest, setFormRequest] = useState({
    implement_id: 0,
    user_id: 0,
    request_id: 0,
  });

  const [message, setMessage] = useState(null);
  const [implementId, setImplementId] = useState(null);

  const { showLoader, hideLoader } = useLoader();
  const [groupImplementsList, setGroupImplementList] = useState([]);
  const [groupImplementId, setGroupImplementId] = useState(null);
  const [implementList, setImplementList] = useState([]);
  const [requestActive, setRequestActive] = useState(null);
  const [implementListByIdGroup, setImplementListByIdGroup] = useState([]);

  const [expandedCardId, setExpandedCardId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const { requestList, hours, loading, error } = useRequestByIdPerson({
    infoPersonId,
  });

  const horasPorMes = [
    { mes: "Ene", horas: 10 },
    { mes: "Feb", horas: 26 },
    { mes: "Mar", horas: 30 },
    { mes: "Abr", horas: 10 },
    { mes: "May", horas: 10 },
    { mes: "Jun", horas: 10 },
    { mes: "Jul", horas: 10 },
    { mes: "Ago", horas: 10 },
    { mes: "Sep", horas: 10 },
    { mes: "Oct", horas: 10 },
    { mes: "Nov", horas: 10 },
    { mes: "Dic", horas: 10 },
  ];

  // Referencia para guardar el ID del temporizador
  const timeoutRef = useRef(null);

  const fetch = async () => {
    showLoader();
    // const response = await GroupImplementService.getGroupImplements();
    const response = await RequestService.getStatusWhitIdInfoPerson(
      infoPersonId
    );
    const implement = await ImplementService.getImplements();
    const groupResponse = await GroupImplementService.getGroupImplements();
    if (!groupResponse.success || !implement.success) {
      window.showAlert(
        response.error.message || "Error al obtener los implementos",
        "Error"
      );
      return;
    }

    setRequestActive(response.data);
    setGroupImplementList(groupResponse.data);
    setImplementList(implement.data);
    hideLoader();
  };

  // Función para cancelar cualquier timeout existente
  const clearTimeoutIfRunning = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Define la lógica de inicio del timer (puede ser llamada desde handleInstrumentRequest)
  const startTimeoutLogic = useCallback(() => {
    clearTimeoutIfRunning(); // Limpia cualquier timer viejo

    timeoutRef.current = setTimeout(() => {
      // --- LÓGICA DE TIEMPO EXPIRADO ---
      setMessage("Expiró el tiempo de espera de la solicitud");
      setIsLoadingModal(false);

      setTimeout(() => {
        setMessage(null);
        setOnRequest(false);
      }, 5000);
    }, 60000); // 1 minuto
  }, [setIsLoadingModal, setMessage, setOnRequest]); // Dependencias del callback

 useEffect(() => {
  if (!userId) return;

  const sock = initialSocket(userId);

  // Listeners
  listenToAdminResponse((err, data) => {
    if (err) { clearTimeoutIfRunning(); return; }
    if (data.message) setMessage(data.message);
    if (data.status) {
      clearTimeoutIfRunning();
      setIsLoadingModal(false);
      setOnRequest(true);
      setStatus(data.status);
      setMessage(`Solicitud ${translateStatus(data.status)}`);
      setTimeout(() => { setMessage(null); setOnRequest(false); }, 5000);
    }
  });

  refreshClientRoom((err, data) => {
    if (!err && data.success) fetch();
  });

  requestFailed((err, data) => {
    if (!err && !data.success) {
      setIsLoadingModal(false);
      setOnRequest(true);
      setMessage(data.message);
      setTimeout(() => { setMessage(null); setOnRequest(false); }, 5000);
    }
  });

  fetch();

  return () => {
    clearTimeoutIfRunning();
    // Si quieres mantener el socket abierto no lo desconectes
  };
}, [userId, startTimeoutLogic]);

  const clearFormRequest = () => {
    setFormRequest({
      implement_id: 0,
      user_id: 0,
      request_id: 0,
    });
    setTypeRequest(null);
  };

  const handleInstrumentRequest = () => {
    if (!formRequest.implement_id || formRequest.implement_id === 0) {
      return;
    }

    sendRequestInstrumentToAdmin({
      implement_id: formRequest.implement_id,
      user_id: userId,
    });
    setIsLoadingModal(true);

    // DISPARAR EL TIMEOUT AQUÍ
    startTimeoutLogic();
  };

  // Id instrument, Realiza la solicitud
  const handleInstrumentFinishRequest = () => {
    if (formRequest.implement_id === 0 || formRequest.request_id === 0) {
      return;
    }

    sendFinishRequestInstrumentToAdmin({
      implement_id: formRequest.implement_id,
      user_id: userId,
      request_id: formRequest.request_id,
      status: typeRequest, // debería ser finished
    });

    setIsLoadingModal(true);
  };

  const handleRequest = () => {
    // Verificamos que los datos necesitados ya se encuentren

    if (typeRequest === STATUS_REQUESTED) {
      handleInstrumentRequest();
    }

    if (typeRequest === STATUS_FINISHED) {
      handleInstrumentFinishRequest();
    }
    clearFormRequest();
  };

  const handleRequestModalImplement = (type, implementId, requestId) => {
    if (!implementId) {
      console.log("Falta el id de implemento");
      return;
    }

    if (requestActive && type === STATUS_REQUESTED) {
      window.showAlert(
        `Solicitud bloqueada: En estos momentos tiene un implemento en uso. Liberalo para usar mas implementos`,
        "error"
      );
      // Detiene la ejecución de la función, sin retornar nada.
      return;
    }

    if (type === STATUS_REQUESTED) {
      // 1. Usar .find() para obtener el OBJETO, no un array filtrado.
      const implement = implementList.find((imp) => imp.id === implementId);

      // 2. Definir los estados que bloquean la solicitud (NO DISPONIBLE)
      const occupiedStatuses = ["borrowed", "retired", "maintenance"];

      // 3. Validar si el implemento existe y si su estado está en la lista de estados ocupados
      if (implement && occupiedStatuses.includes(implement.status)) {
        window.showAlert(
          `Solicitud bloqueada: El implemento está en estado: ${translateStatus(
            implement.status
          )}`,
          "warning"
        );
        // Detiene la ejecución de la función, sin retornar nada.
        return;
      }
    }
    // 4. Si el implemento está disponible o no se encontró un estado de bloqueo,
    // se procede a abrir el modal.
    setFormRequest({
      implement_id: implementId,
      user_id: userId,
      request_id: requestId,
    });

    setTypeRequest(type);
    setImplementId(implementId);
    setIsModalOpenRequest(true);
  };

  const handleImplement = async (groupId) => {
    if (!implementListByIdGroup[groupId]) {
      const response = await ImplementService.getImplementsByIdGroup(groupId);

      if (!response.success) return;
      setImplementListByIdGroup((prev) => ({
        ...prev,
        [groupId]: JSON.parse(JSON.stringify(response.data)),
      }));
    }

    setExpandedCardId(expandedCardId === groupId ? null : groupId);
  };

  const renderFiltroOpciones = () => {
    return ASSET_STATUS_FILTERS.map((status) => (
      <Badge key={status.value} value={status.value} />
    ));
  };

  // Calcular el thresholdHours automáticamente aquí
  const automaticThreshold = requestActive
    ? calculateThresholdHours(
        requestActive.created_at,
        requestActive.limited_at
      )
    : 24; // Valor por defecto si no hay solicitud activa

  return (
    <div className="div-principal-home">
      {isOpenModalRequest && (
        <RequestModalContainer
          typeRequest={typeRequest}
          implementId={implementId}
          userId={userId}
          onClick={handleRequest}
          onClose={() => setIsModalOpenRequest(false)}
          message={message}
          status={status}
          isLoading={isLoadingModal}
          onRequest={onRequest}
        />
      )}

      {/* {
        isOpenModal && (
          <Modal
            title="Información sobre Estados de implementos"
            isOpen={isOpenModal}
            onClose={() => setIsModalOpen(false)}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                justifyContent: "center",
                textAlign: "justify",
                gap: "20px",
              }}
            >
              <h4>Indicadores de color</h4>
              <p>
                Los indicadores de estados se muestran así para{" "}
                <strong>identificar rápidamente</strong> la situación actual de
                cada
                <strong>implemento</strong>. Esta codificación de colores
                permite a los usuarios <strong>conocer inmediatamente</strong>{" "}
                si un implemento está <strong>Disponible</strong> (verde),{" "}
                <strong>Prestado</strong> (rojo), en <strong>Reparación</strong>{" "}
                (amarillo/naranja) o <strong>Retirado</strong> (gris),
                garantizando una{" "}
                <strong>visualización rápida del estado</strong> y facilitando
                la labor de filtrado.
              </p>

              <h4>Significado de los Bordes de Color</h4>
              <p>
                El borde de color que rodea el ícono de cada implemento (como se
                ve en las cartas de implementos) es un{" "}
                <strong>indicador visual rápido</strong> del estado, reforzando
                la información de los indicadores. Esto permite identificar de
                un vistazo si un implemento está <strong>disponible</strong>{" "}
                (verde) o si está <strong>en posesión de otro usuario</strong>{" "}
                (rojo).
              </p>
              <Button
                className="btn-icon"
                onClick={() => setIsModalOpen(false)}
              >
                Cerrar
              </Button>
            </div>
          </Modal>
        )
      } */}

      <Head
        title="Grupos de implementos"
        subTitle="Toca para seleccionar y ver implementos"
      />
      {/* <div className="div-badge-container">
        <div className="div-badge-content">
          {renderFiltroOpciones()}
          <Button onClick={() => setIsModalOpen(true)} className="btn-icon">
            <InfoIcon size={20} color="#555555" />
          </Button>
        </div>
      </div> */}

      <AlertContainer />

      <HorizontalScroll>
        {groupImplementsList.length > 0 ? (
          groupImplementsList.map((imp) =>
            selectedGroup === null || selectedGroup === imp.id ? (
              <div
                key={imp.id}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Card
                  onClick={() => {
                    handleImplement(imp.id);
                    setSelectedGroup(selectedGroup === imp.id ? null : imp.id);
                  }}
                  type="no-border"
                  images={
                    imp.images_preview?.length
                      ? imp.images_preview.map(
                          (img) => `${apiUrl}/${img}`
                        )
                      : [NotFoundImage]
                  }
                  title={imp.name}
                  expanded={expandedCardId === imp.id}
                  onClose={() => {
                    setExpandedCardId(null);
                    setSelectedGroup(selectedGroup === imp.id ? null : imp.id);
                  }} // cierre al presionar el botón
                />

                {/* Aparecen los implementos uno por uno */}
                <AnimatePresence>
                  {expandedCardId === imp.id && (
                    <motion.div
                      className="implements-list"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ staggerChildren: 0.15, delayChildren: 0.3 }}
                      style={{
                        display: "flex",
                        gap: "10px",
                        paddingLeft: "20px",
                      }}
                    >
                      {implementListByIdGroup[imp.id]?.map((child, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ duration: 0.4 }}
                        >
                          <Card
                            className="card-overlay-style"
                            type={child.status}
                            cod={child.cod}
                            onClick={() =>
                              handleRequestModalImplement(
                                "requested",
                                child.id,
                                0
                              )
                            }
                            images={
                              child.imgs?.length
                                ? child.imgs.map(
                                    (img) =>
                                      `${apiUrl}/${img.description}`
                                  )
                                : [NotFoundImage]
                            }
                            // onClick={}
                            
                            title={child.name ? child.name : "Sin nombre"}
                          >
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}>
                              <Badge value={child.status} />
                              <span>{child.cod}</span>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : null
          )
        ) : (
          <div>
            {/* <h3>No hay implementos en uso</h3> */}
            <Card
              // type={}
              // cod={child.cod}
              title={"No seleccionado"}
              images={[NotFoundImage]}
            />
          </div>
        )}
      </HorizontalScroll>

      <Head
        title="Implemento en uso y estadísticas"
        subTitle="Selecciona para devolver"
      />

      <div className="div-home-implements-not-used">
          {requestActive ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Card
                onClick={() =>
                  handleRequestModalImplement(
                    "finished",
                    requestActive.implement.id,
                    requestActive.id
                  )
                }
                type={requestActive.implement.status}
                images={
                  requestActive.implement.imgs &&
                  requestActive.implement.imgs.length > 0
                    ? requestActive.implement.imgs.map(
                        (img) => `${apiUrl}/${img.description}`
                      )
                    : [NotFoundImage]
                }
                title={requestActive.implement.name ? requestActive.implement.name : "Sin nombre"}
                // description={formImplement.status}
              >
                <Badge value={requestActive.implement.status} />
              </Card>

              <CountdownTimer
                createdAt={requestActive.created_at}
                limitedAt={requestActive.limited_at}
                // Usamos la variable calculada aquí
                thresholdHours={automaticThreshold}
              />
            </div>
          ) : (
            <div>
              {/* <h3>No hay implementos en uso</h3> */}
              <Card
                // type={}
                // cod={child.cod}
                title={"No seleccionado"}
                images={[NotFoundImage]}
              />
            </div>
          )}

          <div className="stats-hours">
            <DashboardCard totalHoras={hours} horasPorMes={horasPorMes} />
            <HoursByMonthChart requests={requestList} />
          </div>

      </div>
      <Head
        title="Implementos usados"
        subTitle="Contiene los implementos usados con sus horas y las fechas asignadas"
      />
      <RequestListByIdPersonContainer
        requestList={requestList}
        isLoading={loading}
        error={error}
      />
    </div>
  );
};

export default HomePage;
