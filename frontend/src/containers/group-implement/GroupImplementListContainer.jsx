import React, { useEffect, useState} from "react";

import { useLoader } from "../../context/LoaderContext";

import PlusCircleIcon from "../../components/icons/PlusCircleIcon";
import MenuListIcon from "../../components/icons/MenuListIcon";
import EditSquareIcon from "../../components/icons/EditSquareIcon";

import ReusableTable from "../../components/shared/ReusableTable";
import GroupImplementService from "../../services/GroupImplementService";

const GroupImplementListContainer = ({ refresh, onAddImplement, onEdit, onSearch }) => {
  const { showLoader, hideLoader } = useLoader();
  const [groupImplements, setGroupImplements] = useState([]);

    useEffect(() => {
    // Lógica para obtener datos de productos
    const fetch = async () => {
      
      // obtener los datos de la API
      let response;
      showLoader();
      if (onSearch.type === "name") {
        response = await GroupImplementService.getGroupImplementBySearch(onSearch.type, onSearch.value);
      } else if (onSearch.type === "prefix") {
        response = await GroupImplementService.getGroupImplementBySearch(onSearch.type, onSearch.value.toUpperCase());
      } else {
        // No hay filtros -> traer todo
        response = await GroupImplementService.getGroupImplements();
      }

      hideLoader();
      // console.log(response)
      if (response.success) {
        setGroupImplements(response.data);
      } else {
        setGroupImplements([]);
      }
    };

    fetch();
  }, [refresh]);
  
  const handleAddImplementClick = (id) => {
    onAddImplement(id); // notifica al padre
  }

  const handleEditClick = (id) => {
    onEdit(id); // envía el id al padre
  };


  const columnsHead = [
    {header: 'Prefijo', accessor: 'prefix'},
    {header: 'Nombre', accessor: 'name'},
    {header: 'Hora maxima', accessor: 'max_hours'},
    {header: 'Tiempo limite', accessor: 'time_limit'},
    {header: 'Acciones', accessor: 'actions'}
  ];

  const columns = [
    {accessor: 'prefix'},
    {accessor: 'name'},
    {accessor: 'max_hours'},
    {accessor: 'time_limit'},
    {accessor: 'actions'}
  ]
  
  const columnStyles = [
    { width: '20%', overflow: 'hidden' },
    { width: '20%', overflow: 'hidden' },
    { width: '20%', overflow: 'hidden' },
    { width: '20%', overflow: 'hidden' },
    { width: '20%', overflow: 'hidden' },
  ];

    const renderCellContent = (column, groupImplement) => {
    // if (column.accessor === 'isActive') {
    //   return groupImplement.isActive === 1 ? 'Activo' : 'Inactivo';
    // }

    // if(column.accessor === 'SalePrice'){
    //   return formatCOP(groupImplement.SalePrice);
    // }

    if (column.accessor === 'actions') {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', width: '100%', textAlign: 'center', overflow: 'hidden' }}>
          <button className="btn-icon" onClick={() => handleAddImplementClick(groupImplement.id)}>
            <PlusCircleIcon size={24} color="var(--color-tertiary)" className="hover:opacity-80" />
          </button>
          <button className="btn-icon">
            <MenuListIcon size={24} color="var(--color-primary)" className="hover:opacity-80" />
          </button>
          <button className="btn-icon" onClick={() => handleEditClick(groupImplement.id)}>
            <EditSquareIcon size={24} color="var(--color-secondary)" className="hover:opacity-80" />
          </button>
        </div>
      );
    }
    return groupImplement[column.accessor];
  };

  const dataWithActions = groupImplements.map(groupImplement => ({
    ...groupImplement,
    isActive: renderCellContent({ accessor: 'isActive' }, groupImplement), // Sobrescribe la propiedad isActive del groupImplement de la lista
    actions: renderCellContent({ accessor: 'actions' }, groupImplement),
  }));

  return (
    <ReusableTable columnsHead={columnsHead} columns={columns} data={dataWithActions} columnStyles={columnStyles} />
  );
}

export default GroupImplementListContainer