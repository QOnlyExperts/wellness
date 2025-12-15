import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { hasNoXSSAndInjectionSql, onlyLettersRegex } from '../../utils/validations';

import InputField from "../../components/shared/InputField";
// import Logo from '../../assets/img/logo-sfn.png'
import Logo from '../../assets/img/wellness-logo.png'
import Slogan from '../../components/shared/SLogan';
import Button from '../../components/shared/Button';
import LoaderIcon from '../../components/icons/LoaderIcon';
import Head from '../../components/shared/Head';
import '../../components/shared/SelectBox.css';
import Modal from '../../components/shared/Modal';

import UserService from '../../services/UserService';
import ProgramService from '../../services/ProgramService';
import AlertContainer from '../shared/AlertContainer';
import LoginService from '../../services/LoginService';


const LoginContainer = ({ onRegister }) => {
  const [programs, setPrograms] = useState([]);

  const [selects, setSelects] = useState({
    program: '',
    idProgram: 0,
  })

  const[isOpenModal, setIsOpenModal] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  }

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [view, setView] = useState('first'); // 'login' | 'register'
  const [direction, setDirection] = useState("none");

  
  const pswdInfoRef = useRef(null);
  const pswdConfInfoRef = useRef(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name1: "",
    name2: "",
    last_name1: "",
    last_name2: "",
    identification: "",
    number_phone: "",
  });

  const [validations, setValidations] = useState({
    length: false,
    letter: false,
    capital: false,
    number: false,
    match: false,
    blank: false,
  });
  
  const validatePassword = () => {
    const noValido = / /;
    setValidations({
      length: form.password.length >= 8,
      letter: /[A-z]/.test(form.password),
      capital: /[A-Z]/.test(form.password),
      number: /\d/.test(form.password),
      match: form.password && form.confirmPassword && form.password === form.confirmPassword,
      blank: form.password && !noValido.test(form.password),
    });
  };
  
  useEffect(() => {
    validatePassword();
  }, [form.password, form.confirmPassword]);

  useEffect(() => {
    // Aquí puedes cargar las ciudades desde un servicio o definirlas estáticamente
    const fetchPrograms = async () => {
      try {
        const response = await ProgramService.getPrograms();
        if(response.errors){
          console.error('Error fetching programs:', response.errors);
          return;
        }

        setPrograms(response.data);
      }
      catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchPrograms();
  }, []);



  // Inicio de sesion
  const handleBack = () => {

    // Solo limpiamos si venimos de la vista de credenciales
      // La persona acepta cancelar el registro
        // Limpiamos los datos del formulario
        setForm({
          email: "",
          password: "",
          confirmPassword: "",
          name1: "",
          name2: "",
          last_name1: "",
          last_name2: "",
          identification: "",
          number_phone: "",
        });

        setSelects({
          program: '',
          idProgram: 0,
        })

        // Limpiamos los errores
        setErrors([]);

        // Mostramos la vista del login
        setDirection("to-right");
        setView("first");
  };

  // A credenciales
  // Validamos credenciales
  const handleNext = (e, to) => {
    e.preventDefault();

    setDirection(to);
    setView("second");
  };

  // A información personal
  // Aquí se valida la información de credenciales
  const handleFinish = (e) => {
    e.preventDefault();
    
    let otherErrors = [];

    if (!form.name1 || form.name1.trim() === '' || hasNoXSSAndInjectionSql(form.name1) || !onlyLettersRegex(form.name1)) {
      otherErrors.push({ path: 'name1', message: 'El primer nombre debe contener solo letras y no debe estar vacío' });
    }
  
    if (form.name2 || hasNoXSSAndInjectionSql(form.name2)) {
      otherErrors.push({ path: 'name2', message: 'El segundo nombre debe contener solo letras' });
    }
  
    if (!form.last_name1 || form.last_name1.trim() === '' || hasNoXSSAndInjectionSql(form.last_name1) || !onlyLettersRegex(form.last_name1)) {
      otherErrors.push({ path: 'last_name1', message: 'El primer apellido debe contener solo letras y no debe estar vacío' });
    }
  
    if (!form.last_name2 || form.last_name2.trim() === '' || hasNoXSSAndInjectionSql(form.last_name2) || !onlyLettersRegex(form.last_name2)) {
      otherErrors.push({ path: 'last_name2', message: 'El segundo apellido debe contener solo letras y no deber estar vacío' });
    }
  
    if (!form.identification || form.identification.trim() === "" || !/^\d+$/.test(form.identification) || form.identification.length !== 10) {
      otherErrors.push({ path: 'identification', message: 'El número de teléfono debe contener exactamente 10 dígitos y solo números' });
    }

    if(otherErrors.length){
      setErrors(otherErrors);
      return;
    }
    
    otherErrors = [];
    setErrors([]);
    setDirection("to-left");
    setView("third");
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

 // Para los selects options
  const handleSelectOptionClick = (id) => {
    const selectBox = document.getElementById(id);
    selectBox.classList.toggle('active');
  };

  // Modifica los datos de ids
  const handleOptionClick = (field, text, value) => {
    const fieldText = field.charAt(0).toUpperCase() + field.slice(1).toLowerCase();
    setSelects((prevData) => ({
      ...prevData,
      [field]: text,
      [`id${fieldText}`]: value,
    }));
    const selectBox = document.getElementById(`select-box-${field}`);
    selectBox.classList.remove('active');
  };
  
  const handleSubmit = async(e) => {
    e.preventDefault();

    let otherErrors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const allowedDomain = "@campusucc.edu.co";

    if (
      !form.email ||
      form.email === "" ||
      typeof form.email !== "string" ||
      !emailRegex.test(form.email) ||
      !form.email.endsWith(allowedDomain)
    ) {
      otherErrors.push({
        path: "email",
        message: "El email tiene que ser valido. ejemplo@campusucc.edu.co",
      });
    }

    if (!form.password || form.password === "") {
      otherErrors.push({
        path: "password",
        message: "La contraseña no puede ser vacía",
      });
    }

    if (otherErrors.length) {
      setErrors(otherErrors);
      return;
    }

    const formData = {
      email: form.email,
      password: form.password,
    };

    setIsLoading(true);

    const response = await LoginService.postLogin(formData);

    if (!response.success) {
      window.showAlert(response.error.message, "error");
      setIsLoading(false);
      setErrors(response.errors || []);
      return;
    }

    window.showAlert(response.message, "success");
    setIsLoading(false);

    otherErrors = [];
    setErrors([]);
    
    // console.log(response.res)
    sessionStorage.setItem("data", JSON.stringify(response.data));
    sessionStorage.setItem("token", response.data.token);
    setTimeout(() => {
      navigate("/");
    }, 2500);
  }

  const handleRegister = async(e) => {
    e.preventDefault();
    
    let otherErrors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const allowedDomain = "@campusucc.edu.co";

    if (!form.email || form.email === '' || typeof form.email !== 'string' || !emailRegex.test(form.email) || !form.email.endsWith(allowedDomain)) {
      otherErrors.push({ path: 'email', message: 'El email tiene que ser valido. ejemplo@campusucc.edu.co' });
    }
    
    if (!form.password || form.password.trim() === "" || hasNoXSSAndInjectionSql(form.password) || form.password.length < 8 || form.password.length > 16) {
      otherErrors.push({ path: 'password', message: 'La contraseña debe tener entre 8 y 16 caracteres validos' });
    }
    
    if (!form.confirmPassword || form.confirmPassword.trim() === "" || hasNoXSSAndInjectionSql(form.confirmPassword) || form.confirmPassword.length < 8 || form.confirmPassword.length > 16) {
      otherErrors.push({ path: 'confirmPassword', message: 'Debe coincidir con la contraseña' });
    }

    if(selects.idProgram === 0){
      otherErrors.push({ path: 'idProgram', message: 'Debe seleccionar un programa' });
    }
      
    const phoneRegex = /^3\d{9}$/; // Valido solo números de celular colombianos

    if (
      !form.number_phone ||
      typeof form.number_phone !== 'string' ||
      !phoneRegex.test(form.number_phone)
    ) {
      otherErrors.push({
        path: 'number_phone',
        message: 'Debe ingresar un número de celular colombiano válido (10 dígitos y empieza en 3).'
      });
    }

    if(otherErrors.length){
      setErrors(otherErrors);
      return;
    }

    const formData = {
      ...form,
      program_id: selects.idProgram
    }

    const response = await UserService.postUser(formData);

    if(!response.success){
      window.showAlert(response.error.message, "error");
      setErrors(response.errors || []);
      return;
    }
    
    window.showAlert(response.message, "success")
    otherErrors = [];
    setErrors([]);

    setTimeout(() => {
      if(response.success){
        // Regresamos al login
        handleBack();
      }
    }, 2000);

  }

  return (
    <div className="div-login">

      { isOpenModal && (
        <Modal
          title="Mensaje"
          onClose={handleCloseModal}
        >

          <p>¿Está seguro de que desea cancelar el registro? <strong>Se perderán los datos ingresados</strong>.</p>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginTop:'20px'
          }}>
            <Button
              className="btn-icon"
              text="Cancelar"
              onClick={(e) => {
                e.preventDefault();
                // Cerramos el modal
                handleCloseModal();
              }}
            />
            <Button
              className="btn-icon"
              text="Aceptar"
              onClick={(e) => {
                e.preventDefault();
                // Cerramos el modal
                handleCloseModal();
                // Regresamos a la vista de inicio
                handleBack();
              }}
            />
          </div>

        </Modal>
      )}

      {/* <section className='slogan'>
        <h1>Activa tu ritmo, renueva tu energía</h1>
        <h1>Movimiento, música y mente en sintonía</h1>
        <h1>Recuerda que bienestar siempre te acompaña</h1>
      </section> */}
      <Slogan/>
      {/* <Link to="/" className="div-img">
        <img src={Logo} />
      </Link> */}

      <form className="login-form ">
        {/* <Link to="/" id="home" title="Inicio">
          <img src={Logo} />
        </Link> */}


        <div id="alert">
          <h6 id="alert-message"></h6>
        </div>
        
        <AlertContainer />
        <div className='view-wrapper-login'>

          { view === 'first' && (
            <div key="first" className={`login-form-login slide-${direction}`}>
              <div className="div-img">
                <img src={Logo}/>
              </div>
              <h2>Inicio de sesión</h2>
              <InputField
                id="email"
                name="email"
                label="Correo"
                type="email"
                placeholder="example@campusucc.edu.co"
                value={form.email}
                onChange={handleInputChange}
                errors={errors}
              />
              <InputField
                id="password"
                name="password"
                label="Contraseña"
                type="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleInputChange}
                errors={errors}
              />
              {/* <div style={{marginTop:'30px'}}> */}

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                marginTop:'20px',
                gap: '10px'
              }}>
                <Button
                  className={`btn-${isLoading ? 'icon' : 'login'}`}
                  text={isLoading ? "": "Iniciar sesión"}
                  id="btn-login"
                  disabled={isLoading}
                  onClick={handleSubmit}
                >
                  {
                    isLoading &&
                    <LoaderIcon color="var(--color-primary)" />
                  }
                </Button>

                <Button
                  className="btn-icon"
                  text="Registrarse"
                  onClick={(e) => handleNext(e, "to-left")}
                />
              </div>
            </div>
          )}

          { view === 'third' && (
            <div key="third" className={`login-form-login slide-${direction}`}>
              <Head title="Registro de usuario" subTitle="Completa los siguientes campos para crear tu cuenta"/>
              {/* <RegisterContainer onLogin={() => setView('login')}/> */}
              <InputField
                id="email"
                name="email"
                label="Correo"
                type="text"
                placeholder="example@campusucc.edu.co"
                value={form.email}
                onChange={handleInputChange}
                errors={errors}
              />

              <InputField
                id="password"
                name="password"
                label="Contraseña"
                type="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleInputChange}
                onFocus={() => pswdInfoRef.current.style.display = 'block'}
                onBlur={() => pswdInfoRef.current.style.display = 'none'}
                errors={errors}
              />
              
              <div id="pswd_info" ref={pswdInfoRef} style={{ display: 'none' }}>
                <ul>
                  <li id="length" className={validations.length ? 'valid' : 'invalid'}>
                    Longitud mínima de 8 caracteres
                  </li>
                  <li id="letter" className={validations.letter ? 'valid' : 'invalid'}>
                    Contiene al menos una letra
                  </li>
                  <li id="capital" className={validations.capital ? 'valid' : 'invalid'}>
                    Contiene al menos una letra mayúscula
                  </li>
                  <li id="number" className={validations.number ? 'valid' : 'invalid'}>
                    Contiene al menos un número
                  </li>
                  <li id="blank" className={validations.blank ? 'valid' : 'invalid'}>
                    Sin espacios en blanco
                  </li>
                </ul>
              </div>

              <InputField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirmar contraseña"
                type="password"
                placeholder="Confirmar contraseña"
                value={form.confirmPassword}
                onChange={handleInputChange}
                onFocus={() => pswdConfInfoRef.current.style.display = 'block'}
                onBlur={() => pswdConfInfoRef.current.style.display = 'none'}
                errors={errors}
              />
              
              <div id="pswd_info" ref={pswdConfInfoRef} style={{ display: 'none' }}>
                <ul>
                  <li id="match" className={validations.match ? 'valid' : 'invalid'}>
                    Las contraseñas coinciden
                  </li>
                </ul>
              </div>

              <div className="select-box" id="select-box-program">
                <div className="select-option" id="select-option-program" onClick={() => handleSelectOptionClick('select-box-program')}>
                  <InputField id={'idProgram'} name={'idProgram'} label={'Programas'} type={'text'} placeholder="Selecciona tu programa" value={selects.program} errors={errors} />
                  
                </div>

                <div className="content">
                  <ul className="options" id="optionsProgram">
                    {
                      programs.map((program) => (
                        <li key={program.id} onClick={() => handleOptionClick('program', program.name, program.id)}>
                          {program.name}
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>

              <InputField
                id="number_phone"
                name="number_phone"
                label="Número de celular"
                type="text"
                placeholder="Numero de celular"
                value={form.number_phone}
                onChange={handleInputChange}
                errors={errors}
              />

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                marginTop:'20px'
              }}>
                <Button className="btn-icon" text="Atrás" onClick={(e) => handleNext(e, "to-right")} />
                <Button className="btn-icon" text="Registrarme" onClick={handleRegister} />
              </div>

            </div>
          )}

          { view === 'second' && (
            <div key="second" className={`login-form-login slide-${direction}`}>
              <AlertContainer />
              <Head title="Registro de usuario" subTitle="Completa los siguientes campos para crear tu cuenta"/>

              <InputField
                id="name1"
                name="name1"
                label="Primer nombre"
                type="text"
                placeholder="Primer nombre"
                value={form.name1}
                onChange={handleInputChange}
                errors={errors}
              />

              <InputField
                id="name2"
                name="name2"
                label="Segundo nombre"
                type="text"
                placeholder="Segundo nombre"
                value={form.name2}
                onChange={handleInputChange}
                errors={errors}
              />

              <InputField
                id="last_name1"
                name="last_name1"
                label="Primer apellido"
                type="text"
                placeholder="Primer apellido"
                value={form.lastName1}
                onChange={handleInputChange}
                errors={errors}
              />

              <InputField
                id="last_name2"
                name="last_name2"
                label="Segundo apellido"
                type="text"
                placeholder="Segundo apellido"
                value={form.lastName2}
                onChange={handleInputChange}
                errors={errors}
              />
              

              <InputField
                id="identification"
                name="identification"
                label="Identificación"
                type="text"
                placeholder="Identificación"
                value={form.identification}
                onChange={handleInputChange}
                errors={errors}
              />

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                marginTop:'20px'
              }}>
                <Button className="btn-icon" text="Inicio de sesión" 
                  onClick={() => {
                    
                    // Mostramos la ventana de confirmación
                    if(!isOpenModal){
                      handleOpenModal(); // True
                      // Finaliza
                      return;
                    }
                  }} 
                />
                <Button className="btn-icon" text="Siguiente" onClick={handleFinish} />
              </div>
            </div>
          )}
        
        </div>
      </form>
    </div>
  );
}


export default LoginContainer;