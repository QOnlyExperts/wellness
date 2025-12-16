import { Router } from 'express';
import { LoginController } from '../controllers/LoginController';
import { LoginInputDtoSchema } from '../../application/schemas/LoginSchema';
import { Validator } from '../http/middleware/ValidatorMiddle';

// 1. Instanciamos el controlador
// Aquí se inicia la inyección de dependencias (se llama a resolveCreateImplementUseCase)
const loginController = new LoginController(); 
const validator = Validator;

const router = Router();

// 2. Definición de la ruta para crear un Implement
// Usamos el método HTTP POST y una URL descriptiva
router.post('/auth/login', [
  validator.validateSchema(LoginInputDtoSchema)
], loginController.create.bind(loginController));


export { router as loginRouter };