import { useState } from "react";
import Head from "../../components/shared/Head";
import CheckboxList from "../../components/shared/CheckboxList";
import SearchInputContainer from "../shared/SearchInputContainer";

import AddIcon from "../../components/icons/AddIcon";
import Button from "../../components/shared/Button";

const GroupImplementHeadContainer = ({ onAdd, onSearch, onRefresh }) => {
  const [selected, setSelected] = useState("");

  const handleSelect = (type) => {
    const newSelected = selected === type ? "" : type;
    setSelected(newSelected);
    onRefresh?.(newSelected); // refresca al cambiar de tipo
  };

  return (
    <Head title="Grupos de Implementos">

      <div style={{ display: "flex", gap: "1rem" }}>
        {/* Input de búsqueda reutilizable */}
        <SearchInputContainer onSearch={onSearch} selected={selected} />
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
