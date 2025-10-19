import { useState } from "react";
import Alert from "../../components/shared/Alert";

export default function AlertContainer() {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (message, type = "success", duration = 4000) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  // Devuelve el método showAlert para poder usarlo fuera
  window.showAlert = showAlert;

  return (
    <div
      id="alert-container"
      style={{
        // position: "fixed",
        // top: "1rem",
        // right: "1rem",
        // zIndex: 9999,
        // display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          message={alert.message}
          type={alert.type}
          duration={alert.duration}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </div>
  );
}
