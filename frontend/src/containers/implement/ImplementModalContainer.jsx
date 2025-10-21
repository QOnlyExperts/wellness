import React, { useEffect, useState } from "react";

import { useLoader } from "../../context/LoaderContext";

import AlertContainer from "../shared/AlertContainer";
import Modal from "../../components/shared/Modal";
import GroupImplementService from "../../services/GroupImplementService";
import InputField from "../../components/shared/InputField";

import {hasNoXSSAndInjectionSql, isValidEmail, isValidPhone, onlyLettersRegex} from '../../utils/validations';
import ImplementSelectFieldContainer from "./ImplementSelecFieldContainer";
import Card from "../../components/shared/Card";

import NotFoundImage from "../../assets/img/NoImg.svg";
import CloudUp from "../../components/icons/CloudUpIcon";
import SaveIcon from "../../components/icons/SaveIcon";
import Button from "../../components/shared/Button";
import CancelIcon from "../../components/icons/CancelIcon";


const ImplementModalContainer = ({ groupImplementId, onClose, onSaved }) => {
  const { showLoader, hideLoader } = useLoader();
  // const [messageError, setMessageError] = useState("");
  const [errors, setErrors] = useState([]);
  const [formImplement, setFormImplement] = useState({
    cod: "",
    status: "",
    condition: "",
    group_implement_id: "",
    categories_id: "",
    amount: "",
  });

  const [formGroupImplement, setFormGroupImplement] = useState({
    name: "",
    prefix: "",
  });

  useEffect(() => {

    // Para consultar el grupo de implementos
    const fetchGroupImplement = async () => {

      if (groupImplementId && !isNaN(Number(groupImplementId))) {
        const response = await GroupImplementService.getGroupImplementById(groupImplementId);
        setFormGroupImplement({
          name: String(response.data.name),
          prefix: String(response.data.prefix),
        });
      }
    };

    // Para consultar los implementos por id de grupo
    const fetchImplement = async () => {
      if (groupImplementId && !isNaN(Number(groupImplementId))) {
        const response = await GroupImplementService.getGroupImplementById(groupImplementId);
        setFormImplement({
          name: String(response.data.name),
          max_hours: String(response.data.max_hours),
          time_limit: String(response.data.time_limit),
        });
      }
    };

    showLoader();
    // Hacer con un promise.all si se quieren cargar ambos a la vez
    Promise.all([fetchGroupImplement(), fetchImplement()]).then(() => {
      hideLoader();
    });

  }, [groupImplementId]);

  const handleChange = (e) => {
    setFormImplement({ ...form, [e.target.name]: e.target.value });
  };

  const clearInputs = () => {
    setFormImplement({
      cod: "",
      status: "",
      condition: "",
      group_implement_id: "",
      categories_id: "",
      amount: "",
    });
  };

  const handleSubmit = async () => {
    const otherErrors = [];

    // if (!form.cod || form.cod.trim() === '' || hasNoXSSAndInjectionSql(form.cod)) {
    //   otherErrors.push({ path: 'cod', message: 'El código no debe estar vacío' });
    // }

    if (!formImplement.status || formImplement.status.trim() === '' || hasNoXSSAndInjectionSql(formImplement.status)) {
      otherErrors.push({ path: 'status', message: 'El estado no debe estar vacío' });
    }

    if (!formImplement.condition || formImplement.condition.trim() === '' || hasNoXSSAndInjectionSql(formImplement.condition)) {
      otherErrors.push({ path: 'condition', message: 'La condición no debe estar vacía' });
    }

    if (!formImplement.group_implement_id || formImplement.group_implement_id.trim() === '' || isNaN(Number(formImplement.group_implement_id))) {
      otherErrors.push({ path: 'group_implement_id', message: 'El ID del grupo de implementos debe ser un número válido' });
    }

    if (!formImplement.categories_id || formImplement.categories_id.trim() === '' || isNaN(Number(formImplement.categories_id))) {
      otherErrors.push({ path: 'categories_id', message: 'El ID de la categoría debe ser un número válido' });
    }

    // Validaciones adicionales según sea necesario
    if (otherErrors.length > 0) {
      window.showAlert("Error en datos del formulario", "error");
      setErrors(otherErrors);
      return;
    }

    // Validaciones de respuesta del servidor
    let response;
    // if (id) {
    //   // Lógica para actualizar un grupo de implementos existente
    //   response = await GroupImplementService.updateGroupImplement(id, form);
    // }else{
    //   response = await GroupImplementService.postGroupImplement(form);
    // }

    if(!response.success){
      window.showAlert(response.message, "error")
      setErrors(response.errors || []);
      return;
    }

    if(!id) clearInputs();
    
    window.showAlert(response.message || "Grupo de implementos creado exitosamente", "success");
    if(onSaved) onSaved(); // notifica al padre que se guardó
    // onClose(); // cerrar modal después de crear
  };

  return (
    <Modal onClose={onClose} title="Nuevo Implemento">
      <AlertContainer />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        {/* Hay que hacer un div para la imagen y otro para los inputs */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            gap: "10px"
          }}
        >

          <h4>Presentación</h4>
          <Card 
            image={NotFoundImage}
            title={formGroupImplement.name}
            description={formImplement.status}
          >

          </Card>

          <button
            style={{
              position: "absolute",
              bottom: "0",
              marginBottom: "10px",
            }}
            className="btn-tertiary"
          > 
            <CloudUp 
              color="#ffffff"
            />
            Cargar imagen
          </button>
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
              label="Nombre"
              name="name"
              disabled={true}
              value={formGroupImplement.name}
              onChange={handleChange}
              errors={errors}
            />
            <InputField
              type="text"
              label="Cantidad"
              name="amount"
              disabled={true}
              value={formGroupImplement.prefix}
              onChange={handleChange}
              errors={errors}
            />
          </div>

          
          <h4>Información del instrumento</h4>
          <ImplementSelectFieldContainer />

          <InputField
            type="text"
            label="Cantidad"
            name="amount"
            value={formImplement.amount}
            onChange={handleChange}
            errors={errors}
          />

          <div className="modal-actions">
            <Button text="Guardar" className="btn-primary" onClick={handleSubmit}>
              <SaveIcon />
            </Button>
            <Button text="Cancelar" className="btn-secondary" onClick={onClose}>
              <CancelIcon/>
            </Button>
          </div>

        </div>

      </div>

    </Modal>
  );
};

export default ImplementModalContainer;
