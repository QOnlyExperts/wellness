declare module 'express-fileupload' {
  import { RequestHandler } from 'express';

  export interface UploadedFile {
    name: string;
    data: Buffer;
    size: number;
    encoding: string;
    tempFilePath: string;
    truncated: boolean;
    mimetype: string;
    md5: string;
    mv: (savePath: string, callback?: (err?: any) => void) => void;
  }

  export interface FileArray {
    [fieldname: string]: UploadedFile | UploadedFile[];
  }

  export interface Options {
    safeFileNames?: boolean;
    preserveExtension?: boolean | number;
    abortOnLimit?: boolean;
    responseOnLimit?: string;
    limitHandler?: RequestHandler;
    useTempFiles?: boolean;
    tempFileDir?: string;
    debug?: boolean;
    uploadTimeout?: number;
  }

  // 👇 Aquí definimos el valor real (una función que retorna un middleware)
  function fileUpload(options?: Options): RequestHandler;

  export default fileUpload;
}
