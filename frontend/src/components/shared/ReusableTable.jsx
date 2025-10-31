// src/components/ReusableTable.jsx
import React from 'react';

import './ReusableTable.css'; // Importar estilos opcionales

// Componente ReusableTable que recibe columnas, datos y estilos de columna como props
const ReusableTable = ({ columns, columnsHead, data, columnStyles }) => {

  // Función para obtener valores anidados de un objeto utilizando una cadena de acceso
  const getNestedValue = (obj, accessor) => {
    return accessor.split('.').reduce((acc, key) => {
      // Coincide con patrones de índice de array como Addresses[0]
      const match = key.match(/(\w+)\[(\d+)\]/);
      if (match) {
        const [_, arrayKey, index] = match; // Desestructura el nombre del array y el índice
        return acc && acc[arrayKey] && acc[arrayKey][index]; // Devuelve el valor del array en el índice si existe
      }
      return acc && acc[key]; // Devuelve el valor de la clave actual si no es un array
    }, obj);
  };

  return (
    // <div style={{display: 'flex', flexDirection: 'column', boxShadow: 'var(--box-shadow)'}}>  
    <>
      <div className='table-wrapper'>

        <table>
          <thead>
            <tr>
              {
                columnsHead && columnsHead.length &&
                columnsHead.map((column, index) => (
                  <th key={index} style={columnStyles[index]}>
                    {column.header} {/* Renderiza el encabezado de cada columna */}
                  </th>
                ))
              }
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} style={columnStyles[colIndex]}>
                    {getNestedValue(row, column.accessor)} {/* Obtiene y renderiza el valor de cada celda */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h4>2 - 2</h4>
    </>
  );
};

export default ReusableTable;
