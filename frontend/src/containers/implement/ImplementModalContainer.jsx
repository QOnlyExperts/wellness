
import { useState } from "react";
import MenuListIcon from "../../components/icons/MenuListIcon";
import Button from "../../components/shared/Button";
import Modal from "../../components/shared/Modal";
import ImplementCreateContainer from "./ImplementCreateContainer";
import ImplementListContainer from "./ImplementListContainer";
import PlusCircleIcon from "../../components/icons/PlusCircleIcon";


const ImplementModalContainer = ({ groupImplementId, onClose, onSaved }) => {
  const [view, setView] = useState("first");
  const [direction, setDirection] = useState("none");

  const handleNext = () => {
    setDirection("to-left");
    setView("second");
  };

  const handleBack = () => {
    setDirection("to-right");
    setView("first");
  };


  return (
    <Modal onClose={onClose} title={view === 'first'? 'Nuevo implemento': 'Listado de implementos'}>
        {/* Primera vista */}
        <div className="view-wrapper">
          {view === "first" && (
            <div key="first" className={`view slide-${direction}`}>
              
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  with: "100%"
                }} 
              >
                <Button
                  style={{
                    flexDirection: 'row-reverse',
                    fontWeight: 'bold'
                  }}
                  className="btn-icon"
                  text="Lista de Implementos"
                  onClick={handleNext}
                >
                  <MenuListIcon
                    color="var(--color-primary)"
                  />
                </Button>
              </div>
              
              <ImplementCreateContainer 
                groupImplementId={groupImplementId}
                onClose={onClose}
                onSaved={onSaved}
              />
            </div>
          )}
          {view === "second" && (
            <div key="second" className={`view slide-${direction}`}>
              
              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  with: "100%"
                }} 
              >
                <Button
                  style={{
                    fontWeight: 'bold'
                  }}
                  className="btn-icon"
                  text="Agregar Implemento"
                  onClick={handleBack}
                >
                  <PlusCircleIcon
                    color="var(--color-tertiary)"
                  />
                </Button>
              </div>
              
              <ImplementListContainer 
                groupImplementId={groupImplementId}
              />
            </div>
          )}
        </div>
    </Modal>
  );
};

export default ImplementModalContainer;
