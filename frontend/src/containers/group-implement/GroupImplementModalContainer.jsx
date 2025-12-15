import React, { useEffect, useState } from "react";

import AlertContainer from "../shared/AlertContainer";
import Modal from "../../components/shared/Modal";
import GroupImplementService from "../../services/GroupImplementService";
import InputField from "../../components/shared/InputField";

import {hasNoXSSAndInjectionSql, isValidEmail, isValidPhone, onlyLettersRegex} from '../../utils/validations';

import { useLoader } from "../../context/LoaderContext";
import Button from "../../components/shared/Button";
import SaveIcon from "../../components/icons/SaveIcon";
import CancelIcon from "../../components/icons/CancelIcon";
import LoaderIcon from "../../components/icons/LoaderIcon";

const GroupImplementModalContainer = ({ groupImplementId, onClose, onSaved }) => {
  
  const [isLoading, setIsLoading] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  // const [messageError, setMessageError] = useState("");
  const [errors, setErrors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    max_hours: "",
    time_limit: "0",
  });

  useEffect(() => {
    const fetchGroupImplement = async () => {
      if (groupImplementId && !isNaN(Number(groupImplementId))) {
        showLoader();
        const response = await GroupImplementService.getGroupImplementById(groupImplementId);
        hideLoader();
        setForm({
          name: String(response.data.name),
          max_hours: String(response.data.max_hours),
          time_limit: String(response.data.time_limit),
        });

      }
    };

    fetchGroupImplement();
  }, [groupImplementId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const clearInputs = () => {
    setForm({
      name: "",
      max_hours: "",
      time_limit: "",
    });
  };

  const handleSubmit = async () => {
    const otherErrors = [];

    if (!form.name || form.name.trim() === '' || hasNoXSSAndInjectionSql(form.name) || !onlyLettersRegex(form.name)) {
      otherErrors.push({ path: 'name', message: 'El nombre debe contener solo letras y no debe estar vacío' });
    }
  
    if (!form.max_hours || form.max_hours.trim() === "" || !/^\d+$/.test(form.max_hours) || form.max_hours.length > 3) {
      otherErrors.push({ path: 'max_hours', message: 'Las horas máximas deben ser un número y no deben estar vacías. max 3 horas' });
    }


    // Validaciones adicionales según sea necesario
    if (otherErrors.length > 0) {
      window.showAlert("Error en datos del formulario", "error");
      setErrors(otherErrors);
      return;
    }

    setIsLoading(true);
    // Validaciones de respuesta del servidor
    let response;
    if (groupImplementId && !isNaN(groupImplementId)) {
      // Lógica para actualizar un grupo de implementos existente
      response = await GroupImplementService.updateGroupImplement(groupImplementId, form);
    }else{
      response = await GroupImplementService.postGroupImplement(form);
    }

    if(!response.success){
      window.showAlert(response.message ? response.message : response?.error.message, "error")
      setIsLoading(false);
      setErrors(response.errors);
      return;
    }

    if(!groupImplementId) clearInputs();
    
    window.showAlert(response.message || "Grupo de implementos creado exitosamente", "success");
    if(onSaved) onSaved(); // notifica al padre que se guardó

    setIsLoading(false);
    // onClose(); // cerrar modal después de crear
  };

  return (
    <Modal onClose={onClose} title="Nuevo Grupo de Implementos">
      <AlertContainer />
      <InputField
        type="text"
        label="Nombre"
        name="name"
        placeholder="Nombre del grupo"
        value={form.name}
        onChange={handleChange}
        errors={errors}
      />
      <InputField
        type="text"
        label="Horas Máximas"
        name="max_hours"
        placeholder="Máximo de horas por implementos"
        value={form.max_hours}
        onChange={handleChange}
        errors={errors}
      />
      {/* <InputField
        type="text"
        label="Límite de Tiempo"
        name="time_limit"
        value={form.time_limit}
        onChange={handleChange}
        errors={errors}
      /> */}
      <div className="modal-actions">
        <Button
          disabled={isLoading}
          text="Cancelar" className="btn-secondary" onClick={onClose}>
          <CancelIcon />
        </Button>
        <Button 
          isLoading={isLoading}
          disabled={isLoading}
          colorIcon="#000000"
          text="Guardar" className={isLoading ? "btn-icon" : "btn-primary"} onClick={handleSubmit}>
          <SaveIcon />
        </Button>
      </div>
    </Modal>
  );
};

export default GroupImplementModalContainer;
