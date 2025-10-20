import { useState } from "react";

import GroupImplementHeadContainer from "../../containers/group-implement/GroupImplementHeadContainer";
import GroupImplementListContainer from "../../containers/group-implement/GroupImplementListContainer";
import GroupImplementModalContainer from "../../containers/group-implement/GroupImplementModalContainer";

const GroupImplementPage = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null); // 👈 nuevo estado
  const [refreshFlag, setRefreshFlag] = useState(false); // Refresca la lista si el modal guarda cambios

  const [selectedSearch, setSelectedSearch] = useState({
    type: null,
    value: null
  });

  const handleOpenModal = (id = null) => {
    if (id) setSelectedId(id); // guarda el id si se pasa
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedId(null); // limpia al cerrar
  };

  const handleRefresh = () => {
    setRefreshFlag((prev) => !prev);

    setSelectedSearch({ type: null, value: null });
  }

  const handlerSearch = (selected, search) => {
    // Actualiza los estados de búsqueda según el tipo seleccionado
    if (selected === "name") {
      setSelectedSearch({ type: "name", value: search });
    } else if (selected === "prefix") {
      setSelectedSearch({ type: "prefix", value: search });
    }

    // Al buscar, asegurarse de refrescar la lista
    setRefreshFlag((prev) => !prev);
  }

  return(
    <div className='div-principal'>
      <GroupImplementHeadContainer
        onSearch={handlerSearch}
        onRefresh={handleRefresh}
        onAdd={handleOpenModal} 
      />
      <GroupImplementListContainer 
        refresh={refreshFlag}
        onEdit={handleOpenModal}
        onSearch={selectedSearch}
      />
      
      {isModalOpen && (
        <GroupImplementModalContainer
          id={selectedId}
          onClose={handleCloseModal} 
          onSaved={handleRefresh}
        />
      )}
    </div>
  )
}

export default GroupImplementPage;