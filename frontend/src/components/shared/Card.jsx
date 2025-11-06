import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Badge from "./Badge";

import "./Card.css";

const Card = React.memo(
  ({
    type,
    cod,
    images = [],
    title,
    description,
    footer,
    onClick,
    onClose,
    expanded = false,
    children,
  }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

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
      // Aquí el motion.div rota cuando expanded es true
      <motion.div
        className={`card card-${type || "default"}`}
        onClick={!expanded ? onClick : undefined}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: expanded ? 180 : 0 }}
        transition={{ duration: 0.15 }}
        style={{
          transformStyle: "preserve-3d",
          perspective: 1000,
          position: "relative",
        }}
      >
        {/* --- Cara frontal --- */}
        <div className="card-face card-front">
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

          <h5 className="description">{title}</h5>
          {description && <p className="text">{description}</p>}
          {footer && <div className="footer">{footer}</div>}

          {children && <div className="children">{children}</div>}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: '10px'
            }}
          >
            <Badge
              value={type || "available"}
              label={type || "available"}
            />
            <span>{cod}</span>
          </div>
        </div>

        {/* --- Cara trasera --- */}
        <div className="card-face card-back">
          <h5>{title}</h5>
          <button
            className="close-btn"
            onClick={(e) => {
              e.stopPropagation(); // evita que se dispare el click principal
              onClose();
            }}
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    );
  }
);

export default Card;
