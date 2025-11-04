import { useState } from "react";
import SelectField from "../../components/shared/SelectField";

const ImplementSelectFieldContainer = ({onStatus, onCondition, errors}) => {
  const [status, setStatus] = useState("Seleccionar...");
  const [condition, setCondition] = useState("new");

  const optionsStatus = [
    { value: "select", label: "Seleccionar..." },
    { value: "available", label: "Disponible" },
    // { value: "borrowed", label: "Prestado" },
    { value: "maintenance", label: "En mantenimiento" },
    { value: "retired", label: "Retirado" },
  ];

  const optionsCondition = [
    { value: "new", label: "Nuevo" },
  ];

  const handleStatus = (e) => {
    const select = e.target
    if(select.value === 'select'){
      return;
    }
    setStatus(select.value);
    onStatus(e);
  }

  const handleCondition = (e) => {
    setCondition(e.target.value);
    onCondition(e);
  }


  return (
    <div style={{ 
        padding: "",
        display: "flex",
        flexDirection: "column",
        width: '100%',
        gap: "10px",
      }}>
      <SelectField
        label="Estado"
        name="status"
        value={status || "Seleccionar..."}
        options={optionsStatus}
        onChange={(e) => handleStatus(e)}
        errors={errors}
      />

      {/* <SelectField
        label="Condición"
        name="condition"
        value={condition || "new"}
        options={optionsCondition}
        onChange={(e) => handleCondition(e)}
        errors={errors}
      /> */}
    </div>
  );
};

export default ImplementSelectFieldContainer;
