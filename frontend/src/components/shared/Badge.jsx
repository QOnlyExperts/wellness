
import React from "react";
import "./Badge.css"; // Asegúrate de agregar este archivo CSS
import { translateStatus } from "../../utils/formatStatus";

const Badge = ({ style, label, value}) => {
  
  const spanish = translateStatus(value);

  return (
    <span
      style={{
        ...style,
        backgroundColor: `var(--color-${value})`,
      }}
      className="badge"
    >
      {spanish}
    </span>
  );
};

export default Badge;
