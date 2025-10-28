import { useEffect, useState } from "react";
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

const HomePage = () => {
  const [isOpenModal, setIsModalOpen] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  const [groupImplementsList, setGroupImplementList] = useState([]);
  const [groupImplementId, setGroupImplementId] = useState(null);
  const [implementList, setImplementList] = useState([]);
  const [implementListByIdGroup, setImplementListByIdGroup] = useState([]);

  useEffect(() => {

    const fetch = async () => {
      showLoader();
      // const response = await GroupImplementService.getGroupImplements();
      const [groupResponse, implementResponse] = await Promise.all([
          GroupImplementService.getGroupImplements(),
          ImplementService.getImplements(),
        ]);

      if (!groupResponse.success && !implementResponse.success) {
        window.showAlert(
          response?.message || "Error al obtener los implementos",
          "Error"
        );
        return;
      }

      console.log(groupResponse.data);
      console.log(implementResponse.data);

      setGroupImplementList(groupResponse.data);
      setImplementList(implementResponse.data);
      // window.showAlert(response?.message || "Implementos obtenidos exitosamente", "success");
      hideLoader();
    };

    fetch();
  }, []);

  const handleImplement = async(groupId) => {

    // if (!implementsByGroup[groupId]) significa:

    //   “Si aún no hemos cargado los implementos de este grupo…”

    // es decir, si en el objeto implementsByGroup no existe una entrada para ese groupId,
    // entonces haz la petición al backend para traerlos.

  // Si el grupo no tiene datos cargados aún, los obtenemos del backend
  if (!implementListByIdGroup[groupId]) {
    const response = await ImplementService.getImplementsByIdGroup(groupId);

    if (!response.success) return;

    // Hacemos una copia profunda de los datos
    // Esto evita que las referencias se mezclen entre grupos
    const cleanData = JSON.parse(JSON.stringify(response.data));

    // Guardamos los implementos en el estado, sin mutar otros grupos
    setImplementListByIdGroup((prev) => ({
      ...prev,
      [groupId]: cleanData,
    }));
  }

  // Aseguramos que se muestre siempre el grupo correcto
  setGroupImplementId(groupId);

  // Abrimos el modal (fuera del if, por si ya estaba cacheado)
  setIsModalOpen(true);
};


  return (
    <div className="div-principal-home">
      <AlertContainer />
      <Head title="Grupos de Implementos">
        <div style={{ width: "300px" }}>
          <ProgressBar
            label="Horas de instrumentos acumuladas"
            min={0}
            value={96}
            max={96}
            color="#29b6f6"
          />
        </div>
      </Head>

      <h5 className="sub-title">Selecciona un grupo para ver sus implementos</h5>
      <HorizontalScroll>
        {groupImplementsList.length > 0 ? (
          groupImplementsList.map((imp, i) => (
            <Card
              key={i}
              onClick={() => handleImplement(imp.id)}
              type={imp.status}
              images={
                imp.images_preview && imp.images_preview.length > 0
                  ? imp.images_preview.map(img => `http://localhost:4000/${img}`)
                  : [NotFoundImage]
              }
              title={imp.name}
              // description={formImplement.status}
            ></Card>
          ))
        ) : (
          <h4>No hay implementos en el inventario</h4>
        )}
      </HorizontalScroll>
      {/* </section> */}

      <Head title="Implementos en uso" />
      
      <h5 className="sub-title">Selecciona para devolver</h5>
      <HorizontalScroll>
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
                      ? imp.imgs.map(img => `http://localhost:4000/${img.description}`)
                      : [NotFoundImage]
                  }
                  title={imp.groupImplement.name}
                  // description={formImplement.status}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Badge
                      value={imp.status || "available"}
                      label={imp.status || "available"}
                    />

                    <span>{imp.cod}</span>
                  </div>
                </Card>
              )
          )
        ) : (
          <h3>No hay implementos en uso</h3>
        )}
      </HorizontalScroll>

      {isOpenModal && (
        <Modal title="Implementos" onClose={() => setIsModalOpen(false)}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              padding: "10px",
              backgroundColor: "#f3f3f3",
              gap: "10px",
            }}
          >
            {implementListByIdGroup[groupImplementId].length > 0 ? (
              implementListByIdGroup[groupImplementId].map((imp, i) => (
                <Card
                  key={i}
                  // onClick={() => handleImplement(imp.id)}
                  type={imp.status}
                  images={
                    imp.imgs && imp.imgs.length > 0
                      ? imp.imgs.map(img => `http://localhost:4000/${img.description}`)
                      : [NotFoundImage]
                  }
                  // description={formImplement.status}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "0",
                      right: "0",
                      marginTop: "-230px",
                      marginRight: "10px",
                    }}
                  >
                    <Badge
                      value={imp.condition || "new"}
                      label={imp.condition || "new"}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Badge
                      value={imp.status || "available"}
                      label={imp.status || "available"}
                    />

                    <span>{imp.cod}</span>
                  </div>
                </Card>
              ))
            ) : (
              <h3>No hay implementos en el inventario</h3>
            )}
          </div>
        </Modal>
      )}
      {/* {
        isOpenModal && 
          <Modal 
            title="Solicitud"
            onClose={() => setIsModalOpen(false)}>
            <h2>¿Desea solicitar el implemento?</h2>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <Button
                className="btn-tertiary"
              >
                <span>Si</span>
              </Button>
              <Button
                className="btn-secondary"
              >
                <span>No</span>
              </Button>
            </div>
          </Modal>

      } */}
    </div>
  );
};

export default HomePage;
