import { useState } from "react";
import SelectField from "../../components/shared/SelectField";

const ImplementSelectFieldContainer = () => {
  const [status, setStatus] = useState("available");
  const [condition, setCondition] = useState("new");

  const optionsStatus = [
    { value: "available", label: "Disponible" },
    // { value: "borrowed", label: "Prestado" },
    { value: "maintenance", label: "En mantenimiento" },
    { value: "retired", label: "Retirado" },
  ];

  const optionsCondition = [
    { value: "new", label: "Nuevo" },
  ];

  return (
    <div style={{ 
        padding: "",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}>
      <SelectField
        label="Estado"
        name="estado"
        value={status}
        options={optionsStatus}
        onChange={setStatus}
      />

      <SelectField
        label="Estado"
        name="estado"
        value={status}
        options={optionsCondition}
        onChange={setStatus}
      />
    </div>
  );
};

export default ImplementSelectFieldContainer;
