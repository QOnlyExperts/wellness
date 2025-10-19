import React, { useEffect, useState} from "react";


import ReusableTable from "../../components/shared/ReusableTable";
import GroupImplementService from "../../services/GroupImplementService";

const GroupImplementListContainer = ({ refresh, onEdit }) => {
  const [groupImplements, setGroupImplements] = useState([]);

    useEffect(() => {
    // Lógica para obtener datos de productos
    const fetch = async () => {
      
      const response = await GroupImplementService.getGroupImplements();
      // console.log(response)
      setGroupImplements(response.data);
    };

    fetch();
  }, [refresh]);
  
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
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', gap: '10px', width: '100%', textAlign: 'center', overflow: 'hidden' }}>
          <button className="btn-primary">Agregar</button>
          <button className="btn-primary">Listar</button>
          <button className="btn-primary" onClick={() => handleEditClick(groupImplement.id)}>Editar</button>
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