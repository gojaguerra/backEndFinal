import { Router } from 'express';
import { getTicketsById } from '../controllers/ticket.controller.js';

// OBTENER SI EXISTE UN CARRITO PASANDO EL ID
const router = Router();

router.get('/:tid', getTicketsById);

export default router;