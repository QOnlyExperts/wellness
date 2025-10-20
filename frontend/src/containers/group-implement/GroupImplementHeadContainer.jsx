import { useState } from "react";
import Head from "../../components/shared/Head";
import InputField from "../../components/shared/InputField";
import CheckboxList from "../../components/shared/CheckboxList";

const GroupImplementHeadContainer = ({ onAdd, onSearch, onRefresh }) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSelect = (type) => {
    // Cambiar el checkbox activo
    const newSelected = selected === type ? "" : type;
    setSelected(newSelected);

    // Ejecutar refresh cada vez que cambia la selección
    onRefresh?.(newSelected);
  };

  const handleSearch = () => {
    // Si no hay ningún tipo de búsqueda seleccionado, no hace nada
    if (!selected) {
      console.warn("Debes seleccionar un tipo de búsqueda (Nombre o Prefijo)");
      return;
    }

    // Ejecuta la búsqueda pasando ambos valores
    onSearch(selected, search);
  };

  return (
    <Head title="Grupos de Implementos">
      <button className="btn-primary" onClick={onAdd}>
        Añadir
      </button>

      <InputField
        type="search"
        placeholder="Buscar grupo..."
        value={search}
        onChange={handleChange}
      />

      <button className="btn-primary" onClick={handleSearch}>
        Buscar
      </button>

      {/* Checkbox: solo uno activo */}
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
    </Head>
  );
};

export default GroupImplementHeadContainer;
