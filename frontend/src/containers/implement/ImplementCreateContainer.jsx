import React, { useEffect, useState, useRef } from "react";

import { useLoader } from "../../context/LoaderContext";

import AlertContainer from "../shared/AlertContainer";
import Modal from "../../components/shared/Modal";
import GroupImplementService from "../../services/GroupImplementService";
import ImplementService from "../../services/ImplementService";
import InputField from "../../components/shared/InputField";

import {hasNoXSSAndInjectionSql, isValidEmail, isValidPhone, onlyLettersRegex} from '../../utils/validations';
import ImplementSelectFieldContainer from "./ImplementSelecFieldContainer";
import Card from "../../components/shared/Card";

import NotFoundImage from "../../assets/img/NoImg.svg";
import CloudUp from "../../components/icons/CloudUpIcon";
import SaveIcon from "../../components/icons/SaveIcon";
import Button from "../../components/shared/Button";
import CancelIcon from "../../components/icons/CancelIcon";
import Badge from "../../components/shared/Badge";


const ImplementCreateContainer = ({ groupImplementId, implementId, onClose, onSaved }) => {
  const { showLoader, hideLoader } = useLoader();

  const [isLoading, setIsLoading] = useState(false);
  // const [messageError, setMessageError] = useState("");
  const [errors, setErrors] = useState([]);
  const [formImplement, setFormImplement] = useState({
    prefix: null,
    status: "Seleccionar...",
    condition: "new",
    group_implement_id: null,
    categories_id: null,
    name: null,
    amount: null,
    imgs: []
  });
  
    const [userId, setUserId] = useState(() => {
      // 1. Obtener el ítem (puede ser null)
      const dataJson = sessionStorage.getItem("data");
  
      // 2. Si no hay datos, retorna null o un valor por defecto (ej. 0 o -1)
      if (!dataJson) {
        return null;
      }
  
      // 3. Parsear el JSON. Usamos try/catch si el JSON puede estar malformado.
      try {
        const data = JSON.parse(dataJson);
        // 4. Devolver la propiedad, si existe
        return data.user.id || null;
      } catch (e) {
        // En caso de que el JSON no sea válido
        console.error("Error parsing data from session storage:", e);
        return null;
      }
    });
  
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const [formGroupImplement, setFormGroupImplement] = useState({
    nameGroup: "",
    prefix: "",
  });

  useEffect(() => {
    if (!groupImplementId || isNaN(Number(groupImplementId))) return;

    const fetchData = async () => {
      try {
        // showLoader();

        const [groupResponse, implementResponse] = await Promise.all([
          GroupImplementService.getGroupImplementById(groupImplementId),
          GroupImplementService.getGroupImplementById(groupImplementId),
        ]);

        if(groupImplementId && !isNaN(Number(groupImplementId))){

          setFormGroupImplement({
            nameGroup: String(groupResponse.data.name),
            prefix: String(groupResponse.data.prefix),
          });
  
          setFormImplement(prev => ({
            ...prev,
            prefix: String(groupResponse.data.prefix),
            group_implement_id: groupImplementId,
            categories_id: 1
          }));
        }

      } catch (error) {
        console.error("Error cargando datos del grupo o implemento:", error);
      } finally {
        // hideLoader();
      }
    };

    fetchData();
  }, [groupImplementId]);


  const handleClickFile = () => {
    fileInputRef.current.click(); // Abre el diálogo manualmente
  };

  const handleChange = (e) => {
    setFormImplement({ ...formImplement, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    // Guardar los archivos reales en el form (por si luego los envías a la API)
    setFormImplement((prev) => ({
      ...prev,
      imgs: [...files],
    }));

    const newImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = function (e) {
        const src = e.target.result;
        newImages.push({ src });
        // Actualiza las previews sin perder las anteriores
        setImages((prev) => [...prev, ...newImages]);
      };

      reader.readAsDataURL(file);
    }
  };

  const clearInputs = () => {
    setFormImplement({
      prefix: null,
      name: null,
      status: "Seleccionar...",
      condition: "new",
      group_implement_id: null,
      categories_id: null,
      amount: 0,
      imgs: []
    });
    
    setImages([]);
    setErrors([]);
  };

  const handleSubmit = async () => {
    const otherErrors = [];

    if (!formImplement.name || formImplement.name.trim() === '' || hasNoXSSAndInjectionSql(formImplement.name)) {
      otherErrors.push({ path: 'name', message: 'El nombre no debe estar vacío' });
    }

    if (!formImplement.status || formImplement.status.trim() === '' || hasNoXSSAndInjectionSql(formImplement.status) || formImplement.status === 'Seleccionar...') {
      otherErrors.push({ path: 'status', message: 'Debe seleccionar un estado valido' });
    }

    if (!formImplement.condition || formImplement.condition.trim() === '' || hasNoXSSAndInjectionSql(formImplement.condition)) {
      otherErrors.push({ path: 'condition', message: 'La condición no debe estar vacía' });
    }

    if (!formImplement.amount || formImplement.amount.trim() === '' || isNaN(Number(formImplement.amount))) {
      otherErrors.push({ path: 'amount', message: 'La cantidad debe ser un numero valido' });
    }
    // if (!formImplement.group_implement_id || formImplement.group_implement_id.trim() === '' || isNaN(Number(formImplement.group_implement_id))) {
    //   otherErrors.push({ path: 'group_implement_id', message: 'El ID del grupo de implementos debe ser un número válido' });
    // }

    // if (!formImplement.categories_id || formImplement.categories_id.trim() === '' || isNaN(Number(formImplement.categories_id))) {
    //   otherErrors.push({ path: 'categories_id', message: 'El ID de la categoría debe ser un número válido' });
    // }
    // const { id, extraData, ...cleanForm } = formImplement;

    // Validaciones adicionales según sea necesario
    if (otherErrors.length > 0) {
      // window.showAlert("Error en datos del formulario", "error");
      setErrors(otherErrors);
      return;
    }
    
    setIsLoading(true);

    const formData = new FormData();

    formData.append('prefix', formImplement.prefix);
    formData.append('name', formImplement.name);
    formData.append('status', formImplement.status);
    formData.append('condition', formImplement.condition);
    formData.append('group_implement_id', formImplement.group_implement_id);
    formData.append('categories_id', formImplement.categories_id);
    formData.append('user_id', userId);
    formData.append('amount', formImplement.amount);

    const file = formImplement.imgs
    if(file.length > 0){
      for (let i = 0; i < file.length; i++) {
        formData.append('imgs', file[i]);
      }
    }

    // Validaciones de respuesta del servidor
    let response;
    if (implementId) {
      
      if (isNaN(Number(implementId))) {
        window.showAlert("Debes seleccionar un implemento valido antes de actualizar", "error")
        return;
      }
      // Lógica para actualizar un grupo de implementos existente
      response = await ImplementService.updateGroupImplement(implementId, formImplement);
    }else{
      response = await ImplementService.postImplement(formData);
    }

    if(!response.success){
      window.showAlert(response.message, "error")
      setErrors(response.errors || []);
      return;
    }

    // if(!id) clearInputs();
    clearInputs()
    
    window.showAlert(response?.message || "Implemento creado exitosamente", "success");
    setIsLoading(false);
    // if(onSaved) onSaved(); // notifica al padre que se guardó
    // onClose(); // cerrar modal después de crear
  };

  return (
    <>
      <AlertContainer />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          overflowY: 'auto',
          gap: "10px",
        }}
      >
        {/* Hay que hacer un div para la imagen y otro para los inputs */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {/* <h4>Presentación</h4> */}
          <Card
            images={images && images.length > 0 ? [images[0].src] : [NotFoundImage]}
            title={formImplement.name}
            // description={formImplement.status}
          >
            <Badge
              value={formImplement.status || "available"}
              label={formImplement.status || "available"}
            />

            <div
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                marginTop: "-230px",
                marginRight: "10px",
              }}
            >
              <Badge
                value={formImplement.condition || "new"}
                label={formImplement.condition || "new"}
              />
            </div>
            <InputField
              style={{ display: "none" }}
              ref={fileInputRef}
              id="imgs"
              type="file"
              Label="Foto"
              accept="image/*"
              onChange={handleImageChange}
            />
            <button
              style={{
                position: "absolute",
                marginTop: "-215px",
                // marginTop: "10px",
              }}
              className="btn-tertiary"
              onClick={handleClickFile}
            >

              <CloudUp 
                color="#ffffff" 
              />
            </button>
          </Card>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <InputField
              type="text"
              label="Grupo"
              name=""
              disabled={true}
              value={formGroupImplement.nameGroup}
              onChange={handleChange}
              errors={errors}
            />
            <InputField
              type="text"
              label="Prefijo"
              name="prefix"
              disabled={true}
              value={formGroupImplement.prefix}
              onChange={handleChange}
              errors={errors}
            />
          </div>

          <h4>Información del instrumento</h4>
          <ImplementSelectFieldContainer
            onStatus={handleChange}
            errors={errors}
          />

          <InputField
            type="text"
            label="Nombre"
            name="name"
            value={formImplement.name}
            onChange={handleChange}
            errors={errors}
          />

          <InputField
            type="text"
            label="Cantidad"
            name="amount"
            value={formImplement.amount}
            onChange={handleChange}
            errors={errors}
          />
        </div>
      </div>
      <div className="modal-actions">
        <Button
          disabled={isLoading}
          text="Cancelar" className="btn-secondary" onClick={onClose}>
          <CancelIcon />
        </Button>
        <Button 
          isLoading={isLoading}
          disabled={isLoading}
          text="Guardar" className="btn-primary" onClick={handleSubmit}>
          <SaveIcon />
        </Button>
      </div>
    </>
  );
};

export default ImplementCreateContainer;
