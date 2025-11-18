import { Route, Routes } from 'react-router-dom';

// Importar los Layouts que contienen sus propias rutas
import { HomeLayout, AdminRoutes, UsersRoutes } from './routes/Layouts';

// Importar el componente de protección y las páginas externas
import OutLogin from './routes/VerifyOut'; 
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      
      {/* RUTAS PÚBLICAS */}
      <Route path='/login' element={<LoginPage />} />
      
      {/* 1. RUTA DE PROTECCIÓN (OutLogin) */}
      {/* Todas las rutas anidadas requieren autenticación */}
      <Route element={<OutLogin/>}>
        
        {/* 2. RUTAS PRINCIPALES PROTEGIDAS */}
        
        {/* RUTA HOME: Mapea la raíz (/) y sub-rutas no definidas debajo */}
        <Route path='/*' element={<HomeLayout />} />
        
        {/* RUTA ADMIN: Mapea /admin/* y carga AdminRoutes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        {/* RUTA PERFIL: Mapea /profile/* y carga UsersRoutes */}
        <Route path="/profile/*" element={<UsersRoutes />} />
        
      </Route>
      
      <Route path="*" element={<h1>404 | Página no encontrada</h1>} />
      
    </Routes>
  );
}

export default App;