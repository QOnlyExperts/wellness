import { useEffect } from "react";
// Importar hooks
import { useRequest } from "../../hooks/useRequest";

// Importar componentes compartidos
import Head from "../../components/shared/Head";

// Importar iconos específicos para Solicitudes
// import RequestPendingIcon from "../../components/icons/RequestPendingIcon";
// import RequestInProgressIcon from "../../components/icons/RequestInProgressIcon";
// import RequestLateIcon from "../../components/icons/RequestLateIcon";
// import RequestTotalIcon from "../../components/icons/RequestTotalIcon";

import PlusCircleIcon from "../../components/icons/PlusCircleIcon";
import RequestIcon from "../../components/icons/Request";
import CancelIcon from "../../components/icons/CancelIcon";

const RequestStatsContainer = ({ stats, loading, error }) => {
  if (loading) return <p>Cargando estadísticas de solicitudes...</p>;
  if (error) return <p>Error al cargar estadísticas de solicitudes</p>;

  return (
    <Head
      title="Estadísticas"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: "10px",
        }}
      >
        <div className="content-statistics">
          {/* 4. Solicitudes Totales (totalRequests) */}
          <div className="statistics">
            <span style={{ fontSize: "35px", color: "#000000ff" }}>
              <div className="statistics-icon">
                <RequestIcon color="var(--sidebar)" size={35} />
                {stats.totalRequests}
              </div>
            </span>
            <span style={{ fontWeight: "bold", color: "#111827" }}>
              Total de Solicitudes
            </span>
          </div>

          <div className="statistics">
            <span style={{ fontSize: "35px", color: "#000000ff" }}>
              <div className="statistics-icon">
                <PlusCircleIcon color="var(--color-available)" size={35} />
                {stats.pendingRequests}{" "}
              </div>
            </span>
            <span style={{ fontWeight: "bold", color: "#111827" }}>
              Pendientes
            </span>
          </div>

          <div className="statistics">
            <span style={{ fontSize: "35px", color: "#000000ff" }}>
              <div className="statistics-icon">
                <CancelIcon color="#DC3545" size={35} />
                {stats.inProgressRequests}
              </div>
            </span>
            <span style={{ fontWeight: "bold", color: "#111827" }}>
              Rechazadas
            </span>
          </div>
          <div className="statistics">
            <span style={{ fontSize: "35px", color: "#000000ff" }}>
              <div className="statistics-icon">
                <PlusCircleIcon color="#DC3545" size={35} />
                {stats.lateRequests}
              </div>
            </span>
            <span style={{ fontWeight: "bold", color: "#111827" }}>
              Limite excedido
            </span>
          </div>
        </div>
      </div>
    </Head>
  );
};

export default RequestStatsContainer;
