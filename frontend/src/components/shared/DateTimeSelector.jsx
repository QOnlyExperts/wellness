import React, { useMemo, useState, useRef, useEffect } from "react";
import "./DateTimeSelector.css";

// ----------------------------------------------------
// Helpers
// ----------------------------------------------------
const getBaseTimes = () => {
  const now = new Date();
  const actualMinDate = new Date(
    Math.ceil((now.getTime() + 60000) / 60000) * 60000
  );

  const maxDate = new Date(actualMinDate);
  maxDate.setHours(24, 0, 0, 0);

  const datePart = `${actualMinDate.getFullYear()}-${String(
    actualMinDate.getMonth() + 1
  ).padStart(2, "0")}-${String(actualMinDate.getDate()).padStart(2, "0")}`;

  return {
    currentHour24: actualMinDate.getHours(),
    currentMinute: actualMinDate.getMinutes(),
    maxHour24:
      actualMinDate.getTime() > maxDate.getTime()
        ? actualMinDate.getHours()
        : 24,
    datePart,
  };
};

const generateAvailableHours = (baseTimes) => {
  const hours = [];
  for (let h = baseTimes.currentHour24; h <= baseTimes.maxHour24; h++) {
    const date = new Date();
    date.setHours(h, 0, 0, 0);
    const hour12 = date.getHours() % 12 || 12;
    const ampm = date.getHours() >= 12 ? "PM" : "AM";

    hours.push({
      display: `${hour12} ${ampm}`,
      value24: h,
      isCurrentHour: h === baseTimes.currentHour24,
    });
  }
  return hours;
};

const generateAvailableMinutes = (selectedHour24, baseTimes) => {
  const minutes = [];
  let startMinute = selectedHour24 === baseTimes.currentHour24
    ? baseTimes.currentMinute
    : 0;

  for (let m = startMinute; m <= 59; m++) {
    minutes.push({
      display: String(m).padStart(2, "0"),
      value: m,
    });
  }

  return minutes;
};

const formatISO = (datePart, hour24, minute) => {
  // Le decimos a la cadena ISO que esta hora fue seleccionada en la zona UTC-05
  return `${datePart}T${String(hour24).padStart(2, "0")}:${String(
    minute
  ).padStart(2, "0")}:00-05:00`; // <-- ¡CLAVE!
};

const formatIsoToReadable = (isoString) => {
  if (!isoString) return "";

  // 1. Crea el objeto Date con el instante UTC almacenado en la DB
  const date = new Date(isoString);

  // 2. APLICA EL OFFSET MANUAL DE -5 HORAS (Colombia)
  // Restamos 5 horas en milisegundos (5 * 60 minutos * 60 segundos * 1000 ms)
  const FIVE_HOURS_MS = 5 * 60 * 60 * 1000;
  
  // Creamos un nuevo objeto Date que ya está en la hora de Bogotá
  const dateInBogotaTime = new Date(date.getTime() - FIVE_HOURS_MS); 

  // 3. Usamos los métodos 'getUTC...' para extraer los componentes
  //    Esto es crucial para que no aplique otra conversión local.

  const dd = String(dateInBogotaTime.getUTCDate()).padStart(2, "0");
  const mm = String(dateInBogotaTime.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = dateInBogotaTime.getUTCFullYear();

  let hours = dateInBogotaTime.getUTCHours();
  const minutes = String(dateInBogotaTime.getUTCMinutes()).padStart(2, "0");

  // 4. Cálculo manual de AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convierte 0 → 12 o 12 → 12

  const hh = String(hours).padStart(2, "0");

  // Resultado: 26/11/2025, 11:59 PM
  return `${dd}/${mm}/${yyyy}, ${hh}:${minutes} ${ampm}`;
};
// ----------------------------------------------------
// COMPONENTE PRINCIPAL
// ----------------------------------------------------
const DateTimeSelector = ({ value, onChange }) => {
  const hoursDropdownRef = useRef(null);
  const minutesDropdownRef = useRef(null);

  const baseTimes = useMemo(() => getBaseTimes(), []);
  const availableHours = useMemo(
    () => generateAvailableHours(baseTimes),
    [baseTimes]
  );

  const [openDropdown, setOpenDropdown] = useState(null);

  const [selectedHour24, setSelectedHour24] = useState(
    availableHours[0]?.value24 || baseTimes.currentHour24
  );
  const [selectedMinute, setSelectedMinute] = useState(baseTimes.currentMinute);

  const availableMinutes = useMemo(
    () => generateAvailableMinutes(selectedHour24, baseTimes),
    [selectedHour24, baseTimes]
  );

  // Validación automática de minutos
  useEffect(() => {
    if (availableMinutes.length > 0) {
      const firstMin = availableMinutes[0].value;
      if (selectedMinute < firstMin) {
        setSelectedMinute(firstMin);
      }
    }
  }, [selectedHour24, availableMinutes]);

  // Valor final ISO
  const finalISO = useMemo(() => {
    return formatISO(baseTimes.datePart, selectedHour24, selectedMinute);
  }, [selectedHour24, selectedMinute, baseTimes.datePart]);

  // Notificar al padre
  useEffect(() => {
    if (onChange) onChange(finalISO);
  }, [finalISO]);

  // Handlers
  const handleHourSelect = (hour24) => {
    setSelectedHour24(hour24);
    setOpenDropdown(null);
  };

  const handleMinuteSelect = (minute) => {
    setSelectedMinute(minute);
    setOpenDropdown(null);
  };

  // Cerrar menú al hacer click afuera
  useEffect(() => {
    const outside = (e) => {
      if (
        !hoursDropdownRef.current?.contains(e.target) &&
        !minutesDropdownRef.current?.contains(e.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  return (
    <div className="datetime-selector-container">
      <label className="datetime-label">Hora de entrega (Máximo 6PM)</label>

      <div className="input-container-row">

        {/* HORAS */}
        <div className="custom-dropdown-wrapper" ref={hoursDropdownRef}>
          <div
            className={`time-input-display ${openDropdown === "hours" ? "open" : ""}`}
            onClick={() =>
              setOpenDropdown(openDropdown === "hours" ? null : "hours")
            }
          >
            <span>
              {availableHours.find((h) => h.value24 === selectedHour24)?.display}
            </span>
          </div>

          {openDropdown === "hours" && (
            <ul className="time-dropdown-list">
              {availableHours.map((hour) => (
                <li
                  key={hour.value24}
                  className={`time-slot-item hour-slot-item ${
                    hour.value24 === selectedHour24 ? "selected" : ""
                  }`}
                  onClick={() => handleHourSelect(hour.value24)}
                >
                  {hour.display}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* MINUTOS */}
        <div className="custom-dropdown-wrapper" ref={minutesDropdownRef}>
          <div
            className={`time-input-display ${openDropdown === "minutes" ? "open" : ""}`}
            onClick={() =>
              setOpenDropdown(openDropdown === "minutes" ? null : "minutes")
            }
          >
            <span>{String(selectedMinute).padStart(2, "0")}</span>
          </div>

          {openDropdown === "minutes" && (
            <ul className="time-dropdown-list">
              {availableMinutes.map((minute) => (
                <li
                  key={minute.value}
                  className={`time-slot-item minute-slot-item ${
                    minute.value === selectedMinute ? "selected" : ""
                  }`}
                  onClick={() => handleMinuteSelect(minute.value)}
                >
                  {minute.display}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* FORMATO LEGIBLE */}
      <p className="selected-time-display">
        <small>
          Fecha y Hora definida
          <br />
          <strong>{formatIsoToReadable(finalISO)}</strong>
        </small>
      </p>
    </div>
  );
};

export default DateTimeSelector;
