import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { Validator } from '../middleware/ValidatorMiddle'; // Importamos el validador
import { CreateCategorySchema, UpdateCategorySchema } from '../../application/schemas/CategorySchema';

// Instanciamos el controlador y el validador
const categoryController = new CategoryController();
const validator = Validator;

const router = Router();

// Definimos las rutas para el recurso "categories"
router.post('/categories', 
  [ // <-- Usamos la sintaxis de arreglo para el middleware
    validator.validateSchema(CreateCategorySchema) // <-- Usamos el método .validateSchema
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
    validator.validateSchema(UpdateCategorySchema)
  ], 
  categoryController.update.bind(categoryController)
);

// Exportamos el router con un nombre específico, como en tus ejemplos
export { router as categoryRouter };