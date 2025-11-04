import { Link, useParams } from "react-router-dom";
import { useImplements } from "../../hooks/useImplements";

import AlertContainer from "../../containers/shared/AlertContainer";
import Head from "../../components/shared/Head";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";
import DashboardChartsImplements from "../../components/implement/DashboardChartsImplements";

import CheckIcon from "../../components/icons/CheckIcon";
import ConfigIcon from "../../components/icons/Config";
import CancelIcon from "../../components/icons/CancelIcon";
import WarningIcon from "../../components/icons/WarningIcon";

import { translateStatus } from "../../utils/formatStatus";
import NotFoundImage from "../../assets/img/NoImg.svg";

import "./ImplementPage.css";

const ImplementPage = () => {
  const { status } = useParams();

  const { implementList, statusList, implementCategory, error } = useImplements(status);

  const renderBadge = (status, total) => {
    return (
      <div className="statistics-icon">
        {status.status === "available" && (
          <CheckIcon size={35} color="var(--color-available)" />
        )}
        {status.status === "borrowed" && (
          <WarningIcon size={35} color="var(--color-borrowed)" />
        )}
        {status.status === "maintenance" && (
          <ConfigIcon size={35} color="var(--color-maintenance)" />
        )}
        {status.status === "retired" && (
          <CancelIcon size={35} color="var(--color-retired)" />
        )}
        {total}
      </div>
    );
  };

  if (error) {
    window.showAlert(error, "Error");
  }

  return (
    <div className="div-principal">
      {/* <AlertContainer /> */}
      <Head 
        title="Estados de implementos"
        subTitle="Gestión y control de estados e implementos"  
      >
        <div className="content-statistics">
          <div className="statistics">
            <span style={{ fontSize: "35px", color: "#111827" }}>
              {renderBadge({ status: "all" }, implementList.length)}
            </span>

            <span style={{ fontWeight: "bold", color: "#000000ff" }}>
              {translateStatus("all")}
            </span>
          </div>
          {statusList.map((status, i) => (
            <div className="statistics">
              <span style={{ fontSize: "35px", color: "#000000ff" }}>
                {renderBadge(status, status.amount)}
              </span>
              <span style={{ fontWeight: "bold", color: "#111827" }}>
                {translateStatus(status.status)}
              </span>
            </div>
          ))}
        </div>
      </Head>

      {/* Filtros por estado */}
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
        {statusList.map((status, i) => (
          <Link key={i} to={`/admin/implement/status/${status.status}`}>
            <Badge label={status.status} value={status.status} />
          </Link>
        ))}
      </div>

      {/* Contenido principal */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          overflowY: "auto",
          gap: "15px",
        }}
      >
        {/* Lista de implementos */}
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
                  type={imp.status}
                  images={
                    imp.imgs && imp.imgs.length > 0
                      ? imp.imgs.map(
                          (img) => `http://localhost:4000/${img.description}`
                        )
                      : [NotFoundImage]
                  }
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

        {/* Gráficas */}
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
