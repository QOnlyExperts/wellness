import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useLoader } from "../context/LoaderContext";

const apiUrl = import.meta.env.VITE_API_URL;

export default function OutLogin() {
  const [authenticated, setAuthenticated] = useState(null);

  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    // showLoader();

    fetch(`${apiUrl}/api/v1/auth/validate-token`, {
      method: "GET",
      credentials: "include", // envía cookies
    })
      .then(res => res.json())
      .then(data => {
        setAuthenticated(data.success); // true si token válido
      })
      .catch(() => setAuthenticated(false))
      // .finally(() => hideLoader());
  }, []);

  if (authenticated === null) return <div>Cargando...</div>;

  return authenticated ? <Outlet /> : <Navigate to="/login" />;
}
