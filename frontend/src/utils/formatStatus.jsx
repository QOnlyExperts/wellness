

export const translateStatus = (value) => {

  const translateSpanish = (value) => {
    switch (value) {
      case "all":
        return "Todos";
      // Estados de implementos
      case "available":
        return "Disponible";
      case "maintenance":
        return "Reparación";
      case "retired":
        return "Retirado";
      case "borrowed":
        return "Prestado";
      case "is_verified":
        return "Verificado";
      case "no_verified":
        return "No Verificado";
        
      case "inactive":
        return "Inactivo";
      case "active":
        return "Activo";
        
      case "requested":
        return "Solicitado";
      case "accepted":
        return "Aceptado";
      case "refused":
        return "Rechazado"
      case "finished":
        return "Finalizado";


      // Condiciones de implementos
      case "new":
        return "Nuevo";

      default:
        return "default";
    }
  };

  const spanish = translateSpanish(value);

  return spanish
};
