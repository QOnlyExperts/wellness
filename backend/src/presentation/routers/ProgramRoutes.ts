import { Router } from 'express';
import { ProgramController } from '../controllers/ProgramController';
import { Validator } from '../middleware/ValidatorMiddle';
import { CreateProgramInputDtoSchema } from '../../application/schemas/ProgramSchema'; // Tu schema principal

// Instanciamos el controlador y el validador
const programController = new ProgramController();
const validator = Validator;

const router = Router();

// --- Definición de Rutas para Programs ---

// Crear un programa [POST /api/v1/programs]
router.post('/programs',
  [
    validator.validateSchema(CreateProgramInputDtoSchema) // Valida el body
  ],
  programController.create.bind(programController)
);

// Obtener todos los programas [GET /api/v1/programs]
router.get('/programs',
  [],
  programController.getAll.bind(programController)
);

// Obtener programas por búsqueda [GET /api/v1/programs/search?name=...]
router.get('/programs/search',
  [],
  programController.getBySearch.bind(programController)
);

// Obtener un programa por ID [GET /api/v1/programs/:id]
router.get('/programs/:id',
  [], // La validación del ID ya la hace el controlador
  programController.getById.bind(programController)
);

// Actualizar un programa por ID [PUT /api/v1/programs/:id]
router.patch('/programs/:id',
  [
    // Usamos .partial() para permitir actualizaciones parciales
    validator.validateSchema(CreateProgramInputDtoSchema.partial())
  ],
  programController.update.bind(programController)
);

// Exportamos el router con un nombre específico
export { router as programRouter };