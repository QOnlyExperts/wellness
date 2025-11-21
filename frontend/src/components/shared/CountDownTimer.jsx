import React, { useState, useEffect } from 'react';
import moment from 'moment';

import './CountdownTimer.css';


// Ajusta Moment.js para mayor legibilidad en español (opcional)
// moment.locale('es');

/**
 * Muestra un contador regresivo de la fecha límite (limitedAt).
 * * @param {string} limitedAt - La fecha límite de la solicitud.
 * @param {string} createdAt - La fecha de inicio de la solicitud (para calcular la duración total).
 * @param {number} thresholdHours - Número de horas restantes para que el estado se vuelva "crítico" (por defecto 24).
 */
const CountdownTimer = ({ limitedAt, createdAt, thresholdHours = 24 }) => {
    
    const limitDate = moment(limitedAt);
    const creationDate = moment(createdAt);
    
    // Estado para el tiempo restante (diferencia entre límite y el momento actual)
    const [timeLeft, setTimeLeft] = useState(limitDate.diff(moment()));

    // Cálculo de la duración total planificada (para fines informativos)
    const totalDurationMs = limitDate.diff(creationDate);
    // humanize() convierte los milisegundos en un texto legible (ej. "4 días")
    const totalDurationFormatted = moment.duration(totalDurationMs).humanize(); 

    useEffect(() => {
        // Intervalo que se ejecuta cada segundo para actualizar el contador
        const timer = setInterval(() => {
            setTimeLeft(limitDate.diff(moment()));
        }, 1000);

        // Limpieza: detiene el intervalo al desmontar el componente
        return () => clearInterval(timer);
    }, [limitedAt, createdAt]);

    // --- Lógica de Formato y Estado ---

    // Calcula la duración para desglosar el tiempo restante
    const duration = moment.duration(timeLeft);
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    // 1. Determinar el estado (Expired, Critical, Normal)
    let statusClass = 'timer-normal';
    let statusText = 'Tiempo Restante';

    if (timeLeft <= 0) {
        statusClass = 'timer-expired';
        statusText = '¡TIEMPO EXPIRADO!';
    } else if (timeLeft < thresholdHours * 60 * 60 * 1000) {
        // Si queda menos del umbral de horas (ej. 24h)
        statusClass = 'timer-critical';
        statusText = '¡ENTREGA CRÍTICA!';
    }

    // 2. Formatear el tiempo restante
    const formattedTime = timeLeft > 0
        ? `${days > 0 ? `${days}d ` : ''}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        : '00:00:00';
    
    const displayValue = timeLeft <= 0 ? statusText : formattedTime;


    return (
        <div className={`countdown-container ${statusClass}`}>
            {/* <div className="countdown-header">{statusText}</div> */}
            <div className="countdown-value">{displayValue}</div>
            {/* Solo mostramos la referencia si aún no ha expirado */}
            {timeLeft > 0 && (
                <small className="countdown-limit">
                    {/* {limitDate.format('DD/MM HH:mm')}  */}
                    Límite: {totalDurationFormatted}
                </small>
            )}
        </div>
    );
};

export default CountdownTimer;