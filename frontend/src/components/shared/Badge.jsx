
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
        return "error";

      // Condiciones de implementos
      case "new":
        return "info";

      default:
        return "default";
    }
  };

  const type = getTypeFromValue(value);

  return (
    <span className={`badge badge-${type}`}>
      {label}
    </span>
  );
};

export default Badge;
