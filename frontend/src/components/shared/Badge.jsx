
import React from "react";
import "./Badge.css"; // Asegúrate de agregar este archivo CSS
import { translateStatus } from "../../utils/formatStatus";

const Badge = ({ style, label, value}) => {
  
  const spanish = translateStatus(value);

  const color = (value) => {
    switch (value) {
      case "all":
        return "Todos";
      // Estados de implementos
      case "available":
        return "available";
      case "maintenance":
        return "maintenance";
      case "retired":
        return "retired";
      case "borrowed":
        return "borrowed";
      case "is_verified":
        return "available";
      case "no_verified":
        return "borrowed";
        
      case "inactive":
        return "inactive";
      case "active":
        return "active";
        
      case "requested":
        return "all";
      case "accepted":
        return "available";
      case "refused":
        return "borrowed"
      case "finished":
        return "retired";


      // Condiciones de implementos
      case "new":
        return "all";

      default:
        return "default";
    }
  }

  return (
    <span
      style={{
        ...style,
        backgroundColor: `var(--color-${color(value)})`,
      }}
      className="badge"
    >
      {spanish}
    </span>
  );
};

export default Badge;
