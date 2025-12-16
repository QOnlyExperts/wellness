import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { Validator } from '../http/middleware/ValidatorMiddle'; // Importamos el validador
import { CategorySchema } from '../../application/schemas/CategorySchema';

// Instanciamos el controlador y el validador
const categoryController = new CategoryController();
const validator = Validator;

const router = Router();

// Definimos las rutas para el recurso "categories"
router.post('/categories', 
  [ // <-- Usamos la sintaxis de arreglo para el middleware
    validator.validateSchema(CategorySchema)
  ], 
  categoryController.create.bind(categoryController)
);

router.get('/categories', 
  [], // Arreglo vacío si no hay middleware
  categoryController.getAll.bind(categoryController)
);

router.get('/categories/:id', 
  [], 
  categoryController.getById.bind(categoryController)
);

router.put('/categories/:id', 
  [
    validator.validateSchema(CategorySchema.partial())
  ], 
  categoryController.update.bind(categoryController)
);

// Exportamos el router con un nombre específico, como en tus ejemplos
export { router as categoryRouter };