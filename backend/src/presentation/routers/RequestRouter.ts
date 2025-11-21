import { Router } from 'express';
import { RequestController } from '../controllers/RequestController';
import { Validator } from '../middleware/ValidatorMiddle';

// 1. Instanciamos el controlador
// Aquí se inicia la inyección de dependencias (se llama a resolveCreateImplementUseCase)
const requestController = new RequestController(); 
const validator = Validator;

const router = Router();

// 2. Definición de la ruta para crear un Implement
// Usamos el método HTTP POST y una URL descriptiva
router.post('/request', [
  // validator.validateSchema(RegisterUserInputDtoSchema)
], requestController.create.bind(requestController));

router.get('/requests', requestController.getAll.bind(requestController));

router.get('/requests/info-person/status/:id', requestController.getStatusWhitIdInfoPerson.bind(requestController));


router.get('/requests/info-person/:id', requestController.getByIdInfoPerson.bind(requestController));


router.patch('/request/:id', [
  // validator.validateSchema(RegisterUserInputDtoSchema
  ], requestController.update.bind(requestController))


router.get('/request/:id', requestController.getById.bind(requestController));




export { router as requestRouter };