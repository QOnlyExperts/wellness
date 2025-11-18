import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoader } from "../context/LoaderContext";

import Badge from "../components/shared/Badge";
import Card from "../components/shared/Card";
import ImplementService from "../services/ImplementService";
import AlertContainer from "../containers/shared/AlertContainer";
import Head from "../components/shared/Head";
import HorizontalScroll from "../components/shared/HorizontalScroll";
import Button from "../components/shared/Button";
import ProgressBar from "../components/shared/ProgressBar";

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

const HomePage = () => {
  const [isOpenModal, setIsModalOpen] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  const [groupImplementsList, setGroupImplementList] = useState([]);
  const [groupImplementId, setGroupImplementId] = useState(null);
  const [implementList, setImplementList] = useState([]);
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
      const groupResponse = await  GroupImplementService.getGroupImplements();
      if (!groupResponse.success) {
        window.showAlert(
          response?.message || "Error al obtener los implementos",
          "Error"
        );
        return;
      }

      setGroupImplementList(groupResponse.data);
      hideLoader();
    };

    fetch();
  }, []);

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

  return (
    <div className="div-principal-home">
      <Head
        title="Grupos de implementos"
        subTitle="Selecciona para solicitar"
      />

      <HorizontalScroll>
        {groupImplementsList.length > 0 ?
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
                            type={child.status}
                            cod={child.cod}
                            title={child.cod}
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
          : (
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
        {implementList.length > 0 ? (
          implementList.map(
            (imp, i) =>
              imp.status === "borrowed" && (
                <Card
                  key={i}
                  onClick={() => handleImplement(imp.id)}
                  type={imp.status}
                  images={
                    imp.imgs && imp.imgs.length > 0
                      ? imp.imgs.map(
                          (img) => `http://localhost:4000/${img.description}`
                        )
                      : [NotFoundImage]
                  }
                  title={imp.groupImplement.name}
                  // description={formImplement.status}
                />
              )
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: '100%',
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
            height: "30vh",
            padding: "1px",
            borderRadius: "10px",
            boxSizing: "border-box",
            overflowY: "auto",
            backgroundColor: "#ffffff",
          }}
        >
          <ImplementUsedList />
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
