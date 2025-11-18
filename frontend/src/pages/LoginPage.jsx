import { useState } from 'react';
import LoginContainer from '../containers/auth/LoginContainer';
import './LoginPage.css'
import RegisterModalContainer from '../containers/login/RegisterModalContainer';


const LoginPage = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return(
    <>
      <div className="div-login-form">
        <LoginContainer onRegister={handleOpenModal}/>
      </div>

      {/* Modal de Registro de usuario */}
      {isModalOpen && (
        <RegisterModalContainer
          onClose={handleCloseModal}
        />
      )}
    </>
  )
};

export default LoginPage;