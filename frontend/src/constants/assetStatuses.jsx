// Definición de constantes para los estados
export const STATUS_AVAILABLE = 'available';
export const STATUS_BORROWED = 'borrowed';
export const STATUS_MAINTENANCE = 'maintenance';
export const STATUS_RETIRED = 'retired';

// Estructura de la lista de filtros (para la UI)
export const ASSET_STATUS_FILTERS = [
  {
    label: 'Disponible',
    value: STATUS_AVAILABLE,
  },
  {
    label: 'Prestado',
    value: STATUS_BORROWED,
  },
  {
    label: 'En Mantenimiento',
    value: STATUS_MAINTENANCE,
  },
  {
    label: 'Retirado',
    value: STATUS_RETIRED,
  }
];

// Opcional: Un mapa para búsqueda rápida
export const ASSET_STATUS_MAP = {
    [STATUS_AVAILABLE]: 'Disponible',
    [STATUS_BORROWED]: 'Prestado',
    [STATUS_MAINTENANCE]: 'En Mantenimiento',
    [STATUS_RETIRED]: 'Retirado',
};