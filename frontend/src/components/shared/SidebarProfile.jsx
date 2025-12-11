import React from "react";
import { NavLink } from "react-router-dom";

import HomeIcon from "../icons/HomeIcon";
import ProfileIcon from "../icons/ProfileIcon";
import ConfigIcon from "../icons/Config";
import LogoutIcon from "../icons/LogoutProfileIcon"

import "./SidebarProfile.css";

const SidebarProfile = () => {
  const items = [
    { label: "Inicio", path: "/", icon: <HomeIcon color="#000000" /> },
    { label: "Perfil", path: "/profile", icon: <ProfileIcon color="#ffffff" /> },
    // { label: "Configuración", path: "/profile/security", icon: <ConfigIcon color="#000000" /> },
    // { label: "Cuenta", path: "/profile/account", icon: <ProfileIcon color="#000000" /> },
    // { label: "Salir", path: "/logout", icon: <LogoutIcon color="#ffffff" />, isDanger: true },
  ];

  return (
    <div className="sidebar-profile">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `item 
            ${isActive ? "active" : ""} 
            ${item.isDanger ? "danger" : ""}`
          }
        >
          <span className="icon">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
};

export default SidebarProfile;
