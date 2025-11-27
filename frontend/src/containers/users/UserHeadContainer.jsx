import { useState } from "react";
import Head from "../../components/shared/Head";
import CheckboxList from "../../components/shared/CheckboxList";
import SearchInputContainer from "../shared/SearchInputContainer";

import AddIcon from "../../components/icons/AddIcon";
import Button from "../../components/shared/Button";
import DeleteIcon from "../../components/icons/DeleteIcon";

const UserHeadContainer = ({ onAdd, onSearch, onRefresh }) => {
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
      title="Usuarios"
      subTitle="Gestión y control de usuarios registrados"
    >

      <div className="head-filters">
        {/* Input de búsqueda reutilizable */}
        {
          selected !== "" &&
            <SearchInputContainer onSearch={onSearch} selected={selected} />
        }
        {/* Checkboxes controlados */}
        <CheckboxList
          title="Identificación"
          name="searchByIdentification"
          checked={selected === "identification"}
          onChange={() => handleSelect("identification")}
        />

        <CheckboxList
          title="Correo"
          name="searchByEmail"
          checked={selected === "email"}
          onChange={() => handleSelect("email")}
        />
        {
          selected !== "" &&
            <Button text="Limpiar" className="btn-icon" onClick={clearFilters}>
              <DeleteIcon />
            </Button>
        }
      </div>

    </Head>
  );
};

export default UserHeadContainer;
