
import React from "react";
import "./Badge.css"; // Asegúrate de agregar este archivo CSS

const Badge = ({ label, value}) => {
  
  const getTypeFromValue = (value) => {
    switch (value) {
      // Estados de implementos
      case "available":
        return "success";
      case "maintenance":
        return "warning";
      case "retired":
        return "default";
      case "borrowed":
        return "error";

      // Condiciones de implementos
      case "new":
        return "info";

      default:
        return "default";
    }
  };

  const translateSpanish = (value) => {
    switch (value) {
      // Estados de implementos
      case "available":
        return "Disponible";
      case "maintenance":
        return "Mantenimiento";
      case "retired":
        return "Retirado";
      case "borrowed":
        return "Prestado";

      // Condiciones de implementos
      case "new":
        return "Nuevo";

      default:
        return "default";
    }
  };

  const type = getTypeFromValue(value);
  const spanish = translateSpanish(value);

  return (
    <span className={`badge badge-${type}`}>
      {spanish}
    </span>
  );
};

export default Badge;
