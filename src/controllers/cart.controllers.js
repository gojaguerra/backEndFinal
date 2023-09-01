import { 
    postCart as postCartService,
    getCartById as getCartByIdService, 
    putCartById as putCartByIdService,
    deleteCartById as deleteCartByIdService,
    deleteAllProductsInCart as deleteAllProductsInCartService,  
    putProductInCart as putProductInCartService,
    deleteProductInCart as deleteProductInCartService, 
    postPurchase as postPurchaseService
} from '../services/carts.services.js';

import { 
    getProductById as getProductByIdService, 
    stockProduct as stockProductService
} from "../services/products.services.js";


// AGREGO UN CARRITO NUEVO
const postCart = async(req, res) => {
    
    // Inicializo el carrito sin productos
    const cart = {
        products: []
    };

    try {
        const result = await postCartService(cart);
        res.send({ status: "success", payload: result})
    } catch (error) {
        req.logger.error('Error postCart ' + error.message);
        res.status(500).send({ status: "error", error });
    };

};

// OBTENER SI EXISTE UN CARRITO PASANDO EL ID
const getCartById = async(req, res) => {
    const cartId = String(req.params.cid);
    try {
        const cart = await getCartByIdService(cartId);
        const response ={ status: "Success", payload: cart};
        // VISTA DEL CARRITO
        cart[0].isValid= cart[0].products.length > 0
        // res.status(200).json(response);
        res.render("carts.handlebars", cart[0] );
    } catch (error) {
        req.logger.error(`getCartById = El carrito con ID ${cartId} NO existe!`);
        const response = { status: "NOT FOUND", payload: `El carrito con ID ${cartId} NO existe!` };
        res.status(404).send(response);
    };
};

// AGREGO/ACTUALIZO PRODUCTO EN EL CARRITO
const putCartById = async(req, res) => {
    //Leo el ID del carrito y producto por parametros 
    const cartId = String(req.params.cid);
    const { productId, quantity } = req.body;
    
    //MongoDB
    // Valido que exista el carrito 
    try {
        // OBTENGO el carrito QUE HAY EN la BASE
        await getCartByIdService(cartId);
    } catch (error) {
        req.logger.error(`putCartById = El carrito con ID ${cartId} NO existe!`);
        const response = { status: "Error", payload: `El carrito con ID ${cartId} NO existe!` };
        return res.status(404).json(response);
    }
    // Valido que exista el producto
    try {
        // OBTENGO el producto QUE HAY EN la Base
        await getProductByIdService(productId);
    } catch (error) {
        req.logger.error(`putCartById = El Producto con ID ${productId} NO existe!`);
        const response = { status: "Error", payload: `El Producto con ID ${productId} NO existe!` };
        return res.status(401).json(response);
    };

    // Una vez validado llamar al metodo addProductInCart
    try {
        const result = await putCartByIdService(cartId, productId, quantity);
        if(result.acknowledged) {
            res.status(200).send({ status: 'success', payload: 'Se agrego correctamente el producto al carrito' })
        };
    } catch (error) {
        req.logger.error(`putCartById = No se pudo agregar el Producto al carrito!` + error.message);
        res.status(404).send({ status: "NOT FOUND", payload: `No se pudo agregar el Producto al carrito!` });
    };
};

const deleteCartById = async(req, res) => {
    let cartId = String(req.params.cid);
    try {
        const cart = await deleteCartByIdService(cartId);
        const response ={ status: "Success", payload: cart};
        res.status(200).json(response);
    } catch (error) {
        req.logger.error(`deleteCartById = El carrito con ID ${cartId} NO existe!`);
        const response = { status: "NOT FOUND", payload: `El carrito con ID ${cartId} NO existe!` };
        res.status(500).send(response);
    };
};

const deleteAllProductsInCart = async(req, res) => {
    const cartId = String(req.params.cid);
    try {
        const cart = await deleteAllProductsInCartService(cartId);
        const response ={ status: "Success", payload: cart};
        //muestro resultado
        res.status(200).json(response);
    } catch (error) {
        req.logger.error(`deleteAllProductsInCart = El carrito con ID ${cartId} NO existe!`);
        const response = { status: "NOT FOUND", payload: `El carrito con ID ${cartId} NO existe!` };
        res.status(404).send(response);
    };
};

// AGREGO/ACTUALIZO PRODUCTO EN EL CARRITO
const putProductInCart = async(req, res) => {
    //Leo el ID del carrito y producto por parametros 
    const cartId = String(req.params.cid);
    const productId = String(req.params.pid);
    const { quantity } = req.body;
    
    //MongoDB
    // Primero Valido que exista el carrito 
    try {
        // OBTENGO el carrito QUE HAY EN la BASE
        await getCartByIdService(cartId);
    } catch (error) {
        req.logger.error(`putProductInCart = El carrito con ID ${cartId} NO existe!`);
        const response = { status: "Error", payload: `El carrito con ID ${cartId} NO existe!` };
        return res.status(404).json(response);
    }
    // Segundo Valido que exista el producto
    try {
        // OBTENGO el producto QUE HAY EN la Base
        const product = await getProductByIdService(productId);
        
        // verifico si es role premium no puede cargar sus propios productos
        if (req.user.role==="premium" && product[0].owner===req.user.email) {
            req.logger.error(`putProductInCart = El Producto con ID ${productId} NO puede agregarse!`);
            const response = { status: "Error", payload: `El Producto con ID ${productId} NO puede agregarse!` };
            return res.status(405).json(response);
        }
    } catch (error) {
        req.logger.error(`putProductInCart = El Producto con ID ${productId} NO existe!`);
        const response = { status: "Error", payload: `El Producto con ID ${productId} NO existe!` };
        return res.status(404).json(response);
    }
    // Una vez validado llamar al metodo addProductInCart
    try {
        const result = await putProductInCartService(cartId, productId, quantity);
        if(result.acknowledged) {
            res.status(200).send({ status: 'success', payload: 'Se actualizo correctamente el producto al carrito' })
        };
    } catch (error) {
        req.logger.error(`putProductInCart = No se pudo actualizar el Producto al carrito!`);
        res.status(404).send({ status: "NOT FOUND", payload: `No se pudo actualizar el Producto al carrito!` });
    };
};

// BORRA TODOS LOS PRODUCTOS DEL CARRO
const deleteCart = async(req, res) => {
    const cartId = String(req.params.cid);
    try {
        const cart = await deleteCartService(cartId);
        const response ={ status: "Success", payload: cart};
        //muestro resultado
        res.status(200).json(response);
    } catch (error) {
        req.logger.error(`putProductInCart = El Producto con ID ${productId} NO existe!`);
        const response = { status: "NOT FOUND", payload: `El carrito con ID ${cartId} NO existe!` };
        res.status(404).send(response);
    };
};

// BORRA UN PRODUCTO DEL CARRO
const deleteProductInCart = async(req, res) => {
    const cartId = String(req.params.cid);
    const productId = String(req.params.pid);
    try {
        const cart = await deleteProductInCartService(cartId,productId);
        const response ={ status: "Success", payload: cart};
        //muestro resultado
        res.status(200).json(response);
    } catch (error) {
        req.logger.error(`putProductInCart = El Producto con ID ${productId} NO existe!`);
        const response = { status: "NOT FOUND", payload: `El carrito con ID ${cartId} NO existe!` };
        res.status(404).send(response);
    };
};

const postPurchase = async(req, res) => {
    //Leo el ID del carrito y producto por parametros 
    const cartId = String(req.params.cid);
    /* const userMail = "gojaguerra@gmail.com"; */
    const userMail = req.user.email;
    //  Valido que exista el carrito 
    try {
        const newCart = [];
        const noCart = [];
        // OBTENGO el carrito QUE HAY EN la BASE y PERTENECE AL USER LOGUEADO
        const cartPuchase = await getCartByIdService(cartId);
        cartPuchase[0].products.forEach((product) => {
        // VALIDO STOCK SUFICIENTE
        if (product.product.stock > product.quantity) {
            // ACTUALIZO STOCK
            const resultStock = stockProductService(product.product._id, product.quantity*-1)
            const prodData = {
                    price: product.product.price,
                    quantity: product.quantity
            };
            // ALMACENO EN NUEVO ARRAY
            newCart.push(prodData);
            // ELIMINO PRODUCTO DEL CARRO
            const resultDelete = deleteProductInCartService(cartPuchase[0]._id,product.product._id);
            } else {
                const prodData = {
                    id: product._id
                };
                noCart.push(prodData);
            };
        });
        
        // SI HAY PRODUCTOS VALIDADOS CON STOCK GENERO LA VENTA
        if (newCart.length > 0){
            const result = await postPurchaseService(newCart, userMail);
            if (noCart.length > 0) {
                req.logger.info(`postPurchase = Se genero correctamente la compra con el ID ${result.code}  y no pudieron procesarse por falta de stock ${JSON.stringify(noStockCart, null)}`);
                res.status(200).send({ status: 'success', payload: `Se genero correctamente la compra con el ID ${result.code} y no pudieron procesarse por falta de stock ${noCart}`  })
            } else {
                req.logger.info(`postPurchase = Se genero correctamente la compra con el ID ${result.code}`);
                res.status(200).send({ status: 'success', payload: `Se genero correctamente la compra con el ID ${result.code}`  })
            };
        } else {
            if (noCart.length > 0) {
                req.logger.info(`postPurchase = No pudieron procesarse por falta de stock ${JSON.stringify(noStockCart, null)}`);
                res.status(404).send({ status: "NOT FOUND", payload: `No pudieron procesarse por falta de stock ${JSON.stringify(noCart)}` });
            } else {
                req.logger.info(`postPurchase = No hay productos en el carrito!`);
                res.status(404).send({ status: "NOT FOUND", payload: `No hay productos en el carrito!` });
            };
        };
    } catch (error) {
        req.logger.error(`postPurchase = ` + error.message);
        const response = { status: "Error", payload: error };
        return res.status(404).json(response);
    };
};

export {
    postCart, 
    getCartById,
    putCartById,
    putProductInCart,
    deleteCart,
    deleteCartById, 
    deleteProductInCart,
    deleteAllProductsInCart,
    postPurchase
};