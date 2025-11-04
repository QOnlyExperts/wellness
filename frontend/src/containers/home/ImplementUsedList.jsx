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

const ImplementUsedList = ({ groupImplementId, onSelectedImplements, onEdit}) => {
  const { showLoader, hideLoader } = useLoader();

  const [implementList, setImplements] = useState([]);
  const [selected, setSelected] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const [refresh, setRefresh] = useState(false);


  useEffect(() => {
    let ignore = false
    // Lógica para obtener datos de productos
    const fetch = async () => {
      
      if (ignore) return;
      
      // obtener los datos de la API
      const response = await ImplementService.getImplements();

      if (!response.success) {
        window.showAlert(response?.message || "Error al obtener los implementos", "error");
        setImplements([]);
        return;
      }
      setImplements(response.data);
      // window.showAlert(response?.message || "Grupo de implementos creado exitosamente", "success");
    };

    fetch();

    return () => {
      ignore = true;
    };

  }, [groupImplementId, refresh]);
  
  const handleAddImplementClick = (id) => {
    onAddImplement(id); // notifica al padre
  }

  const columnsHead = [

    {header: 'Imagen', accessor: 'img'},
    {header: 'Código', accessor: 'cod'},
    {header: 'Estado', accessor: 'status'},
    {header: 'Condición', accessor: 'condition'},
  ];

  const columns = [
    {accessor: 'img'},
    {accessor: 'cod'},
    {accessor: 'status'},
    {accessor: 'condition'},
  ]
  
  const columnStyles = [
    { width: '25%', overflow: 'hidden' },
    { width: '25%', overflow: 'hidden' },
    { width: '25%', overflow: 'hidden' },
    { width: '25%', overflow: 'hidden' },
  ];

  const renderCellContent = (column, implement) => {
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
    return implement[column.accessor];
  };

  const dataWithActions = implementList.map(implement => ({
    ...implement,
    // isActive: renderCellContent({ accessor: 'isActive' }, implement), // Sobrescribe la propiedad isActive del implement de la lista
    img: renderCellContent({ accessor:'img' }, implement),
    status: renderCellContent({ accessor: 'status' }, implement),
    condition: renderCellContent({ accessor: 'condition' }, implement)
  }));

  return (
    <>       
      <ReusableTable columnsHead={columnsHead} columns={columns} data={dataWithActions} columnStyles={columnStyles} />
    </>
  );
}

export default ImplementUsedList;