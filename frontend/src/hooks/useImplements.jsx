import { useEffect, useState } from "react";
import ImplementService from "../services/ImplementService";


import { useLoader } from "../context/LoaderContext";

export function useImplements(status) {
  const [implementList, setImplementList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [implementCategory, setImplementCategory] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    const fetchImplements = async () => {
      if (!status) return;

      showLoader();
      setIsLoading(true);

      try {
        const statusOptions = [
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
            // Contar implementos por estado
            const countStatus = statusOptions.reduce((acc, status) => {
              const found = response.data.filter((imp) => imp.status === status);
              if (found.length > 0) {
                acc.push({ status, amount: found.length });
              }
              return acc;
            }, []);

            // Agrupar implementos por categoría
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
          response = await ImplementService.getImplementsByStatus(status);
        }

        if (!response.success) {
          setError(response?.error?.message || "Error al obtener los implementos");
          return;
        }

        setImplementList(response.data);
      } catch (err) {
        // console.error(err);
        setError("Ocurrió un error inesperado");
      } finally {
        hideLoader();
        setIsLoading(false);
      }
    };

    fetchImplements();
  }, [status]);

  return { implementList, statusList, implementCategory, isLoading, error };
}
