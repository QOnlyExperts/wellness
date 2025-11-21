// src/components/ReusableTable.jsx
import React from "react";

import "./ReusableTable.css"; // Importar estilos opcionales

// Componente ReusableTable que recibe columnas, datos y estilos de columna como props
const ReusableTable = ({ columns, columnsHead, data, columnStyles }) => {
    // Función para obtener valores anidados de un objeto utilizando una cadena de acceso
    const getNestedValue = (obj, accessor) => {
        return accessor.split(".").reduce((acc, key) => {
            // Coincide con patrones de índice de array como Addresses[0]
            const match = key.match(/(\w+)\[(\d+)\]/);
            if (match) {
                const [_, arrayKey, index] = match; // Desestructura el nombre del array y el índice
                return acc && acc[arrayKey] && acc[arrayKey][index]; // Devuelve el valor del array en el índice si existe
            }
            return acc && acc[key]; // Devuelve el valor de la clave actual si no es un array
        }, obj);
    };

    // Determinar el índice de la columna de acciones (asumiendo que es la última)
    const actionsColIndex = columns.length - 1;

    return (
        <>
            <div className="table-wrapper">
                {/* 1. Las etiquetas <table> y <thead> deben estar pegadas a sus hijos para evitar nodos de texto. */}
                <table>
                    <thead>
                        {/* 2. La etiqueta <tr> debe estar pegada a <thead> y <th> debe estar pegado a <tr> */}
                        <tr>
                            {columnsHead &&
                                columnsHead.length &&
                                columnsHead.map((column, index) => (
                                    <th
                                        key={index}
                                        style={columnStyles[index]}
                                        className={index === actionsColIndex ? "th-actions" : ""}
                                    >
                                        {/* Eliminado el espacio extra {" "} aquí */}
                                        {column.header}
                                    </th>
                                ))}
                        </tr>
                    </thead>
                    
                    {/* 3. La etiqueta <tbody> debe estar pegada a sus hijos <tr> */}
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        style={columnStyles[colIndex]}
                                        className={colIndex === actionsColIndex ? "td-actions" : ""}
                                    >
                                        {/* Eliminado el espacio extra {" "} aquí */}
                                        {/* El contenido de la celda está bien */}
                                        {typeof row[column.accessor] === 'object' && row[column.accessor] !== null
                                            ? row[column.accessor]
                                            : getNestedValue(row, column.accessor)
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Se asume que <h4>2 - 2</h4> es contenido válido */}
            <h4>2 - 2</h4>
        </>
    );
};

export default ReusableTable;