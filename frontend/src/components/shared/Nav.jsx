import { useEffect, useState } from 'react';
import './Nav.css';

// import Logo from '../imgs/Logo-sf-nuevo-copia.png';
// import Cart from '../imgs/shopping-cart.svg';
// import Profile from '../imgs/profile.svg';
// import Panel from '../imgs/panel.svg';
// import Logout from '../imgs/logout.svg';
import { Link } from 'react-router-dom';

// import Logo from '../../assets/img/logo-sfn.png'
import Logo from '../../assets/img/wellness-logo.png'
import LogoUcc from '../../assets/img/ucc.png'
import ConfigIcon from '../icons/Config';


const Nav = () => {

  const [logged, setLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setLogged(false);
  };

  return (
    <div className="nav">
      <div className="menu2">
        <Link to="/" id="" className="navBar-logo">
          <img src={LogoUcc} alt="Logo" />
          {/* <span className="" id="">Bienestar</span> */}
        </Link>
        <Link to="/" id="" className="navBar-logo-wellness">
          <img src={Logo} alt="Logo" />
        </Link>
      </div>

      <div className="menu">

        <ul>
          <li>
            <Link to="/admin/dashboard" title="Administración">
              <ConfigIcon 
                size={30}
                color='#ffffff'
              />
            </Link>
          </li>
        {/* 
          {!logged && (
            <li>
              <Link to="/login" id="btn-login">Iniciar sesión</Link>
            </li>
          )}

          {logged && (
            <li>
              <Link to="/profile/security" id="profile" title="Perfil">
                <div className="icon"><img src={Profile} alt="Perfil" /></div>
              </Link>
            </li>
          )}

          {logged && isAdmin && (
            <li>
              <Link to="/admin/dashboard" id="config" title="Panel de administrador">
                <div className="icon"><img src={Panel} alt="Panel" /></div>
              </Link>
            </li>
          )}

          {logged && (
            <li>
              <Link id="logout" onClick={handleLogout} title="Salir">
                <div className="icon"><img src={Logout} alt="Salir" /></div>
              </Link>
            </li>
          )} */}
        </ul>
      </div>

    </div>
  );
};

export default Nav;
