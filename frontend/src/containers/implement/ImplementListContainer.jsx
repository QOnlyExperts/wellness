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
import ImplementSelectFieldContainer from "./ImplementSelecFieldContainer";

const ImplementListContainer = ({ groupImplementId, onSelectedImplements, onEdit}) => {
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

      if(!groupImplementId || isNaN(Number(groupImplementId))){
        window.showAlert(response?.message || "Debe seleccionar un grupo de implementos", "error");
        return
      }
      
      // obtener los datos de la API
      const response = await ImplementService.getImplementsByIdGroup(groupImplementId);

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

  const handleEditClick = (id) => {
    onEdit(id); // envía el id al padre
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];

      // Notificar al padre si existe la prop
      if (onSelectedImplements) {
        onSelectedImplements(updated);
      }

      if(updated.length > 0){
        setSelected(true);
      }else{
        setSelected(false);
      }

      return updated;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === implementList.length) {
      // Si todos están seleccionados, desmarcar todos
      setSelectedIds([]);
      setSelected(false);
    } else {
      // Si no, seleccionar todos los IDs visibles
      const allIds = implementList.map((imp) => {if(imp.status !== "borrowed" && imp.status !== "retired")  return imp.id});
      setSelectedIds(allIds);
      setSelected(true);
    }
  };

  const handleStatus = async (e) => {

    if (!groupImplementId || isNaN(Number(groupImplementId))) {
      window.showAlert(
        response?.message || "Debe seleccionar un grupo de implementos",
        "error"
      );
      return;
    }

    if (selectedIds.length <= 0) {
      window.showAlert("Debe selecciona al menos 1 implemento", "error");
      return;
    }

    const newStatus = {};

    newStatus.updates = selectedIds.map((i) => ({
      id: i,
      status: e.target.value,
    }));

    const response = await ImplementService.updateManyImplements(newStatus);
    if (!response.success) {
      window.showAlert(
        response.error.message || "Error al actualizar los estados",
        "error"
      );
      return;
    }

    window.showAlert(
      response.message || "Estados actualizados exitosamente",
      "success"
    );

    setSelected(false);
    setSelectedIds([]);

    // En base a la lista prev
    setImplements((prev) =>
      // La recorremos
      prev.map((imp) => {
        // Luego comparamos el id de la lista actualizada con el id de la lista actual
        const update = response.data.find((u) => u.id === imp.id);
        // Si hay un implemento actualizado, retornamos
        return update ? { ...imp, status: update.status } : imp;
      })
    );
  };
  
  const columnsHead = [
    {
      header: (
        <CheckboxList
          title="Todo"
          checked={selectedIds.length === implementList.length && implementList.length > 0}
          onChange={toggleSelectAll}
        />
      ),
      accessor: 'select'
    },
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
            disabled={implement.status === "borrowed" ? true : implement.status === "retired" ? true : false}
            checked={selectedIds.includes(implement.id)}
            onChange={() => toggleSelect(implement.id)}
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
      {
        selected && 
        <>
          <ImplementSelectFieldContainer
            onStatus={(e) => handleStatus(e)}
          />
          <h5 className="sub-title">Los implementos prestados y retirados no pueden cambiar su estado</h5>
        </>

      }          
      <ReusableTable columnsHead={columnsHead} columns={columns} data={dataWithActions} columnStyles={columnStyles} />
    </>
  );
}

export default ImplementListContainer