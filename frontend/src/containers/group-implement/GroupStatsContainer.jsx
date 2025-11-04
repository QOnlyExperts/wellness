import { useEffect } from "react";
import DashboardChartsGroupImplements from "../../components/group-implement/dashboardChartsGroupImplements";
import GroupImplementIcon from "../../components/icons/GroupImplementIcon";
import ImplementIcon from "../../components/icons/ImplementIcon";
import DashboardChartsImplements from "../../components/implement/DashboardChartsImplements";
import Head from "../../components/shared/Head";
import { useGroupImplements } from "../../hooks/useGroupImplements";
import { useImplements } from "../../hooks/useImplements";

const GroupStatsContainer = ({ refresh: refreshFlag }) => {
  const { stats, loading, error, refresh } = useGroupImplements();
  const { implementCategory } = useImplements("all");

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
                <GroupImplementIcon color="var(--sidebar)" size={35} />
                {stats.totalGroups}
              </div>
            </span>
            <span style={{ fontWeight: "bold", color: "#111827" }}>
              Total grupos
            </span>
          </div>

          <div className="statistics">
            <span style={{ fontSize: "35px", color: "#000000ff" }}>
              <div className="statistics-icon">
                <ImplementIcon color="var(--sidebar)" size={35} />
                {stats.totalImplements}
              </div>
            </span>
            <span style={{ fontWeight: "bold", color: "#111827" }}>
              Total implementos
            </span>
          </div>
        </div>

        <div className="content-statistics">
          <DashboardChartsGroupImplements implementCategory={implementCategory} />
        </div>
      </div>
    </Head>
  );
};

export default GroupStatsContainer;
