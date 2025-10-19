import { Link } from "react-router-dom";
import "./Head.css";

const Head = ({ title, className = "", children }) => {
  return (
    <header className={`head-container ${className}`}>

      <div className="head-actions">
        {/* Aquí puedes pasar cualquier otro componente */}
        {children}
      </div>

      <h2 className="head-title">{title}</h2>
    </header>
  );
};

export default Head;
