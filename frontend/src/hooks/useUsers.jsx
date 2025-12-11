import { useEffect, useState } from "react";
// Importar servicios simulados para usuarios
import UserService from "../services/UserService"; 
import { useLoader } from "../context/LoaderContext";


export function useUsers() {
    const { showLoader, hideLoader } = useLoader(); 
    
    // Lista principal
    const [userList, setUserList] = useState([]); 
    
    // Estadísticas generales (roles eliminados)
    const [stats, setStats] = useState({ 
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        verifiedUsers: 0,
        unverifiedUsers: 0,
    });
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function fetchUsers() {
        showLoader();
        setLoading(true);
        setError(null);

        try {
            // 1. Simulación: Traemos todos los usuarios (Reemplazar con UserService.getUsers())
            const response = await UserService.getUsers();

            if (!response.success) {
                window.showAlert(response.error?.message, "Error");
                setUserList([]);
                hideLoader();
                setLoading(false);
                return;
            }

            const users = response.data;
            
            // 2. Cálculo de Estadísticas Generales
            const totalUsers = users.length;
            const activeUsers = users.filter(user => user.is_active).length;
            const inactiveUsers = totalUsers - activeUsers;
            const verifiedUsers = users.filter(user => user.is_verified).length;
            const unverifiedUsers = totalUsers - verifiedUsers;

            // 3. Actualización del Estado
            setUserList(users);
            setStats({
                totalUsers,
                activeUsers,
                inactiveUsers,
                verifiedUsers,
                unverifiedUsers,
            });

            setLoading(false);
            hideLoader();

        } catch (e) {
            setError(e.message || "Ocurrió un error inesperado al cargar datos de usuarios");
        } finally {
            hideLoader();
            setLoading(false);
        }
    }

    // Carga inicial de datos
    useEffect(() => {
        fetchUsers();
    }, []); 

    // 🔹 Retorna los datos y funciones para ser consumidos
    return { userList, stats, loading, error, refresh: fetchUsers };
}