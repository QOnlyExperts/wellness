import { Router } from 'express';
import { GroupImplementController } from '../controllers/GroupImplementController';
import { CreateGroupImplementInputDtoSchema } from '../../application/schemas/GroupImplementSchema';
import { Validator } from '../http/middleware/ValidatorMiddle';
import { idSchema } from '../../application/schemas/IdSchema';

// 1. Instanciamos el controlador
// Aquí se inicia la inyección de dependencias (se llama a resolveCreateImplementUseCase)
const groupImplementController = new GroupImplementController(); 
const validator = Validator;

const router = Router();

// 2. Definición de la ruta para crear un GroupImplement
// Usamos el método HTTP POST y una URL descriptiva
router.post('/group-implements', [
    validator.validateSchema(CreateGroupImplementInputDtoSchema)
  ], groupImplementController.create.bind(groupImplementController)
);

router.get('/group-implements', [
  ], groupImplementController.getAll.bind(groupImplementController)
);

router.get('/group-implements/search', [
  ], groupImplementController.getBySearch.bind(groupImplementController)
);

router.get('/group-implements/:id', [
  ], groupImplementController.getById.bind(groupImplementController)
);

router.put('/group-implements/:id', [
  validator.validateSchema(CreateGroupImplementInputDtoSchema)
], groupImplementController.update.bind(groupImplementController));



// Notas sobre .bind(groupImplementController):
// Esto asegura que, cuando Express llame a groupImplementController.create, 
// 'this' dentro de la función 'create' siga refiriéndose a la instancia del controlador.
// Si usas arrow functions en el controlador, esto no es necesario.

export { router as groupImplementRouter };