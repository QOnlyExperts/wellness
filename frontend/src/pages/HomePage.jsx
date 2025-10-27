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

const HomePage = () => {
  const [isOpenModal, setIsModalOpen] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  const [implementsList, setImplementList] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      showLoader();
      const response = await ImplementService.getImplements();

      if (!response.success) {
        window.showAlert(
          response?.message || "Error al obtener los implementos",
          "Error"
        );
        return;
      }

      setImplementList(response.data);
      // window.showAlert(response?.message || "Implementos obtenidos exitosamente", "success");
      hideLoader();
    };

    fetch();
  }, []);

  return (
    <div className="div-principal-home">
      <AlertContainer />
      <Head title="Implementos">
        <div style={{ width: "300px" }}>
          <ProgressBar
            label="Horas de instrumentos acumuladas"
            min={0}
            value={70}
            max={96}
            color="#29b6f6"
          />
        </div>
      </Head>

      <HorizontalScroll>
        {implementsList.length > 0 ? (
          implementsList.map((imp) => (
            <Card
              onClick={() => setIsModalOpen(true)}
              type={imp.status}
              image={
                imp.imgs.length > 0
                  ? `http://localhost:4000/${imp.imgs[0].description}`
                  : NotFoundImage
              }
              title={imp.groupImplement.name}
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

              {/* <div
                style={{
                  display: "flex",
                  width: "100%",
                }}
              >
                <Button
                  style={{
                    display: "flex",
                    position: 'absolute',
                    zIndex: '1',
                    width: "100%",
                    marginTop: '200px',
                    bottom: '0',
                    // textAlign: 'center'
                  }}
                  className="btn-primary"
                  text="Solicitar"
                ></Button>
              </div> */}
            </Card>
          ))
        ) : (
          <h3>No hay implementos en el inventario</h3>
        )}
      </HorizontalScroll>
      {/* </section> */}

      <Head title="Implementos en uso" />
      <HorizontalScroll>
        {implementsList.length > 0 ? (
            <Card
              image={
                implementsList[0].imgs.length > 0
                  ? `http://localhost:4000/${implementsList[0].imgs[0].description}`
                  : NotFoundImage
              }
              title={implementsList[0].groupImplement.name}
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
                  value={implementsList[0].condition || "new"}
                  label={implementsList[0].condition || "new"}
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
                  value={implementsList[0].status || "available"}
                  label={implementsList[0].status || "available"}
                />

                <span>{implementsList[0].cod}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                }}
              >
                <Button
                  style={{
                    display: "flex",
                    width: "100%",
                    // textAlign: 'center'
                  }}
                  className="btn-primary"
                  text="Solicitar"
                ></Button>
              </div>
            </Card>
        ) : (
          <h3>No hay implementos en el inventario</h3>
        )}
      </HorizontalScroll>
      {
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

      }
    </div>
  );
};

export default HomePage;
