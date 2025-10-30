import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({ label, min = 0, value = 0, max = 100, color = "#1EADFF" }) => {
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);

  return (
    <div className="progress-container">
      {label && <p className="progress-label">{label}</p>}

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        >
          <span className="progress-text">
            {value} / {max}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
