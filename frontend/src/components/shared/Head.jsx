import { Link } from "react-router-dom";
import "./Head.css";

const Head = ({ title, subTitle, className = "", children }) => {
  return (
    <header className={`head-container ${className}`}>
      <div>
        <h2 className="head-title">{title}</h2>
        <h2 className="head-sub-title">{subTitle}</h2>
      </div>

      {
        children && 
          <div className="head-actions">
            {/* Aquí puedes pasar cualquier otro componente */}
            {children}
          </div>
      }
    </header>
  );
};

export default Head;
