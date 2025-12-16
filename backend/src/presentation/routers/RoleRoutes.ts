import { Router } from 'express';
import { RoleController } from '../controllers/RoleController';
import { Validator } from '../http/middleware/ValidatorMiddle';
import { RoleSchema } from '../../application/schemas/RoleSchema';

const roleController = new RoleController();
const validator = Validator;

const router = Router();

// Define las rutas para el recurso "roles"
router.post('/roles',
  [
    validator.validateSchema(RoleSchema)
  ],
  roleController.create.bind(roleController)
);

router.get('/roles',
  [],
  roleController.getAll.bind(roleController)
);

router.get('/roles/:id',
  [],
  roleController.getById.bind(roleController)
);

router.put('/roles/:id',
  [
    validator.validateSchema(RoleSchema.partial()) // Usa .partial() para actualizar
  ],
  roleController.update.bind(roleController)
);

// Exporta el router con un nombre específico
export { router as roleRouter };