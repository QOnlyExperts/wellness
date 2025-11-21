import { useEffect, useState } from "react";
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

  const [isOpenModal, setIsModalOpen] = useState(false);

  const [isOpenModalRequest, setIsModalOpenRequest] = useState(false);
  const [implementId, setImplementId] = useState(null);

  const { showLoader, hideLoader } = useLoader();
  const [groupImplementsList, setGroupImplementList] = useState([]);
  const [groupImplementId, setGroupImplementId] = useState(null);
  const [implementList, setImplementList] = useState([]);
  const [requestActive, setRequestActive] = useState(null);
  const [implementListByIdGroup, setImplementListByIdGroup] = useState([]);
  
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const horasPorMes = [
    { mes: "Ene", horas: 10 },
    { mes: "Feb", horas: 26 },
    { mes: "Mar", horas: 30 },
    { mes: "Abr", horas: 10 },
  ];

  useEffect(() => {
    


    const fetch = async () => {
      showLoader();
      // const response = await GroupImplementService.getGroupImplements();
      const response = await RequestService.getStatusWhitIdInfoPerson(infoPersonId);
      const implement = await ImplementService.getImplements();
      const groupResponse = await  GroupImplementService.getGroupImplements();
      if (!groupResponse.success || !implement.success) {
        window.showAlert(
          response.error.message || "Error al obtener los implementos",
          "Error"
        );
        return;
      }
      
      setRequestActive(response.data);
      setGroupImplementList(groupResponse.data);
      setImplementList(implement.data)
      hideLoader();
    };

    fetch();
  }, []);

  const handleRequestModalImplement = (implementId) => {

    if(requestActive){
      window.showAlert(
        `Solicitud bloqueada: En estos momentos tiene un implemento en uso. Liberalo para usar mas implementos`,
        "error"
      );
      // Detiene la ejecución de la función, sin retornar nada.
      return;
    }
    // 1. Usar .find() para obtener el OBJETO, no un array filtrado.
    const implement = implementList.find(
      (imp) => imp.id === implementId
    );

    // 2. Definir los estados que bloquean la solicitud (NO DISPONIBLE)
    const occupiedStatuses = ["borrowed", "retired", "maintenance"];

    // 3. Validar si el implemento existe y si su estado está en la lista de estados ocupados
    if (implement && occupiedStatuses.includes(implement.status)) {
      window.showAlert(
        `Solicitud bloqueada: El implemento está en estado: ${translateStatus(implement.status)}`,
        "warning"
      );
      // Detiene la ejecución de la función, sin retornar nada.
      return;
    }

    // 4. Si el implemento está disponible o no se encontró un estado de bloqueo,
    // se procede a abrir el modal.
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

  return (
    <div className="div-principal-home">
      {isOpenModalRequest && (
        <RequestModalContainer
          implementId={implementId}
          onClose={() => setIsModalOpenRequest(false)}
        />
      )}

      {
        /* Modal de información */
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
      }

      <Head
        title="Grupos de implementos"
        subTitle="Toca para seleccionar y ver implementos"
      />
      <div className="div-badge-container">
        <div className="div-badge-content">
          {renderFiltroOpciones()}
          <Button onClick={() => setIsModalOpen(true)} className="btn-icon">
            <InfoIcon size={20} color="#555555" />
          </Button>
        </div>
      </div>

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
                          (img) => `http://localhost:4000/${img}`
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
                            title={child.cod}
                            onClick={() =>
                              handleRequestModalImplement(child.id)
                            }
                            images={
                              child.imgs?.length
                                ? child.imgs.map(
                                    (img) =>
                                      `http://localhost:4000/${img.description}`
                                  )
                                : [NotFoundImage]
                            }
                            // onClick={}
                          />
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

      <Head title="Implementos en uso" subTitle="Selecciona para devolver" />


      <div className="div-home-implements-not-used">
        {requestActive ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <Card
              onClick={() => console.log(imp.id)}
              type={requestActive.implement.status}
              images={
                requestActive.implement.imgs && requestActive.implement.imgs.length > 0
                  ? requestActive.implement.imgs.map(
                      (img) => `http://localhost:4000/${img.description}`
                    )
                  : [NotFoundImage]
              }
              title={requestActive.implement.groupImplement.name}
              // description={formImplement.status}
            />

            <CountdownTimer 
              createdAt={requestActive.created_at} 
              limitedAt={requestActive.limited_at} 
              thresholdHours={12} // Se vuelve crítico si quedan menos de 12 horas
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            // height: "auto",
            gap: "10px",
          }}
        >
          <DashboardCard totalHoras={76} horasPorMes={horasPorMes} />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            // height: "30vh",
            padding: "1px",
            borderRadius: "10px",
            boxSizing: "border-box",
            overflowY: "auto",
            backgroundColor: "#ffffff",
          }}
        >
          <RequestListByIdPersonContainer infoPersonId={infoPersonId} />
        </div>
      </div>
      {/* <Modal>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px'
          }}
        >
          Solicitud realizada con éxito
          <CheckIcon color="#17c700ff" size={50} />
        </div>
      </Modal> */}
    </div>
  );
};

export default HomePage;
