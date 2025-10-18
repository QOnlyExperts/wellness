// context/ErrorContext.js
import React, { createContext, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ErrorContext = createContext();

export const useError = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const showError = (message) => setError(message);
  const clearError = () => setError(null);

  const clearData = () => {
    localStorage.clear();
    navigate('/login');
  }

  return (
    <ErrorContext.Provider value={{ error, showError, clearError }}>
      {children}
      {error && (
        
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "1.5rem",
            borderRadius: "0.5rem",
            maxWidth: "400px",
            width: "100%",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            textAlign: "center"
          }}>
            <p style={{
              // color: "#dc2626", // rojo intenso
              color: "#000",
              marginBottom: "1rem",
              fontSize: "1rem",
              fontWeight: "500"
            }}>
              {error}
            </p>
            <button
              className='btn-primary'
              onClick={() => {
                clearError();
                clearData();
              }}
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      )}
    </ErrorContext.Provider>
  );
};
