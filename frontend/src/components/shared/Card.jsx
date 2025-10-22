import React from "react";
import "./Card.css";

// React.memo() evita renders innecesarios:
// Solo vuelve a renderizar el componente si sus props cambian.
const Card = React.memo(({ 
  image, 
  title, 
  description, 
  footer, 
  onClick, 
  children 
}) => {
  return (
    <div className="card" onClick={onClick}>
      {/* Imagen */}
      {image && (
        <div className="div-img">
          <img src={image} alt={title || "Card Image"} />
        </div>
      )}

      {/* Título o contenido principal */}
      {title && <h5 className="description">{title}</h5>}

      {/* Descripción opcional */}
      {description && <p className="text">{description}</p>}

      {/* Footer opcional (botones, precios, etc.) */}
      {footer && <div className="footer">{footer}</div>}

      {/* O puedes renderizar children directamente si prefieres */}
      <div className="children">
        {children}
      </div>
    </div>
  );
});

export default Card;
