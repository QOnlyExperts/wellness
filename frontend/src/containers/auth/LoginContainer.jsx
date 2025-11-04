import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import InputField from "../../components/shared/Inputfield";
// import Logo from '../../assets/img/logo-sfn.png'
import Logo from '../../assets/img/wellness-logo.png'
import Slogan from '../../components/shared/SLogan';


const LoginContainer = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');


  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  
  const handleShowNotification = (success, message) => {
    setSuccess(success);
    setMessage(message)
    setNotification(true);
    // Desactivar la notificación después de 5 segundos
    setTimeout(() => {
      setNotification(false);
    }, 2500);
  };

  
  const handleSubmit = async(e) => {
    e.preventDefault();

    const otherErrors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!user || user === '' || typeof user !== 'string' || !emailRegex.test(user)) {
      otherErrors.push({ path: 'userLogin', message: 'El email tiene que ser valido. ejemplo@campusucc.edu.co' });
    }

    if (!password || password === '') {
      otherErrors.push({path: 'password', message: 'La contraseña no puede ser vacía'});
    }

    console.log(otherErrors)
    if(otherErrors.length){
      setErrors(otherErrors);
      return
    }

    const formData = {
      'userLogin': user,
      'password': password
    }

    setIsLoading(true);

    const response = await UserServices.login(formData);

    if(response.errors){
      setErrors(response.errors);
    }
    setErrors([]);

    setIsLoading(false);
    handleShowNotification(response.success, response.message);

    if(response.success){
      // console.log(response.res)
      localStorage.setItem('user', JSON.stringify(response.res));
      localStorage.setItem('token', response.token)
      setTimeout(() => {
        navigate('/');
      }, 2500)
    }


  }

  return (
    <div className="div-login">
      {/* <section className='slogan'>
        <h1>Activa tu ritmo, renueva tu energía</h1>
        <h1>Movimiento, música y mente en sintonía</h1>
        <h1>Recuerda que bienestar siempre te acompaña</h1>
      </section> */}
      <Slogan/>
      {/* <Link to="/" className="div-img">
        <img src={Logo} />
      </Link> */}

      <form onSubmit={handleSubmit} className="login-form ">
        {/* <Link to="/" id="home" title="Inicio">
          <img src={Logo} />
        </Link> */}


        <div id="alert">
          <h6 id="alert-message"></h6>
        </div>
        <Link to='/' className="div-img">
          <img src={Logo}/>
        </Link>
        <h2>Inicio de sesión</h2>
        <InputField
          id={"userLogin"}
          label="Correo institucional"
          name={"userLogin"}
          type={"text"}
          value={user}
          placeholder={"Correo"}
          onChange={(e) => setUser(e.target.value)}
          errors={errors}
        />
        <InputField
          id={"password"}
          label="Contraseña"
          name={"password"}
          type={"password"}
          value={password}
          placeholder={"Contraseña"}
          onChange={(e) => setPassword(e.target.value)}
          errors={errors}
        />
        {/* <div style={{marginTop:'30px'}}> */}
        <button
          className="btn-login"
          id="btn-login"
          type="submit"
          onClick={handleSubmit}
        >
          Iniciar sesión
        </button>
        {/* <button className="btn-register" id="btn-register" type="button" onClick={() => openModalWithComponent(RegisterFormContainer)}>Crear cuenta</button> */}
        {/* </div> */}
      </form>
    </div>
  );
}


export default LoginContainer;