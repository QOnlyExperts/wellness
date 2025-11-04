import { useState } from "react";

import GroupImplementHeadContainer from "../../containers/group-implement/GroupImplementHeadContainer";
import GroupImplementListContainer from "../../containers/group-implement/GroupImplementListContainer";
import GroupImplementModalContainer from "../../containers/group-implement/GroupImplementModalContainer";
import ImplementModalContainer from "../../containers/implement/ImplementModalContainer";
import GroupStatsContainer from "../../containers/group-implement/GroupStatsContainer";

const GroupImplementPage = () => {
  const [modalType, setModalType] = useState(null); // "group" | "implement" | null
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroupImplementId, setSelectedGroupImplementId] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [selectedSearch, setSelectedSearch] = useState({
    type: null,
    value: null,
  });

  const handleOpenModal = (type, id = null) => {
    setModalType(type);
    setSelectedGroupImplementId(id ?? null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedGroupImplementId(null);
  };

  const handleRefresh = () => {
    setRefreshFlag((prev) => !prev);
    setSelectedSearch({ type: null, value: null });
  };

  const handlerSearch = (selected, search) => {
    if (selected === "name") {
      setSelectedSearch({ type: "name", value: search });
    } else if (selected === "prefix") {
      setSelectedSearch({ type: "prefix", value: search });
    }
    setRefreshFlag((prev) => !prev);
  };

  return (
    <div className="div-principal">
      <GroupImplementHeadContainer
        onSearch={handlerSearch}
        onRefresh={handleRefresh}
        onAdd={() => handleOpenModal("group")}
      />

      {/* Contenedor de estadísticas */}
      <GroupStatsContainer refresh={refreshFlag} />

      {/* Lista de grupos */}
      <GroupImplementListContainer
        refresh={refreshFlag}
        onAddImplement={(id) => handleOpenModal("implement", id)}
        onEdit={(id) => handleOpenModal("group", id)}
        onSearch={selectedSearch}
      />

      {/* Modal de Grupo */}
      {modalType === "group" && isModalOpen && (
        <GroupImplementModalContainer
          groupImplementId={selectedGroupImplementId}
          onClose={handleCloseModal}
          onSaved={handleRefresh}
        />
      )}

      {/* Modal de Implemento */}
      {modalType === "implement" && isModalOpen && (
        <ImplementModalContainer
          groupImplementId={selectedGroupImplementId}
          onClose={handleCloseModal}
          onSaved={handleRefresh}
        />
      )}
    </div>
  );
};

export default GroupImplementPage;
