import { Router } from 'express';
import { postCart, getCartById, putCartById, putProductInCart, deleteCart, deleteProductInCart, postPurchase } from '../controllers/cart.controllers.js';
import { passportCall, authorization, authorizationRole } from "../utils/utils.js";

const router = Router();

// AGREGO UN CARRITO NUEVO
router.post('/', passportCall('jwt'), authorization('user'), postCart);

// OBTENER SI EXISTE UN CARRITO PASANDO EL ID
router.get('/:cid', getCartById);

// AGREGO/ACTUALIZO CARRITO
router.put('/:cid', passportCall('jwt'), authorization('user'), putCartById);

// AGREGO/ACTUALIZO PRODUCTO EN EL CARRITO
/* router.put('/:cid/product/:pid', passportCall('jwt'), authorization('user'), putProductInCart); */
router.put('/:cid/product/:pid', passportCall('jwt'), authorizationRole(['user','premium']), putProductInCart);

// BORRA TODOS LOS PRODUCTOS DEL CARRO
router.delete('/:cid', passportCall('jwt'), authorization('user'), deleteCart);

// BORRA UN PRODUCTO DEL CARRO
router.delete('/:cid/product/:pid', passportCall('jwt'), authorization('user'), deleteProductInCart);

// RUTA PARA FINALIZAR LA COMPRA PURCHASE
router.put('/:cid/purchase', passportCall('jwt'), postPurchase);

export default router;