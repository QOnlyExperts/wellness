import React, { useEffect, useState} from "react";

import { useLoader } from "../../context/LoaderContext";

import PlusCircleIcon from "../../components/icons/PlusCircleIcon";
import MenuListIcon from "../../components/icons/MenuListIcon";
import EditSquareIcon from "../../components/icons/EditSquareIcon";

import ReusableTable from "../../components/shared/ReusableTable";
import ImplementService from "../../services/ImplementService";
import AlertContainer from "../shared/AlertContainer";
import Badge from "../../components/shared/Badge";
import SelectField from "../../components/shared/SelectField";
import CheckboxList from "../../components/shared/CheckboxList";


import NotFoundImage from "../../assets/img/NoImg.svg";

const ImplementListContainer = ({ refresh, groupImplementId, onEdit}) => {
  const { showLoader, hideLoader } = useLoader();

  const [implementList, setImplements] = useState([]);

  useEffect(() => {
    let ignore = false
    // Lógica para obtener datos de productos
    const fetch = async () => {
      
      if (ignore) return;

      let response;
      // obtener los datos de la API
      if(groupImplementId && !isNaN(Number(groupImplementId))){
        response = await ImplementService.getImplementsByIdGroup(groupImplementId);
      }

      if (!response.success) {
        window.showAlert(response?.message || "Error al obtener los implementos", "error");
        setImplements([]);
        return;
      }
      setImplements(response.data);
      window.showAlert(response?.message || "Grupo de implementos creado exitosamente", "success");
      console.log(1)
    };

    fetch();

    return () => {
      ignore = true;
    };

  }, []);
  
  const handleAddImplementClick = (id) => {
    onAddImplement(id); // notifica al padre
  }

  const handleEditClick = (id) => {
    onEdit(id); // envía el id al padre
  };


  const columnsHead = [
    {header: 'Selección', accessor: 'select'},
    {header: 'Imagen', accessor: 'img'},
    {header: 'Código', accessor: 'cod'},
    {header: 'Estado', accessor: 'status'},
    {header: 'Condición', accessor: 'condition'},
    {header: 'Acciones', accessor: 'actions'}
  ];

  const columns = [
    {accessor: 'select'},
    {accessor: 'img'},
    {accessor: 'cod'},
    {accessor: 'status'},
    {accessor: 'condition'},
    {accessor: 'actions'}
  ]
  
  const columnStyles = [
    { width: '15%', overflow: 'hidden' },
    { width: '15%', overflow: 'hidden' },
    { width: '20%', overflow: 'hidden' },
    { width: '20%', overflow: 'hidden' },
    { width: '15%', overflow: 'hidden' },
    { width: '15%', overflow: 'hidden' },
  ];

  const renderCellContent = (column, implement) => {

    if(column.accessor === 'select'){
      return(
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CheckboxList
            checked='false'
          />
        </div>
      )
    }

    if(column.accessor === 'img'){
      return (
        <div
          style={{
            width: "40px",
            height: "40px",
          }}
        >
          <img
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
            }}
            src={
              implement.imgs.length > 0
                ? `http://localhost:4000/${ implement.imgs[0].description}`
                : NotFoundImage
            }
          />
        </div>
      );
    }

    if(column.accessor === 'status'){
      return(
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '0'
          }}
        >
          <Badge
            label={implement.status}
            value={implement.status}
          />
        </div>
      );
    }

    if(column.accessor === 'condition'){
      return(
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '0'
          }}
        >
          <Badge
            label={implement.condition}
            value={implement.condition}
          />
        </div>
      );
    }

    if (column.accessor === 'actions') {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', width: '100%', textAlign: 'center', overflow: 'hidden' }}>
          <button className="btn-icon" onClick={() => handleAddImplementClick(groupImplementId.id)}>
            <EditSquareIcon size={24} color="var(--color-secondary)" className="hover:opacity-80" />
          </button>
        </div>
      );
    }
    return implement[column.accessor];
  };

  const dataWithActions = implementList.map(implement => ({
    ...implement,
    // isActive: renderCellContent({ accessor: 'isActive' }, implement), // Sobrescribe la propiedad isActive del implement de la lista
    select: renderCellContent({ accessor: 'select' }, implement),
    img: renderCellContent({ accessor:'img' }, implement),
    status: renderCellContent({ accessor: 'status' }, implement),
    condition: renderCellContent({ accessor: 'condition' }, implement),
    actions: renderCellContent({ accessor: 'actions' }, implement),
  }));

  return (
    <>
      <AlertContainer/>
      <ReusableTable columnsHead={columnsHead} columns={columns} data={dataWithActions} columnStyles={columnStyles} />
    </>
  );
}

export default ImplementListContainer