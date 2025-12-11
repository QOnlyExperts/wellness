import React, { useState, useEffect } from "react";
import moment from "moment";
import "moment-duration-format";

import "./CountDownTimer.css";

/**
 * Muestra un contador regresivo de la fecha límite (limitedAt).
 * @param {string} limitedAt - La fecha límite de la solicitud (Ahora debe incluir 'Z').
 * @param {string} createdAt - La fecha de inicio de la solicitud.
 * @param {number} thresholdHours - Número de horas restantes para que el estado se vuelva "crítico" (por defecto 24).
 */
const CountdownTimer = ({ limitedAt, createdAt, thresholdHours = 24 }) => {
    
    // Parseamos las fechas de entrada. Si 'limitedAt' tiene la 'Z', Moment.js la interpreta como UTC.
    // Esto es ahora limpio y robusto.
    const limitDate = moment(limitedAt);
    const creationDate = moment(createdAt);

    // Estado para el tiempo restante. Usamos moment.utc() para la comparación.
    const [timeLeft, setTimeLeft] = useState(limitDate.diff(moment.utc()));

    // Cálculo de la duración total planificada
    const totalDurationMs = limitDate.diff(creationDate);
    const totalDurationFormatted = moment.duration(totalDurationMs).humanize();

    useEffect(() => {
        const timer = setInterval(() => {
            // Actualizamos timeLeft comparando límite UTC vs. momento actual UTC
            setTimeLeft(limitDate.diff(moment.utc()));
        }, 1000);

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
    let statusClass = "timer-normal";
    let statusText = "Tiempo Restante";

    if (timeLeft <= 0) {
        statusClass = "timer-expired";
        statusText = "¡tiempo expirado!";
    } else if (timeLeft < thresholdHours * 60 * 60 * 1000) {
        // Si queda menos del umbral de horas
        statusClass = "timer-critical";
        statusText = "¡ENTREGA CRÍTICA!";
    }

    // 2. Formatear el tiempo restante
    const formattedTime =
        timeLeft > 0
            ? `${days > 0 ? `${days}d ` : ""}${String(hours).padStart(
                  2,
                  "0"
              )}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
                  2,
                  "0"
              )}`
            : "00:00:00";

    const displayValue = timeLeft <= 0 ? statusText : formattedTime;

    // 3. Formateo de la hora límite para visualización:
    // Ahora que limitDate ya está en UTC, simplemente formateamos la hora UTC.
    const displayLimit = limitDate.format("DD/MM/YYYY hh:mm a");

    return (
        <div className={`countdown-container ${statusClass}`}>
            {/* Si el tiempo es crítico o ha expirado, muestra el estado */}
            {(statusClass === "timer-critical" ||
                statusClass === "timer-expired") && (
                <div className="countdown-header">{statusText}</div>
            )}
            <div className="countdown-value">{displayValue}</div>
            {/* Solo mostramos la referencia si aún no ha expirado */}
            {timeLeft > 0 && (
                <small className="countdown-limit">
                    {/* Muestra la hora del límite en formato UTC del servidor */}
                    Límite: {displayLimit} (Total: {totalDurationFormatted})
                </small>
            )}
        </div>
    );
};

export default CountdownTimer;