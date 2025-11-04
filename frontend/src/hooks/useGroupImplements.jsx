import { useEffect, useState } from "react";
import GroupImplementService from "../services/GroupImplementService";
import ImplementService from "../services/ImplementService";
import { useLoader } from "../context/LoaderContext";

export function useGroupImplements() {
  const { showLoader, hideLoader } = useLoader();
  const [groupList, setGroupList] = useState([]);
  const [stats, setStats] = useState({
    totalGroups: 0,
    totalImplements: 0,
    implementsByGroup: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchGroups() {
    showLoader();
    setLoading(true);

    try {
      // 1. Traemos todos los grupos
      const response = await GroupImplementService.getGroupImplements();

      if (!response.success) {
        window.showAlert(response.error?.message, "Error");
        hideLoader();
        setLoading(false);
        return;
      }

      const groups = response.data;

      // 2. Obtenemos todos los implementos (para estadísticas)
      const impResponse = await ImplementService.getImplements();
      const implementsList = impResponse.success ? impResponse.data : [];

      // 3. Calculamos estadísticas por grupo
      const implementsByGroup = groups.map(group => {
        const implementsInGroup = implementsList.filter(
          imp => imp.groupImplement?.id === group.id
        );
        return {
          groupId: group.id,
          groupName: group.name,
          total: implementsInGroup.length,
          available: implementsInGroup.filter(i => i.status === "available").length,
          borrowed: implementsInGroup.filter(i => i.status === "borrowed").length,
          maintenance: implementsInGroup.filter(i => i.status === "maintenance").length,
          retired: implementsInGroup.filter(i => i.status === "retired").length,
        };
      });

      setGroupList(groups);
      setStats({
        totalGroups: groups.length,
        totalImplements: implementsList.length,
        implementsByGroup,
      });

    } catch (e) {
      setError("Ocurrió un error inesperado");
    } finally {
      hideLoader();
      setLoading(false);
    }
  }

  // Carga inicial
  useEffect(() => {
    fetchGroups();
  }, []);

  // 🔹 Retorna la función para ser llamada externamente
  return { groupList, stats, loading, error, refresh: fetchGroups };
}
