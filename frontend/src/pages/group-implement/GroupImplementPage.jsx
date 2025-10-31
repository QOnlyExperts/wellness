import { useState } from "react";

import GroupImplementHeadContainer from "../../containers/group-implement/GroupImplementHeadContainer";
import GroupImplementListContainer from "../../containers/group-implement/GroupImplementListContainer";
import GroupImplementModalContainer from "../../containers/group-implement/GroupImplementModalContainer";

import ImplementModalContainer from "../../containers/implement/ImplementModalContainer";


const GroupImplementPage = () => {
  
  const [modalType, setModalType] = useState(null); // "group" | "implement" | null
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroupImplementId, setSelectedGroupImplementId] = useState(null); // nuevo estado
  const [refreshFlag, setRefreshFlag] = useState(false); // Refresca la lista si el modal guarda cambios

  const [selectedSearch, setSelectedSearch] = useState({
    type: null,
    value: null
  });

  const handleOpenModal = (type, id = null) => {

    setModalType(type);
    setSelectedGroupImplementId(id ?? null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setModalType(null);
    setSelectedGroupImplementId(null);
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

    setRefreshFlag((prev) => !prev); // Refresca la lista con los nuevos filtros
  }

  return(
    <div className='div-principal'>
      <GroupImplementHeadContainer
        onSearch={handlerSearch}
        onRefresh={handleRefresh}
        onAdd={(id) => handleOpenModal("group")} 
      />

      {/* Maneja la lógica solo de grupos de implementos */}
      <GroupImplementListContainer 
        refresh={refreshFlag}
        onAddImplement={(id) => handleOpenModal("implement", id)}
        onEdit={(id) => handleOpenModal("group", id)}
        onSearch={selectedSearch}
      />
      
      {/* Modal de Grupo */}
      {modalType === "group" && (
        <GroupImplementModalContainer
          groupImplementId={selectedGroupImplementId}
          onClose={handleCloseModal}
          onSaved={handleRefresh}
        />
      )}

      {/* Modal de Implemento */}
      {modalType === "implement" && (
        <ImplementModalContainer
          groupImplementId={selectedGroupImplementId}
          onClose={handleCloseModal}
          onSaved={handleRefresh}
        />
      )}
    </div>
  )
}

export default GroupImplementPage;