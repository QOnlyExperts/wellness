import React from "react";
import "./CheckboxList.css";

const CheckboxList = (props) => {
  return (
    // <div className="checkbox-container">
      <label className="checkbox-label">
        <input type="checkbox" {...props} />
        <span className="checkbox-text">{props.title}</span>
      </label>

      // <label className="checkbox-label">
      //   <input type="checkbox" />
      //   <span className="checkbox-text">Correo</span>
      // </label>
    // </div>
  );
};

export default CheckboxList;
