import { Router } from 'express';
import { ProgramController } from '../controllers/ProgramController';
import { Validator } from '../http/middleware/ValidatorMiddle';
import { CreateProgramInputDtoSchema } from '../../application/schemas/ProgramSchema'; // Tu schema principal

// Instanciamos el controlador y el validador
const programController = new ProgramController();
const validator = Validator;

const router = Router();

// --- Definición de Rutas para Programs ---


// Obtener todos los programas [GET /api/v1/programs]
router.get('/programs',
  [],
  programController.getAll.bind(programController)
);

// Exportamos el router con un nombre específico
export { router as programRouterPublic };