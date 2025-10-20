import React from "react";
import "./SelectField.css";

const SelectField = ({ label, value, options, onChange, name }) => {
  return (
    <div className="select-field">
      {label && <label className="select-label">{label}</label>}
      <div className="select-wrapper">
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="select-input"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectField;
