import React, { useEffect, useState } from "react";

import AlertContainer from "../shared/AlertContainer";
import Modal from "../../components/shared/Modal";
import GroupImplementService from "../../services/GroupImplementService";
import InputField from "../../components/shared/InputField";

import {hasNoXSSAndInjectionSql, isValidEmail, isValidPhone, onlyLettersRegex} from '../../utils/validations';



const GroupImplementModalContainer = ({ groupImplementId, onClose, onSaved }) => {
  // const [messageError, setMessageError] = useState("");
  const [errors, setErrors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    max_hours: "",
    time_limit: "",
  });

  useEffect(() => {
    const fetchGroupImplement = async () => {
      if (groupImplementId && !isNaN(Number(groupImplementId))) {
        const response = await GroupImplementService.getGroupImplementById(groupImplementId);
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

    if (!form.time_limit || form.time_limit.trim() === "" || !/^\d+$/.test(form.time_limit) || form.time_limit.length > 12) {
      otherErrors.push({ path: 'time_limit', message: 'El límite de tiempo debe ser un número y no debe estar vacío. max 12 horas' });
    }

    // Validaciones adicionales según sea necesario
    if (otherErrors.length > 0) {
      window.showAlert("Error en datos del formulario", "error");
      setErrors(otherErrors);
      return;
    }

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
      setErrors(response.errors || []);
      return;
    }

    if(!groupImplementId) clearInputs();
    
    window.showAlert(response.message || "Grupo de implementos creado exitosamente", "success");
    if(onSaved) onSaved(); // notifica al padre que se guardó
    // onClose(); // cerrar modal después de crear
  };

  return (
    <Modal onClose={onClose} title="Nuevo Grupo de Implementos">
      <AlertContainer />
      <InputField
        type="text"
        label="Nombre"
        name="name"
        value={form.name}
        onChange={handleChange}
        errors={errors}
      />
      <InputField
        type="text"
        label="Horas Máximas"
        name="max_hours"
        value={form.max_hours}
        onChange={handleChange}
        errors={errors}
      />
      <InputField
        type="text"
        label="Límite de Tiempo"
        name="time_limit"
        value={form.time_limit}
        onChange={handleChange}
        errors={errors}
      />
      <div className="modal-actions">
        <button className="btn-primary" onClick={handleSubmit}>Guardar</button>
        <button className="btn-secondary" onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
};

export default GroupImplementModalContainer;
