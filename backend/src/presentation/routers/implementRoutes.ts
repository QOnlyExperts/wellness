import { Router } from 'express';
import { ImplementController } from '../controllers/ImplementController';
import { CreateImplementInputDtoSchema } from '../../application/schemas/ImplementSchema';
import { Validator } from '../http/middleware/ValidatorMiddle';

// 1. Instanciamos el controlador
// Aquí se inicia la inyección de dependencias (se llama a resolveCreateImplementUseCase)
const implementController = new ImplementController(); 
const validator = Validator;

const router = Router();

// 2. Definición de la ruta para crear un Implement
// Usamos el método HTTP POST y una URL descriptiva
router.post('/implements', [
  validator.validateSchema(CreateImplementInputDtoSchema)
], implementController.create.bind(implementController));

router.get('/implements',[
  
], implementController.getAll.bind(implementController));

router.get('/implement/:id', implementController.getImplementById.bind(implementController));

router.patch("/implements/batch",[

], implementController.updateMany.bind(implementController));

router.patch('/implements/:id', [

], implementController.updateOnly.bind(implementController));

router.get('/implements/status/:status',[

], implementController.getByStatus.bind(implementController));


router.get('/implements/group-implement/:id', implementController.getImplementsByIdGroup.bind(implementController));

// Notas sobre .bind(implementController):
// Esto asegura que, cuando Express llame a implementController.create, 
// 'this' dentro de la función 'create' siga refiriéndose a la instancia del controlador.
// Si usas arrow functions en el controlador, esto no es necesario.

export { router as implementRouter };