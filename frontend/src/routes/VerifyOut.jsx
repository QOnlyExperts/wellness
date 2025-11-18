import {Navigate, Outlet} from 'react-router-dom';

export default function OutLogin(){

  const token = sessionStorage.getItem('token');

  return(
    token
    ? <Outlet/>
    : <Navigate to='/login'/>
  );
}