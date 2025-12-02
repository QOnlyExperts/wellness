// ************************************************************
// Archivo: src/components/shared/Nav.jsx
// ************************************************************

import { useEffect, useState, useRef } from 'react';
import './Nav.css';
import { Link } from 'react-router-dom';

// Importar imágenes (asumiendo que las rutas son correctas)
import Logo from '../../assets/img/wellness-logo.png';
import LogoUcc from '../../assets/img/ucc.png';

// Componentes de Iconos (asumiendo que ConfigIcon existe)
import MenuListIcon from '../icons/MenuListIcon';
import ConfigIcon from '../icons/Config'; // Componente ficticio
import ProfileIcon from '../icons/ProfileIcon'; // Componente ficticio
import LogoutIcon from '../icons/LogoutProfileIcon'; // Componente ficticio
import LoginIcon from '../icons/AddIcon'; // Componente ficticio

const Nav = () => {
  // Estados de autenticación (los dejé en 'true' para probar el menú)
  const [logged, setLogged] = useState(true); 
  const [isAdmin, setIsAdmin] = useState(true); 

  // Estado para controlar la visibilidad del dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 💡 Referencia para apuntar al elemento del menú (ul)
  const dropdownRef = useRef(null); 

  // -----------------------------------------------------------------
  // Lógica de Autenticación (Mantener tu lógica original)
  // -----------------------------------------------------------------
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const userJson = sessionStorage.getItem('user');
    
    if (token) {
      setLogged(true);
      if (userJson) {
        const user = JSON.parse(userJson);
        // Ajusta esta lógica si el rol se maneja de forma diferente
        setIsAdmin(user.role === '1' || user.role === 1); 
      }
    } else {
      setLogged(false);
      setIsAdmin(false);
    }
  }, []);

  // -----------------------------------------------------------------
  // Lógica de CLICK-AWAY (Cerrar al hacer clic fuera)
  // -----------------------------------------------------------------
  useEffect(() => {
    function handleClickOutside(event) {
      // Si la referencia existe Y el clic no ocurrió dentro del menú
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    
    // Adjuntar el escuchador de eventos al documento
    document.addEventListener("mousedown", handleClickOutside);
    
    // Limpieza: Remover el escuchador cuando el componente se desmonte
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // El array vacío asegura que esto solo se ejecute una vez al montar

  // -----------------------------------------------------------------
  // Handlers
  // -----------------------------------------------------------------
  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setLogged(false);
    setIsAdmin(false);
    setIsDropdownOpen(false); // Cierra el menú al cerrar sesión
  };

  const toggleDropdown = () => {
    // 💡 Esta función se encarga de abrir y cerrar (toggle) al hacer clic
    setIsDropdownOpen(prev => !prev);
  };
  
  // Función para cerrar el dropdown si un enlace fue clickeado (navegación interna)
  const closeDropdown = () => {
      setIsDropdownOpen(false);
  };


  // -----------------------------------------------------------------
  // Renderizado
  // -----------------------------------------------------------------
  return (
    <div className="nav">
      <div className="menu2">
        <Link to="/" id="" className="navBar-logo">
          <img src={LogoUcc} alt="Logo" />
        </Link>
        <Link to="/" id="" className="navBar-logo-wellness">
          <img src={Logo} alt="Logo" />
        </Link>
      </div>

      <div className="menu">
        {/* 💡 ASIGNAR LA REFERENCIA aquí para que el useEffect pueda rastrear el área */}
        <ul ref={dropdownRef}> 
          
          {logged && (
            <li className="dropdown-container">
              {/* 💡 SÓLO USAMOS onClick para abrir/cerrar */}
              <a 
                title="Administración"
                className="dropdown-button"
                onClick={toggleDropdown} 
              >
                <MenuListIcon 
                  size={30}
                  color='#ffffff'
                />
              </a>

              {/* Contenido del Dropdown */}
              {isDropdownOpen && (
                <div className="dropdown-content">
                  
                  {/* Item 1: Perfil */}
                  <Link to="/profile" onClick={closeDropdown}>
                    <ProfileIcon color='#000000' size={20} /> Perfil
                  </Link>

                  {/* Item 2: Panel Admin (Solo si es admin) */}
                  {isAdmin && (
                    <Link to="/admin/group-implement" onClick={closeDropdown}>
                      <ConfigIcon size={20} /> Administración
                    </Link>
                  )}
                  
                  {/* Item 3: Cerrar Sesión */}
                  <Link to="/login" onClick={handleLogout}>
                    <LogoutIcon size={20} /> Salir
                  </Link>
                </div>
              )}
            </li>
          )}
          
          {/* Botón de Login (Visible si NO está logueado) */}
          {!logged && (
            <li>
              <Link to="/login" id="btn-login" title="Iniciar sesión">
                <LoginIcon size={30} color='#ffffff' />
              </Link>
            </li>
          )}

        </ul>
      </div>
    </div>
  );
};

export default Nav;