import React from "react";
import "./CheckboxList.css";
import CheckedIcon from "../icons/CheckedIcon";
import UncheckedIcon from "../icons/UnCheckedIcon";

const CheckboxList = ({ title, checked, onChange }) => {
  return (
    <label className="checkbox-label">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange} 
      />
      <span className="custom-checkbox">
        {checked ? <CheckedIcon/> : <UncheckedIcon />} {/* Aquí puedes poner tus íconos */}
      </span>
      <span className="checkbox-text">{title}</span>
    </label>
  );
};

export default CheckboxList;
