// infrastructure/services/ImageService.ts
import fs from "fs";
import path from "path";
import { UploadedFile } from "express-fileupload";

export class ImgService {
  /**
   * Guarda una o varias imágenes en el servidor usando UUIDs generados por la BD.
   * @param files Archivo o lista de archivos recibidos desde la petición.
   * @param uuids Lista de UUIDs generados por la base de datos (uno por archivo).
   * @param folder Carpeta donde se almacenarán (por defecto 'uploads').
   * @returns Lista de rutas relativas guardadas.
   */
  async saveImages(
    files: UploadedFile | UploadedFile[],
    uuids: string[] | string,
    folder = "uploads"
  ): Promise<string[]> {
    const baseDir = path.join(__dirname, "..", "public", folder);
    const imagePaths: string[] = [];

    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    const saveFile = async (file: UploadedFile, uuid: string) => {
      const fileName = uuid + path.extname(file.name);
      const savePath = path.join(baseDir, fileName);
      await file.mv(savePath);
      imagePaths.push(`${folder}/${fileName}`);
    };

    if (Array.isArray(files) && Array.isArray(uuids)) {
      if (files.length !== uuids.length) {
        throw new Error("La cantidad de archivos y UUIDs no coincide");
      }
      await Promise.all(files.map((file, index) => saveFile(file, uuids[index])));
    } else if (!Array.isArray(files) && typeof uuids === "string") {
      await saveFile(files, uuids);
    } else {
      throw new Error("Los parámetros 'files' y 'uuids' deben coincidir en tipo y cantidad");
    }

    return imagePaths;
  }
}
