import { useState } from "react";

import GroupImplementHeadContainer from "../../containers/group-implement/GroupImplementHeadContainer";
import GroupImplementListContainer from "../../containers/group-implement/GroupImplementListContainer";
import GroupImplementModalContainer from "../../containers/group-implement/GroupImplementModalContainer";

const GroupImplementPage = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null); // 👈 nuevo estado
  const [refreshFlag, setRefreshFlag] = useState(false); // Refresca la lista si el modal guarda cambios

  const handleOpenModal = (id = null) => {
    if (id) setSelectedId(id); // guarda el id si se pasa
    console.log(id);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedId(null); // limpia al cerrar
  };

  const handleSaved = () => {
    setRefreshFlag((prev) => !prev);
  }

  return(
    <div className='div-principal'>
      <GroupImplementHeadContainer onAdd={handleOpenModal} />
      <GroupImplementListContainer 
        refresh={refreshFlag}
        onEdit={handleOpenModal}
      />
      
      {isModalOpen && (
        <GroupImplementModalContainer
          onClose={handleCloseModal} 
          onSaved={handleSaved} // 👈 nueva prop
        />
      )}
    </div>
  )
}

export default GroupImplementPage;