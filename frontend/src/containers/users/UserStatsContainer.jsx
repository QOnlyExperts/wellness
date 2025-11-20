import { useEffect } from "react";
import DashboardChartsGroupImplements from "../../components/group-implement/dashboardChartsGroupImplements";
import GroupImplementIcon from "../../components/icons/GroupImplementIcon";
import ImplementIcon from "../../components/icons/ImplementIcon";
import DashboardChartsImplements from "../../components/implement/DashboardChartsImplements";
import Head from "../../components/shared/Head";
import { useUsers } from "../../hooks/useUsers";

import UsersIcon from "../../components/icons/UsersIcon";
import UserActiveIcon from "../../components/icons/UserActiveIcon";
import UserBlockedIcon from "../../components/icons/UserBlockedIcon";

const UserStatsContainer = ({ refresh: refreshFlag }) => {
  const { stats, loading, error, refresh } = useUsers();

  useEffect(() => {
    // Actualiza las estadísticas cada vez que cambie el flag
    if (refreshFlag) refresh();
  }, [refreshFlag]);

  if (loading) return <p>Cargando estadísticas...</p>;
  if (error) return <p>Error al cargar estadísticas</p>;

  return (
    <Head>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: "10px",
        }}
      >
        <div className="content-statistics">
          <div className="statistics">
            <span style={{ fontSize: "35px", color: "#000000ff" }}>
              <div className="statistics-icon">
                <UserActiveIcon color="var(--sidebar)" size={35} />
                {stats.activeUsers}
              </div>
            </span>
            <span style={{ fontWeight: "bold", color: "#111827" }}>
              Total usuarios activos
            </span>
          </div>
          
          <div className="statistics">
            <span style={{ fontSize: "35px", color: "#000000ff" }}>
              <div className="statistics-icon">
                <UserBlockedIcon color="var(--sidebar)" size={35} />
                {stats.inactiveUsers}
              </div>
            </span>
            <span style={{ fontWeight: "bold", color: "#111827" }}>
              Total usuarios inactivos
            </span>
          </div>

          <div className="statistics">
            <span style={{ fontSize: "35px", color: "#000000ff" }}>
              <div className="statistics-icon">
                <UsersIcon color="var(--sidebar)" size={35} />
                {stats.totalUsers}
              </div>
            </span>
            <span style={{ fontWeight: "bold", color: "#111827" }}>
              Total usuarios
            </span>
          </div>
        </div>

      </div>
    </Head>
  );
};

export default UserStatsContainer;
