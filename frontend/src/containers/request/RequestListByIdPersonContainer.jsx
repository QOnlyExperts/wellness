import React, { useEffect, useState } from "react";
// Importaciones simuladas/adaptadas del componente original
import { useLoader } from "../../context/LoaderContext";
import ReusableTable from "../../components/shared/ReusableTable";
import AlertContainer from "../shared/AlertContainer";
import Head from "../../components/shared/Head";
import moment from "moment"; // Importar moment para formatear fechas
import RequestService from "../../services/RequestService";

// --- Componente Principal Adaptado ---
const RequestListByIdPersonContainer = ({
  infoPersonId,
  refresh: refreshFlag,
}) => {
  // Simulamos el uso de useLoader
  const { showLoader, hideLoader } = useLoader();
  const [requestList, setRequestList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para cargar las solicitudes
  const fetchRequests = async () => {
    if (!infoPersonId || isNaN(Number(infoPersonId))) return;

    setIsLoading(true);
    setError(null);
    showLoader();

    try {
      const response = await RequestService.getRequestsByIdPerson(infoPersonId);

      if (!response.success) {
        window.showAlert(
          response?.error?.message || "Error al obtener las solicitudes",
          "Error"
        );
        setError(
          response?.error?.message || "Error al obtener las solicitudes"
        );
        setRequestList([]);
        return;
      }

      // Corregido: Usar setRequestList y la propiedad 'data' del JSON
      setRequestList(response.data);
    } catch (err) {
      setError(err.message || "Ocurrió un error inesperado.");
      window.showAlert(err.message || "Error de red", "Error");
    } finally {
      setIsLoading(false);
      hideLoader();
    }
  };

  useEffect(() => {
    // Solo se llama a fetchRequests si el flag de refresco cambia o si el componente se monta por primera vez
    fetchRequests();
    // Si no incluyes fetchRequests, asegúrate de que esté envuelto en useCallback si lo usas en el futuro.
  }, [refreshFlag, infoPersonId]);

  // --- Definición de Columnas Solicitadas ---

  const columnsHead = [
    { header: "Imagen", accessor: "img" },
    { header: "Cód.", accessor: "implement_cod" },
    { header: "Implemento", accessor: "implement_name" },
    { header: "Inicio", accessor: "created_at" },
    { header: "Fin", accessor: "finished_at" },
    { header: "Límite", accessor: "limited_at" },
    { header: "Tiempo Asignado", accessor: "duration_hours" },
  ];

  // Usar los accessors para el mapeo interno de la tabla
  const columns = columnsHead.map((col) => ({ accessor: col.accessor }));

  const columnStyles = [
    { width: "10%", overflow: "hidden" }, // Img
    { width: "12%", overflow: "hidden" }, // Cód. Implemento
    { width: "20%", overflow: "hidden" }, // Nombre Implemento
    { width: "14%", overflow: "hidden" }, // Inicio
    { width: "14%", overflow: "hidden" }, // Fin
    { width: "14%", overflow: "hidden" }, // Límite
    { width: "16%", overflow: "hidden" }, // Tiempo Asignado
  ];

  // --- Función para Renderizar Contenido de Celda (Adaptada) ---
  const renderCellContent = (column, request) => {
    const implement = request.implement || {};
    const groupImplement = implement.groupImplement || {};

    switch (column.accessor) {
      case "img": {
        const imgPath = implement.imgs?.[0]?.description;
        if (imgPath) {
          const imageUrl = `http://localhost:4000/${imgPath}`; // Reemplaza con tu URL base real
          return (
            <img
              src={imageUrl}
              alt="Implemento"
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "placeholder-url-por-defecto";
              }}
            />
          );
        }
        return <span title="Sin imagen">[MotImg]</span>;
      }

      case "implement_cod":
        return implement.cod || "-";

      case "implement_name":
        return groupImplement.name || "-";

      case "created_at":
        return request.created_at
          ? moment(request.created_at).format("DD/MM/YYYY HH:mm")
          : "-";

      case "finished_at":
        return request.finished_at
          ? moment(request.finished_at).format("DD/MM/YYYY HH:mm")
          : "-";

      case "limited_at":
        return request.limited_at
          ? moment(request.limited_at).format("DD/MM/YYYY HH:mm")
          : "-";

      case "duration_hours":
        // El valor viene como string "0.00", lo mostramos con la unidad
        return request.duration_hours ? `${request.duration_hours} h` : "-";

      default:
        return request[column.accessor];
    }
  };

  // Preparar los datos con las celdas renderizadas para la tabla
  const dataWithRenderedCells = requestList.map((request) => {
    const row = {};
    columnsHead.forEach((col) => {
      // Los datos a renderizar están en la propiedad con el mismo nombre que el accessor
      row[col.accessor] = renderCellContent(col, request);
    });
    return { ...request, ...row };
  });

  // Renderizar un indicador de carga
  if (isLoading) {
    return <div>Cargando solicitudes...</div>;
  }

  if (error) {
    return <div>Error al cargar solicitudes: {error}</div>;
  }

  if (requestList.length === 0) {
    return <div>No se encontraron solicitudes.</div>;
  }

  return (
    <>
      <ReusableTable
        columnsHead={columnsHead}
        columns={columns}
        data={dataWithRenderedCells}
        columnStyles={columnStyles}
      />
    </>
  );
};

export default RequestListByIdPersonContainer;
