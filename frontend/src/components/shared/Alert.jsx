import { useEffect } from "react";

export default function Alert({ message, type = "success", duration = 4000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div
      className={`alert alert-${type} animate-fade-in`}
      style={{
        transition: "opacity 0.5s ease",
        opacity: 1,
        marginBottom: "0.5rem",
        padding: "0.75rem 1rem",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor:
          type === "success"
            ? "#d1fae5"
            : type === "error"
            ? "#fee2e2"
            : type === "warning"
            ? "#fef9c3"
            : "#e0f2fe",
        color:
          type === "success"
            ? "#065f46"
            : type === "error"
            ? "#991b1b"
            : type === "warning"
            ? "#92400e"
            : "#1e3a8a",
      }}
    >
      <span>{message}</span>
      <button
        onClick={handleClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "1.2rem",
          lineHeight: "1",
        }}
      >
        ×
      </button>
    </div>
  );
}
