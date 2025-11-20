import { useState } from "react";
import Head from "../../components/shared/Head";
import CheckboxList from "../../components/shared/CheckboxList";
import SearchInputContainer from "../shared/SearchInputContainer";

import AddIcon from "../../components/icons/AddIcon";
import Button from "../../components/shared/Button";
import DeleteIcon from "../../components/icons/DeleteIcon";

const GroupImplementHeadContainer = ({ onAdd, onSearch, onRefresh }) => {
  const [selected, setSelected] = useState("");

  const handleSelect = (type) => {
    const newSelected = selected === type ? "" : type;
    setSelected(newSelected);
    if(newSelected === ""){
      onRefresh?.(newSelected); // refresca al cambiar de tipo
    }
  };

  const clearFilters = () => {
    const newSelected = "";
    setSelected(newSelected);
    onRefresh?.(newSelected);
  }

  return (
    <Head 
      title="Grupos de Implementos"
      subTitle="Gestión y control de implementos registrados"
    >

      <div style={{ display: "flex", alignItems: 'center', gap: "1rem" }}>
        {/* Input de búsqueda reutilizable */}
        {
          selected !== "" &&
            <SearchInputContainer onSearch={onSearch} selected={selected} />
        }
        {/* Checkboxes controlados */}
        <CheckboxList
          title="Prefijo"
          name="searchByPrefix"
          checked={selected === "prefix"}
          onChange={() => handleSelect("prefix")}
        />

        <CheckboxList
          title="Nombre"
          name="searchByName"
          checked={selected === "name"}
          onChange={() => handleSelect("name")}
        />
        {
          selected !== "" &&
            <Button text="Limpiar" className="btn-icon" onClick={clearFilters}>
              <DeleteIcon />
            </Button>
        }
      </div>

      <Button text="Añadir grupo" className="btn-primary" onClick={onAdd}>
        <AddIcon
          color="#ffffff"
        />
      </Button>
    </Head>
  );
};

export default GroupImplementHeadContainer;
