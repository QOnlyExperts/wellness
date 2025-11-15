import { Router } from 'express';
import { PhoneController } from '../controllers/PhoneController';
import { Validator } from '../middleware/ValidatorMiddle';
import { CreatePhoneInputDtoSchema } from '../../application/schemas/PhoneSchema';

const phoneController = new PhoneController();
const validator = Validator;

const router = Router();

// --- Definición de Rutas para Phones ---

// Crear un teléfono [POST /api/v1/phones]
router.post('/phones',
  [
    validator.validateSchema(CreatePhoneInputDtoSchema) // Valida el body
  ],
  phoneController.create.bind(phoneController)
);

// Obtener todos los teléfonos [GET /api/v1/phones]
router.get('/phones',
  [],
  phoneController.getAll.bind(phoneController)
);

// Obtener un teléfono por ID [GET /api/v1/phones/:id]
router.get('/phones/:id',
  [], // La validación del ID ya la hace el controlador
  phoneController.getById.bind(phoneController)
);

// Obtener teléfonos por ID de Persona [GET /api/v1/phones/person/:infoPersonId]
router.get('/phones/person/:infoPersonId',
  [], // La validación del ID la hace el controlador
  phoneController.getByInfoPersonId.bind(phoneController)
);

// Actualizar un teléfono por ID [PATCH /api/v1/phones/:id]
router.patch('/phones/:id',
  [
    // Usamos .partial() para permitir actualizaciones parciales
    validator.validateSchema(CreatePhoneInputDtoSchema.partial())
  ],
  phoneController.update.bind(phoneController)
);

// Exportamos el router con un nombre específico
export { router as phoneRouter };