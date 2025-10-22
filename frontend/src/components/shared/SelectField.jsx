import React from "react";
import "./SelectField.css";

const SelectField = ({ label, value, options, onChange, name, errors }) => {
  return (
    <div className="select-field">
      <div className="select-wrapper">
        {label && <label className="select-label">{label}</label>}
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="select-input"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {Array.isArray(errors) && errors.map((err, i) => (
        err.path === name ? 
          <span key={i} style={{ color: 'red', fontSize: '.7rem' }}>{err.message}</span> 
        : null
      ))}
    </div>
  );
};

export default SelectField;
