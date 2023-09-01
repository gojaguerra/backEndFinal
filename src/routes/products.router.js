import { Router } from 'express';
import { getProducts, postProduct, getProductById, putProductById, deleteProductById } from '../controllers/products.controllers.js';
import { passportCall, authorization, authorizationRole } from "../utils/utils.js";

const router = Router();

router.get("/", getProducts);

router.get('/:pid', getProductById);

router.post('/', passportCall('jwt'), authorizationRole(['admin','premium']), postProduct);

router.put('/:pid', passportCall('jwt'), authorizationRole(['admin','premium']), putProductById);

router.delete('/:pid', passportCall('jwt'), authorizationRole(['admin','premium']), deleteProductById);

export default router;
