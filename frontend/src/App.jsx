
import {  Route, Routes } from 'react-router-dom';

import SideBar from './components/shared/SideBar';

import GroupImplementPage from './pages/group-implement/GroupImplementPage';

function AdminRoutes() {
  return ( 
    <div className='principal-admin'>
      <SideBar />
      <Routes>
        <Route path="/group-implement" element={<GroupImplementPage />} />

        {/* Otras rutas del panel administrativo */}
      </Routes>
    </div>
  );
}

function UsersRoutes() {
  return (
    <>
      <div className='principal'>
      <Nav />
        <div className="div-principal-profile-all">
          <SidebarProfile />
          <Routes>
            {/* <Route path="/:gender" element={<ProductDetails />} /> */}
            {/* <Route path="/security" element={<UserProfilePage />} />
            <Route path="/addresses" element={<UserProfileAddressPage />} /> */}
            {/* <Route path="/addresses/register" element={<UserProfileAddressPage />} /> */}
            {/* <Route path="/addresses/register/:id" element={<UserProfileAddressRegisterPage />} /> */}

            {/* Otras rutas del panel administrativo */}
          </Routes>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    // <ErrorProvider>
      // <Router>
        <Routes>
          {/* Rutas panel administrativo */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          {/* <Route  path='/profile/*' element={<UsersRoutes />}/> */}

          {/* <Route path='/*' element={<HomeRoutes />} />
          <Route path='/login' element={<Login />} />
          <Route path='/verify' element={<Verify />} /> */}
          
          {/* Otras rutas */}
          <Route path="*" element={'No se encontró la página'} />
          
        </Routes>
      // </Router>
    // {/* </ErrorProvider> */}
  );
}

export default App;