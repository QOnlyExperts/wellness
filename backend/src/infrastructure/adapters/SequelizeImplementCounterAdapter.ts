import { Op } from "sequelize";

import { ImplementModel } from "../models/IndexModel";
import { IImplementCounterPort } from "../../application/ports/IImplementCounterPort";
// Importa tu ImplementModel y sequelize

export class SequelizeImplementCounterAdapter implements IImplementCounterPort {
  public async getNextNumber(prefix: string): Promise<number> {
    // Lógica para encontrar el número más alto
    console.log(prefix)
    // Buscar el último implemento que coincide con el prefijo
    const lastImplement = await ImplementModel.findOne({
      where: {
        cod: {
          [Op.regexp]: `^${prefix}[0-9]+$`
        }, // Sequelize buscará códigos que empiezan con el prefijo
      },
      order: [["cod", "DESC"]], // Ordenamos para obtener el más alto
      attributes: ["cod"],
    });

    if (!lastImplement) {
      return 1; // Si no hay ninguno, el siguiente es el 1
    }

    // Extraer el número de la cadena (ej. de 'GTR005' extraemos 5)
    // Esto asume que el número SIEMPRE está al final y tiene un largo fijo (ej. 3 dígitos)
    const lastCod = lastImplement.cod as string;
    const lastNumberPart = lastCod.substring(prefix.length); // Obtiene "005"
    const lastNumber = parseInt(lastNumberPart, 10); // Lo convierte a 5

    return lastNumber + 1; // El siguiente número
  }
}
