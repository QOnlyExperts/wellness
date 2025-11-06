import "./Modal.css"; // Asegúrate de tener los estilos del modal

import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ title, onClose, children }) => {
  return (
    <AnimatePresence>
      {/* {isOpen && ( */}
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            // scale: 0.4 → empieza lejos (pequeño).
            // rotateX: -40 + transformPerspective: 1000 → da el efecto 3D.
            // spring con stiffness: 260 → movimiento más rápido y con rebote suave.
            // duration: 0.35 → controla la velocidad general.
            initial={{
              scale: 0.4,
              opacity: 0,
              rotateX: -40,
              transformPerspective: 1000,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              rotateX: 0,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 18,
                duration: 0.2, // 👈 controla la velocidad
              },
            }}
            exit={{
              scale: 0.7,
              opacity: 0,
              rotateX: 20,
              transition: { duration: 0.25 },
            }}
            onClick={(e) => e.stopPropagation()} // evita cerrar al hacer click dentro
          >
            
            <h3>{title}</h3>
            {children}
          </motion.div>
        </motion.div>
      {/* )} */}
    </AnimatePresence>
  );
};

// const Modal = ({ title, onClose, children }) => {
//   return (
//     <div className="modal-overlay">
//       <div className="modal" onClick={(e) => e.stopPropagation()}>
//         <header className="modal-header">
//           <h3>{title}</h3>
//           <button 
//             style={{
//               position: "absolute",
//               display: "flex",
//               right: "0",
//               marginRight: "10px"
//             }}
//             onClick={onClose}>✕</button>
//         </header>
//         {/* <button className="modal-close" onClick={onClose}>
//           &times;
//         </button> */}
//         {children}
//       </div>
//     </div>
//   );
// };

export default Modal;
