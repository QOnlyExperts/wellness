import { useState } from "react";
import Head from "../../components/shared/Head";
import InputField from "../../components/shared/InputField";

const GroupImplementHeadContainer = ({ onAdd }) => {
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  return (
    <Head title="Grupos de Implementos">
      <button className="btn-primary" onClick={onAdd}>Añadir</button>
      <InputField
        type="search"
        placeholder="Buscar grupo..."
        value={search}
        onChange={handleChange}
      />
      <button className="btn-primary">Buscar</button>
    </Head>
  );
};

export default GroupImplementHeadContainer;
