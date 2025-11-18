import { Route, Routes, Outlet } from 'react-router-dom';

import Nav from '../components/shared/Nav';
import SideBar from '../components/shared/SideBar';
import Sidebar from '../components/shared/SideBar'; // Componente ficticio

import HomePage from '../pages/HomePage';
import GroupImplementPage from '../pages/group-implement/GroupImplementPage';
import ImplementPage from '../pages/implements/ImplementPage';

// Rutas de Perfil (Ficticias)
// import UserProfilePage from '../pages/profile/UserProfilePage';
// import UserProfileAddressPage from '../pages/profile/UserProfileAddressPage';


// ----------------------------------------------------
// 1. HomeLayout (Para rutas de contenido principal: /)
// ----------------------------------------------------
export function HomeLayout() {
  return (
    <div className='principal'>
      <Nav /> 
      {/* 💡 Aquí definimos las rutas que irán bajo este Layout */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Otras rutas de contenido principal irían aquí, por ejemplo: */}
        {/* <Route path="/about" element={<AboutPage />} /> */}
        <Route path="*" element={<h1>404 | Contenido Principal no encontrado</h1>} />
      </Routes>
    </div>
  );
}

// ----------------------------------------------------
// 2. AdminRoutes (Para rutas de /admin/*)
// ----------------------------------------------------
export function AdminRoutes() {
  return ( 
    <div className='principal-admin'>
      <SideBar />
      {/* 💡 Las rutas de administración se definen aquí */}
      <Routes>
        {/* Usamos path relativo (sin el /admin) */}
        <Route path="group-implement" element={<GroupImplementPage />} />
        <Route path="implement/status/:status" element={<ImplementPage />} />
        {/* Ruta índice o redirección del /admin */}
        <Route index element={<GroupImplementPage />} /> 
        <Route path="*" element={<h1>404 | Página Admin no encontrada</h1>} />
      </Routes>
    </div>
  );
}

// ----------------------------------------------------
// 3. UsersRoutes (Para rutas de /profile/*)
// ----------------------------------------------------
export function UsersRoutes() {
  return (
    <div className='principal'>
      <Nav />
      <div className="div-principal-profile-all">
        <Sidebar />
        {/* 💡 Las rutas de perfil se definen aquí */}
        <Routes>
          {/* Usamos path relativo (sin el /profile) */}
          <Route path="security" element={<div>Página de Seguridad</div>} />
          <Route path="addresses" element={<div>Página de Direcciones</div>} />
          <Route index element={<div>Página Principal del Perfil</div>} />
          <Route path="*" element={<h1>404 | Página de Perfil no encontrada</h1>} />
        </Routes>
      </div>
    </div>
  );
}