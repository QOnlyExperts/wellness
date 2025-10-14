// -- src/application/ports/IImplementCounterPort.ts --

export interface IImplementCounterPort {
  /**
   * Obtiene el siguiente número consecutivo basado en un prefijo dado.
   * @param prefix El prefijo de la entidad (ej. 'GRP').
   * @returns El siguiente número (ej. 001, 002, etc.) o undefined si no se encuentra.
   */
  getNextNumber(prefix: string): Promise<number | undefined>;
}