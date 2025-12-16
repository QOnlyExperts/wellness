import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { RegisterUserInputDtoSchema } from '../../application/schemas/RegisterUserSchema';
import { Validator } from '../http/middleware/ValidatorMiddle';

// 1. Instanciamos el controlador
// Aquí se inicia la inyección de dependencias (se llama a resolveCreateImplementUseCase)
const userController = new UserController(); 
const validator = Validator;

const router = Router();

// 2. Definición de la ruta para crear un Implement
// Usamos el método HTTP POST y una URL descriptiva
router.post('/user', [
  validator.validateSchema(RegisterUserInputDtoSchema)
], userController.create.bind(userController));

export { router as registerRouter };