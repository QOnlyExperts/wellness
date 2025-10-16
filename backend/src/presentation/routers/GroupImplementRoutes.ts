import { Router } from 'express';
import { GroupImplementController } from '../controllers/GroupImplementController';
import { CreateImplementInputDtoSchema } from '../../application/schemas/ImplementSchema';
import { Validator } from '../middleware/ValidatorMiddle';

// 1. Instanciamos el controlador
// Aquí se inicia la inyección de dependencias (se llama a resolveCreateImplementUseCase)
const groupImplementController = new GroupImplementController(); 
const validator = Validator;

const router = Router();

// 2. Definición de la ruta para crear un Implement
// Usamos el método HTTP POST y una URL descriptiva
router.post('/gimplements', [
  // validator.validateSchema(CreateImplementInputDtoSchema)
], groupImplementController.create.bind(groupImplementController));


// Notas sobre .bind(groupImplementController):
// Esto asegura que, cuando Express llame a groupImplementController.create, 
// 'this' dentro de la función 'create' siga refiriéndose a la instancia del controlador.
// Si usas arrow functions en el controlador, esto no es necesario.

export { router as groupImplementRouter };