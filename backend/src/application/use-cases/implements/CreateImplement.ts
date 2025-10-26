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
  ): Promise<ImplementOutputDto> {
    // Obtener el siguiente numero consecutivo
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
      // Valores por defecto
      status: input.status || ImplementStatus.AVAILABLE,
      condition: input.condition || ImplementCondition.NEW,
      group_implement_id: input.group_implement_id,
      categories_id: input.categories_id
    });

    // Guardamos la entidad en base de datos
    const createdImplement = await this.implementRepository.save(newImplement);

    // Tomamos los datos de array de img
    const img = input.imgs?.[0];
    
    if (!img) {
      throw new Error("No se proporcionó una imagen para el implemento");
    }

    // Creamos la entidad de la imagen
    const newImg = ImgEntity.create({
      id: null,
      file_path: folder,
      mime_type: img.mime_type,
      size_bytes: img.size_bytes,
      description: img.description,
      implement_id: createdImplement.id, // Id del implemento
      uploaded_by: input.user_id, // Id del usuario
    });

    // Guardamos la imagen en la base de datos
    const createdImg = await this.imgRepository.save(newImg);
    if(!createdImg){
      throw new Error("No se pudo guardar la imagen");
    }

    // Guardamos en el servidor y pasamos el nombre de la imagen guardada para la relación
    const imgUploaded = await this.imgService.saveImages(files, [String(createdImg.file_name)], folder);
    if(!imgUploaded || imgUploaded.length === 0){
      throw new Error("No se pudo almacenar la imagen");
    }

    // Mapeamos el modelo guardado a un DTO de salida
    return ImplementMapper.toOutputDto(createdImplement);
  }
}
