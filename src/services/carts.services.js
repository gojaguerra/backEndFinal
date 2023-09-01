import { cartsRepository } from '../repositories/index.js';
import { ticketsRepository } from '../repositories/index.js';

const postCart = async (cart) => {
    const result = await cartsRepository.addCart(cart);
    return result;
}; 

const getCartById = async (id) => {
    const cart = await cartsRepository.getCartById(id);
    return cart;
};

const deleteCartById = async (cartId) => {
    const cart = await cartsRepository.deleteCartById(cartId);
    return cart;
};

const putCartById = async (cartId, productId, quantity) => {
    const result = await cartsRepository.addProductInCart(cartId, productId, quantity);
    return result;
};

const deleteAllProductsInCart = async (id) => {
    const result = await cartsRepository.deleteAllProductsInCart(id);
    return result;
};

const putProductInCart = async (cartId, productId, quantity) => {
    const result = await cartsRepository.addProductInCart(cartId, productId, quantity);
    return result;
};

const deleteProductInCart = async (cartId,productId) => {
    const result = await cartsRepository.deleteProductInCart(cartId,productId);
    return result;
};

const postPurchase = async (cart, userMail) => {
    const sum = cart.reduce((acc, prev) => {
        acc += prev.price * prev.quantity;
        return acc;
    }, 0);

    const code = Date.now() + Math.floor(Math.random() * 100000 + 1);

    const ticket = {
        code: code,
        purchase_datetime: new Date(),
        amount: sum,
        purchaser: userMail
    };

    const result = await ticketsRepository.createTicket(ticket);
    return result;
};

export {
    postCart,
    getCartById,
    putCartById,
    deleteCartById,
    deleteAllProductsInCart, 
    putProductInCart,
    deleteProductInCart,
    postPurchase
};