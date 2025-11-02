import { useEffect, useState } from "react";
import { useLoader } from "../../context/LoaderContext";
import { Link, useNavigate, useLocation } from 'react-router-dom';

import ImplementService from "../../services/ImplementService";
import AlertContainer from "../../containers/shared/AlertContainer";
import Head from "../../components/shared/Head";
import HorizontalScroll from "../../components/shared/HorizontalScroll";
import Card from "../../components/shared/Card";
import Badge from "../../components/shared/Badge";

import DashboardChartsImplements from "../../components/implement/DashboardChartsImplements";

import CheckIcon from "../../components/icons/CheckIcon"
import ConfigIcon from "../../components/icons/Config"
import CancelIcon from "../../components/icons/CancelIcon"
import WarningIcon from "../../components/icons/WarningIcon"

import "./ImplementPage.css";

import NotFoundImage from "../../assets/img/NoImg.svg";
import { useParams } from "react-router-dom";
import { translateStatus } from "../../utils/formatStatus";

const ImplementPage = () => {
  const { showLoader, hideLoader } = useLoader();
  const [implementList, setImplementList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [implementCategory, setImplementCategory] = useState([]);
  const { status } = useParams();

  useEffect(() => {
    const fetch = async () => {
      if (!status) return; // si no hay status, no hacer la llamada
      showLoader();
      const statusList = [
        "all",
        "available",
        "borrowed",
        "maintenance",
        "retired",
      ];
      let response;

      if (status === "all") {
        response = await ImplementService.getImplements();

        if (response.success) {
          const countStatus = statusList.reduce((acc, status) => {
            const found = response.data.filter((imp) => imp.status === status);
            if (found.length > 0) {
              acc.push({ status: status, amount: found.length });
            }
            return acc;
          }, []);
          // Output expected: [{ status: available, amount: 2 }]

          // Filtramos las categorias y agrupamos su cantidad
          const implementsCategory = Object.values(
            response.data.reduce((acc, implement) => {
              const category = implement.groupImplement?.name || "Sin categoría";

              if (!acc[category]) {
                acc[category] = { category, amount: 0 };
              }

              acc[category].amount += 1;
              return acc;
            }, {})
          );


          setStatusList(countStatus);
          setImplementCategory(implementsCategory);

        }
      } else {
        // const response = await GroupImplementService.getGroupImplements();
        response = await ImplementService.getImplementsByStatus(status);
      }

      if (!response.success) {
        window.showAlert(
          response?.error.message || "Error al obtener los implementos",
          "Error"
        );
        return;
      }

      setImplementList(response.data);
      // window.showAlert(response?.message || "Implementos obtenidos exitosamente", "success");
      hideLoader();
    };

    fetch();
  }, [status]);

  const renderBadge = (status) => {
      return (
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >

          {
            status.status === "available" &&
              <CheckIcon color="var(--color-available)" />
          }
          {
            status.status === "borrowed" && 
              <WarningIcon color="var(--color-borrowed)" />
          }
          {
            status.status === "maintenance" && 
              <ConfigIcon color="var(--color-maintenance)" />
          }
          {
            status.status === "retired" && 
              <CancelIcon color="var(--color-retired)" />
          }
          {translateStatus(status.status)}
          {/* <Badge key={i} label={status.status} value={status.status}/> */}
        </div>
      )
  };

  return (
    <div className="div-principal">
      <AlertContainer />
      <Head title="Estados de implementos">
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <div
            style={{
              flex: 1, // 👈 ocupa espacio proporcional dentro del contenedor
              background: "#ffffffff",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "var(--box-shadow)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontWeight: "bold", color: "#111827" }}>
              {renderBadge({status: "all"})}
            </span>
            <span style={{ fontSize: "24px", color: "#111827" }}>
              {implementList.length}
            </span>
          </div>
          {statusList.length > 0 &&
            statusList.map((status, i) => (
              <div
                key={i}
                style={{
                  flex: 1, // 👈 ocupa espacio proporcional dentro del contenedor
                  background: "#ffffffff",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center",
                  boxShadow: "var(--box-shadow)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontWeight: "bold", color: "#111827" }}>
                  {renderBadge(status)}
                </span>
                <span style={{ fontSize: "24px", color: "#111827" }}>
                  {status.amount}
                </span>
              </div>
            ))}
        </div>
      </Head>

      <div
        style={{
          display: "flex",
          marginBottom: "10px",
          padding: "10px",
          gap: "10px",
        }}
      >
        <Link to={`/admin/implement/status/all`}>
          <Badge label={"all"} value={"all"} />
        </Link>
        {statusList.length > 0 &&
          statusList.map((status, i) => (
            <Link to={`/admin/implement/status/${status.status}`}>
              <Badge key={i} label={status.status} value={status.status} />
            </Link>
          ))}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          overflowY: "auto",
          gap: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
            }}
          >
            {implementList.length > 0 ? (
              implementList.map((imp, i) => (
                <Card
                  key={i}
                  // onClick={() => handleImplement(imp.id)}
                  type={imp.status}
                  images={
                    imp.imgs && imp.imgs.length > 0
                      ? imp.imgs.map(
                          (img) => `http://localhost:4000/${img.description}`
                        )
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
              <h4>No hay implementos en el inventario</h4>
            )}
          </div>
        </div>

        <div>
          <DashboardChartsImplements
            implementCategory={implementCategory}
            distributionStatus={statusList}
          />
        </div>
      </div>
    </div>
  );
};

export default ImplementPage;
