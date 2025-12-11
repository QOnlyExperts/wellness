// Definición de constantes para los estados
export const STATUS_REQUESTED = 'requested';
export const STATUS_ACCEPTED = 'accepted';
export const STATUS_REFUSED = 'refused';
export const STATUS_FINISHED = 'finished';

// Estructura de la lista de filtros (para la UI)
export const ASSET_STATUS_REQUEST_FILTERS = [
  {
    label: 'Solicitado',
    value: STATUS_REQUESTED,
  },
  {
    label: 'Aceptado',
    value: STATUS_ACCEPTED,
  },
  {
    label: 'Rechazado',
    value: STATUS_REFUSED,
  },
  {
    label: 'Finalizado',
    value: STATUS_FINISHED,
  }
];

// Opcional: Un mapa para búsqueda rápida
export const ASSET_STATUS_REQUEST_MAP = {
    [STATUS_REQUESTED]: 'Solicitado',
    [STATUS_ACCEPTED]: 'Aceptado',
    [STATUS_REFUSED]: 'Rechazado',
    [STATUS_FINISHED]: 'Finalizado',
};