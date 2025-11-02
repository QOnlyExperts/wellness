

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
