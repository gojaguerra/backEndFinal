import { Router } from 'express';
import ProductManager from "../dao/dbManagers/productManager.js"

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => { 
    try {
        const products = await productManager.getProducts()
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).send({ status: "error", error });
    };
});

export default router;