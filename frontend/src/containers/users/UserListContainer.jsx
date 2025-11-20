import React, { useEffect, useState } from "react";
import { useLoader } from "../../context/LoaderContext";
import { useUsers } from "../../hooks/useUsers";

import EditSquareIcon from "../../components/icons/EditSquareIcon";
import ReusableTable from "../../components/shared/ReusableTable";
import AlertContainer from "../shared/AlertContainer";
import Badge from "../../components/shared/Badge";

// Íconos e imports no utilizados directamente en el renderizado, pero mantenidos
import PlusCircleIcon from "../../components/icons/PlusCircleIcon"; 
import MenuListIcon from "../../components/icons/MenuListIcon";
import UserPermissionIcon from "../../components/icons/UserPermissionIcon";
import UserHistoryIcon from "../../components/icons/UserHistoryIcon";
import Head from "../../components/shared/Head";
// UserService y CheckboxList se mantienen por contexto, aunque no se usen directamente aquí.

// --- Componente Dropdown Simulado (Permisos) ---
const PermissionDropdown = ({ userId, onClose }) => {
  // Lista de permisos de ejemplo
  const permissions = [
    { id: 1, name: "Editar Roles" },
    { id: 2, name: "Suspender Cuenta" },
    { id: 3, name: "Ver Logs" },
  ];

  const handleAction = (permissionName) => {
    window.showAlert(`Aplicando permiso: ${permissionName} al Usuario ID: ${userId}`, "info");
    onClose();
  };

  return (
    <div 
      className="dropdown-menu" 
      style={{ 
        position: 'absolute', 
        zIndex: 10, 
        backgroundColor: 'white', 
        border: '1px solid #ccc', 
        borderRadius: '4px', 
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        minWidth: '150px',
        right: '10px', // Ajusta la posición para que esté a la derecha del botón
        top: '30px',   // Aparece debajo del botón
      }}
      onClick={(e) => e.stopPropagation()} // Evita que el clic cierre el menú inmediatamente
    >
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {permissions.map(perm => (
          <li 
            key={perm.id} 
            onClick={() => handleAction(perm.name)}
            style={{ 
              padding: '8px 12px', 
              cursor: 'pointer', 
              borderBottom: '1px solid #eee' 
            }}
            className="hover:bg-gray-100" // Simula un efecto hover
          >
            {perm.name}
          </li>
        ))}
      </ul>
    </div>
  );
};


// --- Componente Principal ---
const UserListContainer = ({ onEdit, refresh: refreshFlag }) => {
  const { userList, stats, loading, error, refresh } = useUsers();
  const { showLoader, hideLoader } = useLoader();

  // 💡 ESTADO CLAVE: Controla qué dropdown de permisos está abierto. 
  // Almacena el ID del usuario o null si ninguno está abierto.
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    if (refreshFlag) refresh();
  }, [refreshFlag, refresh]);

  // Función para manejar la acción de editar
  const handleEditClick = (id) => {
    if (onEdit) {
      onEdit(id); // Envía el id al componente padre
      setOpenDropdownId(null); // Cerrar cualquier dropdown abierto
    }
  };

  // 💡 NUEVA FUNCIÓN: Alternar el estado del dropdown de permisos
  const togglePermissionDropdown = (userId) => {
    // Si el dropdown actual es el mismo, lo cierra (lo establece en null)
    // Si es diferente o si no hay ninguno abierto, establece el nuevo ID.
    setOpenDropdownId(prevId => (prevId === userId ? null : userId));
  };

  // 💡 NUEVO EFECTO: Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdownId(null);
    };

    // Solo agregar el listener si hay un dropdown abierto
    if (openDropdownId !== null) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openDropdownId]);


  // --- Definición de Columnas y Estilos (Sin cambios importantes) ---
  const columnsHead = [
    { header: "Identificación", accessor: "identification" },
    { header: "Nombre Completo", accessor: "fullName" },
    { header: "Email", accessor: "email" },
    { header: "Rol", accessor: "rol" },
    { header: "Programa", accessor: "program" },
    { header: "Estado", accessor: "status" },
    { header: "Acciones", accessor: "actions" },
  ];

  const columns = [
    { accessor: "identification" },
    { accessor: "fullName" },
    { accessor: "email" },
    { accessor: "rol" },
    { accessor: "program" },
    { accessor: "status" },
    { accessor: "actions" },
  ];

  const columnStyles = [
    { width: "10%", overflow: "hidden" },
    { width: "20%", overflow: "hidden" },
    { width: "25%", overflow: "hidden" },
    { width: "10%", overflow: "hidden" },
    { width: "15%", overflow: "hidden" },
    { width: "10%", overflow: "hidden" },
    { width: "10%", overflow: "hidden" },
  ];

  // --- Función para Renderizar Contenido de Celda ---
  const renderCellContent = (column, user) => {
    if (column.accessor === "identification") {
      // Se utiliza el operador de encadenamiento opcional (?) para evitar errores
      return user.info_person?.identification || '-'; 
    }

    if (column.accessor === "fullName") {
      const { name1, name2, last_name1, last_name2 } = user.info_person || {};
      return `${name1 || ''} ${name2 || ""} ${last_name1 || ''} ${last_name2 || ""}`;
    }

    if (column.accessor === "rol") {
      return user.rol?.name || '-';
    }

    if (column.accessor === "program") {
      return user.info_person?.program?.name || '-';
    }

    if (column.accessor === "status") {
      const statusValue = user.is_active ? "active" : "inactive";

      return (
        <div style={{ display: "flex", justifyContent: "start", alignItems: "center", margin: "0" }}>
          <Badge value={statusValue} />
        </div>
      );
    }

    // 💡 ACCIONES CORREGIDAS CON DROPDOWN DE PERMISOS
    if (column.accessor === "actions") {
      const isDropdownOpen = openDropdownId === user.id;

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
            width: "100%",
            textAlign: "center",
            overflow: "visible", // CLAVE: Permitir que el dropdown se salga del contenedor de la celda
            position: 'relative', // CLAVE: Base para posicionar el dropdown absoluto
          }}
        >
          {/* Historial */}
          <button className="btn-icon" title="Historial de uso">
            <UserHistoryIcon size={24} color="var(--color-quinary)" className="hover:opacity-80" />
          </button>

          {/* Editar */}
          <button className="btn-icon" onClick={() => handleEditClick(user.id)} title="Editar Usuario">
            <EditSquareIcon size={24} color="var(--color-secondary)" className="hover:opacity-80" />
          </button>

          {/* Permisos con Dropdown */}
          <button
            className="btn-icon"
            onClick={(e) => {
              e.stopPropagation(); // Evita que el listener global cierre el menú al abrirlo
              togglePermissionDropdown(user.id);
            }}
            title="Permisos"
          >
            <UserPermissionIcon size={24} color="var(--color-primary)" className="hover:opacity-80" />
          </button>
          
          {/* Renderizado Condicional del Dropdown */}
          {isDropdownOpen && (
            <PermissionDropdown userId={user.id} onClose={() => setOpenDropdownId(null)} />
          )}
        </div>
      );
    }

    return user[column.accessor];
  };

  // Preparar los datos con las celdas renderizadas para la tabla
  const dataWithActions = userList.map((user) => ({
    ...user,
    identification: renderCellContent({ accessor: "identification" }, user),
    fullName: renderCellContent({ accessor: "fullName" }, user),
    email: renderCellContent({ accessor: "email" }, user),
    rol: renderCellContent({ accessor: "rol" }, user),
    program: renderCellContent({ accessor: "program" }, user),
    status: renderCellContent({ accessor: "status" }, user),
    actions: renderCellContent({ accessor: "actions" }, user),
  }));

  // Renderizar un indicador de carga si es necesario
  if (loading) {
      return <div>Cargando usuarios...</div>; 
  }

  if (error) {
      return <div>Error al cargar usuarios: {error}</div>; 
  }


  return (
    <>
      <AlertContainer />

      <ReusableTable
        columnsHead={columnsHead}
        columns={columns}
        data={dataWithActions}
        columnStyles={columnStyles}
      />
    </>
  );
};

export default UserListContainer;