import "./Modal.css"; // Asegúrate de tener los estilos del modal

const Modal = ({ title, onClose, children }) => {
  return (
    <div className="modal-overlay">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3>{title}</h3>
          <button 
            style={{
              position: "absolute",
              display: "flex",
              right: "0",
              marginRight: "10px"
            }}
            onClick={onClose}>✕</button>
        </header>
        {/* <button className="modal-close" onClick={onClose}>
          &times;
        </button> */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
