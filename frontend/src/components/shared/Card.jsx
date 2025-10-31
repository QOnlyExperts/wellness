import React, { useEffect, useState } from "react";
import "./Card.css";

const Card = React.memo(
  ({
    type,
    images = [], // ← ahora acepta varias imágenes
    title,
    description,
    footer,
    onClick,
    children,
  }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // 🌀 Si hay más de una imagen, rota automáticamente cada 3 segundos
    useEffect(() => {
      if (images.length > 1) {
        const interval = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
      }
    }, [images]);

    const currentImage =
      images.length > 0 ? images[currentIndex] : "/default-image.jpg";

    return (
      <div className={`card card-${type || "default"}`} onClick={onClick}>
        {/* Imagen o carrusel */}
        {images.length > 0 && (
          <div className="div-img">
            <img src={currentImage} alt={title || "Imagen"} />
            {images.length > 1 && (
              <div className="carousel-dots">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`dot ${idx === currentIndex ? "active" : ""}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Título */}
        {title && <h5 className="description">{title}</h5>}

        {/* Descripción opcional */}
        {description && <p className="text">{description}</p>}

        {/* Footer */}
        {footer && <div className="footer">{footer}</div>}

        {/* Children (badges, etiquetas, etc.) */}
        {
          children &&
            <div className="children">{children}</div>
        }
      </div>
    );
  }
);

export default Card;
