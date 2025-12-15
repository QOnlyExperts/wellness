import React, { useState } from "react";
import InputField from "../../components/shared/InputField";
import SearchInput from "../../components/shared/SearchInput";

const SearchInputContainer = ({ onSearch, selected }) => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!selected) {
        console.warn("Debes seleccionar un tipo de búsqueda (Nombre o Prefijo)");
        return;
      }
      onSearch(selected, value);
    }
  };

  return (
    <SearchInput
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={selected ? false : true}
    />
  );
};

export default SearchInputContainer;
