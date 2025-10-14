// -- src/application/ports/IImplementCounterPort.ts --

export interface IImplementCounterPort {
  /**
   * Obtiene el siguiente número consecutivo basado en un prefijo dado.
   * @param prefix El prefijo de la entidad (ej. 'GRP').
   * @returns El siguiente número (ej. 001, 002, etc.).
   */
  getNextNumber(prefix: string): Promise<number>;
}