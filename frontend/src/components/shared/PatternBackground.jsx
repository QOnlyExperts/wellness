import React from 'react';
import './PatternBackground.css'; // Importa los estilos CSS

const PatternBackground = ({ children }) => {
  return (
    <div className="pattern-background-container">
      {children}
    </div>
  );
};

export default PatternBackground;