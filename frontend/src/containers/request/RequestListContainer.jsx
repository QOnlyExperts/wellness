import React, { useEffect, useState } from "react";
// Importaciones simuladas/adaptadas del componente original
import { useLoader } from "../../context/LoaderContext"; // Se mantiene por estructura
// Adaptación: se usa un hook simulado para Requests
import { useRequest } from "../../hooks/useRequest";
import ReusableTable from "../../components/shared/ReusableTable";
import AlertContainer from "../shared/AlertContainer";
import Badge from "../../components/shared/Badge";
import Head from "../../components/shared/Head";
import PlusCircleIcon from "../../components/icons/PlusCircleIcon";
import moment from "moment"; // Importar moment para formatear fechas



const apiUrl = import.meta.env.VITE_API_URL;

// --- Componente Principal Adaptado ---
const RequestListContainer = ({ refresh: refreshFlag }) => {
  const { requestList, loading, error, refresh } = useRequest();
  // Simulamos el uso de useLoader, aunque no se use showLoader/hideLoader directamente
  const { showLoader, hideLoader } = useLoader();

  // No se necesita el estado 'openDropdownId' ni sus efectos, ya que no hay acciones.

  useEffect(() => {
    if (refreshFlag) refresh();
  }, [refreshFlag, refresh]);

  // --- Definición de Columnas y Estilos (Adaptado a las nuevas columnas) ---

  // Columnas solicitadas:
  // Img, identification, nombre, correo institucional, codigo de implemento,
  // nombre del implemento, created_at(Hora de inicio), finished_at(Hora final),
  // limited_at(Hora limite), duration_hours(Hora asignada), Estado de solicitud

  const columnsHead = [
    { header: "Img", accessor: "img" },
    { header: "Identificación", accessor: "identification" },
    { header: "Nombre", accessor: "fullName" },
    { header: "Correo Inst.", accessor: "email" },
    { header: "Cód. Implemento", accessor: "implement_cod" },
    { header: "Nombre Implemento", accessor: "implement_name" },
    { header: "Inicio", accessor: "created_at" },
    { header: "Fin", accessor: "finished_at" },
    { header: "Límite", accessor: "limited_at" },
    { header: "Hora", accessor: "duration_hours" },
    { header: "Estado Solicitud", accessor: "status" },
  ];

  const columns = columnsHead.map((col) => ({ accessor: col.accessor }));

  const columnStyles = [
    { width: "5%", overflow: "hidden" }, // Img
    { width: "10%", overflow: "hidden" }, // Identificación
    { width: "15%", overflow: "hidden" }, // Nombre
    { width: "15%", overflow: "hidden" }, // Correo
    { width: "8%", overflow: "hidden" }, // Cód. Implemento
    { width: "12%", overflow: "hidden" }, // Nombre Implemento
    { width: "7%", overflow: "hidden" }, // Inicio
    { width: "7%", overflow: "hidden" }, // Fin
    { width: "7%", overflow: "hidden" }, // Límite
    { width: "7%", overflow: "hidden" }, // Tiempo Asignado
    { width: "7%", overflow: "hidden" }, // Estado Solicitud
  ];

  // --- Función para Renderizar Contenido de Celda (Adaptada a Request) ---
  const renderCellContent = (column, request) => {
    const infoPerson = request.info_person || {};
    const implement = request.implement || {};
    const groupImplement = implement.groupImplement || {};

    // 1. Img
    if (column.accessor === "img") {
      const imgPath = implement.imgs?.[0]?.description; // Usar el path del JSON
      if (imgPath) {
        // El path en el JSON es "static/...", asumo que necesita una URL base
        // Por ejemplo, "http://tu-servidor.com/static/..."
        const imageUrl = `http://localhost:4000/${imgPath}`.replace("http://localhost:4000", `${apiUrl}:4000`)
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

    // 2. Identification
    if (column.accessor === "identification") {
      return infoPerson.identification || "-";
    }

    // 3. Nombre
    if (column.accessor === "fullName") {
      const { name1, name2, last_name1, last_name2 } = infoPerson;
      return `${name1 || ""} ${name2 || ""} ${last_name1 || ""} ${
        last_name2 || ""
      }`;
    }

    // 4. Correo Institucional (Simulado en los datos de ejemplo)
    if (column.accessor === "email") {
      const email = infoPerson.email || "-";

      // --- LÓGICA DE ACORTAMIENTO DE CORREO ---
      let displayEmail = email;
      const maxLength = 25; // Define el largo máximo visible.

      // Comprobamos si el correo es una cadena válida y si supera el largo.
      if (typeof email === "string" && email.length > maxLength) {
        // Buscamos el índice del '@'
        const atIndex = email.indexOf("@");

        if (atIndex > 0) {
          // Opción 1: Mostrar el inicio y el dominio, ocultando el centro.
          // displayEmail = email.substring(0, 5) + '...' + email.substring(atIndex);

          // Opción 2: Mostrar solo el inicio y truncar.
          displayEmail = email.substring(0, maxLength - 3) + "...";
        } else {
          // Si no tiene '@' o es solo un texto largo, truncar directamente.
          displayEmail = email.substring(0, maxLength - 3) + "...";
        }
      }
      // --- FIN LÓGICA DE ACORTAMIENTO ---

      return <span title={email}>{displayEmail}</span>;
    }

    // 5. Código de Implemento
    if (column.accessor === "implement_cod") {
      return implement.cod || "-";
    }

    // 6. Nombre del Implemento
    if (column.accessor === "implement_name") {
      return groupImplement.name || "-";
    }

    // 7. Hora de Inicio (created_at)
    if (column.accessor === "created_at") {
      // Formatear a hora y fecha legible
      return request.created_at
        ? moment(request.created_at).format("DD/MM HH:mm")
        : "-";
    }

    // 8. Hora Final (finished_at)
    if (column.accessor === "finished_at") {
      return request.finished_at
        ? moment(request.finished_at).format("DD/MM HH:mm")
        : "-";
    }

    // 9. Hora Límite (limited_at)
    if (column.accessor === "limited_at") {
      return request.limited_at
        ? moment(request.limited_at).format("DD/MM HH:mm")
        : "-";
    }

    // 10. Tiempo Asignado (duration_hours)
    if (column.accessor === "duration_hours") {
      // El valor viene en horas, se puede mostrar con la unidad
      return request.duration_hours ? `${request.duration_hours} h` : "-"; // Aquí iría el calculo de horas
    }

    // 11. Estado de Solicitud (status)
    if (column.accessor === "status") {
      // Se puede adaptar a los colores de Badge
      const statusValue = request.status || "unknown";

      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0",
          }}
        >
          <Badge value={statusValue} />
        </div>
      );
    }

    // Fallback
    return request[column.accessor];
  };

  // Preparar los datos con las celdas renderizadas para la tabla
  const dataWithRenderedCells = requestList.map((request) => {
    // Mapear todas las columnas definidas en columnsHead
    const row = {};
    columnsHead.forEach((col) => {
      row[col.accessor] = renderCellContent(col, request);
    });
    return { ...request, ...row };
  });

  // Renderizar un indicador de carga si es necesario
  if (loading) {
    return <div>Cargando solicitudes...</div>;
  }

  if (error) {
    return <div>Error al cargar solicitudes: {error}</div>;
  }

  return (
    <>
      <AlertContainer />
      <ReusableTable
        columnsHead={columnsHead}
        columns={columns}
        data={dataWithRenderedCells}
        columnStyles={columnStyles}
      />
    </>
  );
};

export default RequestListContainer;
