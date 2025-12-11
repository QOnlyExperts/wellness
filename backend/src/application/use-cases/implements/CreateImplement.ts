import { IImplementRepository } from "../../../domain/interfaces/IImplementRepository";
import { IImplementCounterPort } from "../../ports/IImplementCounterPort";

import { ImplementEntity } from "../../../domain/entities/ImplementEntity";
import { ImplementStatus } from "../../../domain/enums/ImplementStatus";
import { ImplementCondition } from "../../../domain/enums/ImplementCondition";

import { ImplementInputDto } from "../../dtos/implements/ImplementInputDto";
import { ImplementOutputDto } from "../../dtos/implements/ImplementOutputDto";
import { ImplementMapper } from "../../mappers/ImplementMapper";

import { IImgRepository } from "../../../domain/interfaces/IImgRepository";
import { ImgService } from "../../services/ImgService";
import { ImgEntity } from "../../../domain/entities/ImgEntity";
import { UploadedFile } from "express-fileupload";

import { v4 as uuidv4 } from "uuid";
import path from "path";

export class CreateImplement {
  constructor(
    private implementRepository: IImplementRepository,
    private counterPort: IImplementCounterPort,
    private imgRepository: IImgRepository,
    private imgService: ImgService
  ) {}

  // Función auxiliar para formatear el número
  private formatCode(prefix: string, number: number): string {
    // Ejemplo: PadStart para rellenar con ceros (ej. 1 -> 001)
    const paddedNumber = String(number).padStart(3, "0");
    return `${prefix}${paddedNumber}`;
  }

  public async execute(
    input: ImplementInputDto,
    files: UploadedFile[],
    folder: string
  ): Promise<ImplementOutputDto[]> {
    // Obtener el siguiente numero consecutivo


    const implementsList: ImplementEntity[] = [];
    // Generamos el id, endPoint y ruta de almacenamiento de la imagen
    const generatedUuid = uuidv4();
    const extension = path.extname(files?.[0].name); // ".jpg"
    const filePath = `${folder}/${generatedUuid}${extension}`;
    const endPoint = `static/${generatedUuid}${extension}`;

    let attempts: number = 0;
    // Mantener ingresos dado la cantidad recibida para evitar bucles infinitos
    while (attempts < input.amount) {
      // Generar prefijo
      const nextNumber = await this.counterPort.getNextNumber(input.prefix);
      if (nextNumber == null || isNaN(nextNumber)) {
        throw new Error("Valor del contador invalido");
      }

      // Generamos el código final prefix + numero
      const finalCod = this.formatCode(input.prefix, nextNumber);

      // Crear Entidad Pura sin ID
      const newImplement = ImplementEntity.create({
        id: null, // ID es null porque aún no existe en BD
        cod: finalCod,
        name: input.name,
        // Valores por defecto
        status: input.status || ImplementStatus.AVAILABLE,
        condition: input.condition || ImplementCondition.NEW,
        group_implement_id: input.group_implement_id,
        categories_id: input.categories_id
      });

      // Guardamos la entidad en base de datos
      const createdImplement = await this.implementRepository.save(newImplement);
      if(!createdImplement){
        throw new Error("No se pudieron crear algunos instrumentos");
      }
      // Guardamos el la lista de salida
      implementsList.push(createdImplement);
      // Tomamos los datos de array de img
      const img = input.imgs?.[0];
      
      if (!img) {
        throw new Error("No se proporcionó una imagen para el implemento");
      }

      // Creamos la entidad de la imagen
      const newImg = ImgEntity.create({
        id: null,
        file_path: filePath,
        mime_type: img.mime_type,
        size_bytes: img.size_bytes,
        description: endPoint,
        implement_id: createdImplement.id, // Id del implemento
        uploaded_by: input.user_id, // Id del usuario
      });

      // Guardamos la imagen en la base de datos
      const createdImg = await this.imgRepository.save(newImg);
      if(!createdImg){
        throw new Error("No se pudo guardar la imagen");
      }

      attempts++;
    }
    
    // Guardamos en el servidor y pasamos el uud de la imagen guardada para la relación
    const imgUploaded = await this.imgService.saveImages(files, [String(generatedUuid)], folder);
    if(!imgUploaded || imgUploaded.length === 0){
      throw new Error("No se pudo almacenar la imagen");
    }
    
    // Mapeamos el modelo guardado a un DTO de salida
    return implementsList.map((entity) => ImplementMapper.toOutputDto(entity));
  }
}
