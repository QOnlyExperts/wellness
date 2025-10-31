import { useEffect, useState } from 'react'; 
import { Link, useNavigate, useLocation } from 'react-router-dom';

import './sidebar.css'
import Arrow from '../../assets/arrow.svg';
import Home from '../../assets/home.svg';
import Dashboard from '../../assets/dashboard.svg';
import Group from '../../assets/groupImplements.svg';

import Logo from '../../assets/img/logo-sfn.png'
import HomeIcon from '../icons/HomeIcon';
import DashboardIcon from '../icons/DashboardIcon';
import GamingIcon from '../icons/GAmingIcon';
import Badge from './Badge';


const SideBar = () =>{

  // const [user, setUser] = useState(() => {
  //   const user = JSON.parse(localStorage.getItem('user'))
    
  //   const parts = user.user.split('@');
  //   const maskedUsername = parts[0].slice(0, 3) + '***' + parts[0].slice(-3);
  //   const email = maskedUsername + '@' + parts[1];
  //   user.user = email
  //   console.log(user)
  //   return user
  // })

  const statusImplement = [
    {label: 'available', labelSpanish: 'Disponible', to: '/admin/implement/available'},
    {label: 'borrowed', labelSpanish: 'Prestado', to: '/admin/implement/borrowed'},
    {label: 'maintenance', labelSpanish: 'Mantenimiento', to: '/admin/implement/maintenance'},
    {label: 'retired', labelSpanish: 'Retirado', to: '/admin/implement/retired'}
  ]

  const navigate = useNavigate();
  const location = useLocation();  // Inicializar el estado con el valor almacenado en local storage, o false si no existe
  const [isActive, setIsActive] = useState(() => {
    const savedState = localStorage.getItem('isSidebarActive');
    return savedState !== null ? JSON.parse(savedState) : false;
  });

  const [openImplementStatusConfig, setOpenPImplementStatusConfig] = useState(false);

  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    // Añadir o quitar la clase 'active' al body según el estado actual
    if (isActive) {
      document.body.classList.add('active');
    } else {
      document.body.classList.remove('active');
    }
    // Almacenar el estado actual en local storage
    localStorage.setItem('isSidebarActive', JSON.stringify(isActive));
  }, [isActive]);

  useEffect(() => {
    const currentUrl = location.pathname;
    const navItems = document.querySelectorAll(".link");
    const tabItems = document.querySelectorAll(".btn-link");

    navItems.forEach(function(item) {
      if (item.getAttribute('href') === currentUrl) {
        localStorage.setItem('lastUrl', currentUrl);
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    tabItems.forEach(function(item) {
      if (item.getAttribute('href') === currentUrl) {
        item.classList.add("btn-link-active");

        navItems.forEach(function(navItem) {
          const lastUrl = localStorage.getItem('lastUrl');
          if (navItem.getAttribute('href') === lastUrl) {
            navItem.classList.add("active");
          } else {
            navItem.classList.remove("active");
          }
        });
      } else {
        item.classList.remove("btn-link-active");
      }
    });
  }, [location]);

  const handleLogout = () => {
    
    localStorage.removeItem('user');
    navigate('/')
  }

  const viewImplementStatusConfig = () =>{
    if(openImplementStatusConfig){
      
      setOpenPImplementStatusConfig(false)
    }else{
      setOpenPImplementStatusConfig(true)
    }
  }

  const viewProductConfig = () => {
    const subLink = document.querySelector("#openProductConfig");
    // Si el item de configuraciones de producto esta activo lo desactiva 
    // De lo contrario lo activa
    if(openProductConfig){
      setOpenProductConfig(false);
      // subLink.classList.remove('active');

    }else{
      setOpenProductConfig(true);
      // subLink.classList.add('active');
      
    }
  }

  return(
    <>
      <nav className='side'>
        <div className="sidebar-header">
          <Link className="logo-wrapper" to='/'>
            <img src={Logo} alt="Logo" />
            {/* <span>Bienestar</span> */}
          </Link>

          <button className="toggle-btn" onClick={toggleActiveClass}>
            <img src={Arrow} alt="expand button"/>
          </button>
        </div>

        <div className="sidebar-links">
          <Link className="link" to="/" title="Inicio">
            <HomeIcon 
              color='#ffffff'
            />
            <span className="hidden">Inicio</span>
          </Link>

          <Link className="link" to="/admin/dashboard" title="Dashboard">
            <DashboardIcon
              color='#ffffff'
            />
            <span className="hidden">Dashboard</span>
          </Link>

          
          <Link className="link" 
            id='openImplementStatusConfig'
            to="/admin/group-implement"
            onClick={() => viewImplementStatusConfig()}
          >
            <GamingIcon
              color='#ffffff'
            />
            <span className="hidden">Grupo de implementos</span>
          </Link>
          {
            // Si openImplementStatusConfig es true se muestra el sub-link
            // De lo contrario no muestra nada.
            openImplementStatusConfig &&
            <div className='sub-link'>
              <h5
                style={{
                  borderBottom: '1px solid #ffffffff',
                  padding: '5px 10px'
                }}
              >Estados de implementos</h5>
              {
                statusImplement.map(status => (
                  <Link className='link' to={status.to} title=''>
                    {/* <span className="hidden">{status.labelSpanish}</span> */}
                    <Badge
                      style={{
                        
                      }}
                      label={status.label}
                      value={status.label}
                    />
                  </Link>
                ))
              }
            </div>
          }
{/*           
          <Link className="link" to="/admin/product" title="Producto">
            <img src={ProductoConfig} alt=""/>
            <span className="hidden">Producto</span>
          </Link>
          <Link className="link" to="/admin/product" title="Producto">
            <img src={ProductoConfig} alt=""/>
            <span className="hidden">Producto</span>
          </Link> */}


        </div>
        

        {/* <div className="sidebar-bottom">
          <div className="sidebar-links">
            <Link className="link" to="/admin/config" title="Configuración">
              <img src={Config} alt=""/>
              <span className="hidden">Configuración</span>
            </Link>
            
            <button className="link" onClick={handleLogout} title="Salir">
              <img src={Logout} alt=""/>
              <span className="hidden">Salir</span>
            </button>
          </div>

          <Link className="user-profile" to='/profile/security'>
            <div className="user-avatar">
                <img src={Profile} alt=""/>
            </div>

            <div className="user-details hidden">
              <p className="user-rol">{user.TypeAdministration}</p>
              <p className="user-email">{user.user}</p>
            </div>
          </Link>
        </div> */}
      </nav>
        
    </>
  )
};

export default SideBar;