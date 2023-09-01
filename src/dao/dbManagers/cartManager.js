import { cartModel } from "../models/cartModel.js";

export default class CartManager {

    constructor() {
        console.log('Working carts with DB');
    };

    getCarts = async () => {
        const carts = await cartModel.find().lean();
        return carts;
    };

    addCart = async (cart) => {
        const result = await cartModel.create(cart);
        return result;
    };

    getCartById = async (id) => {
        const cart = await cartModel.find({_id:id}).lean();
        return cart;         
    };

    deleteCartById = async (cartId) => {
        const cart = await cartModel.deleteOne({_id: cartId});
        return cart;    
    };
    
    addProductInCart = async (cartId,productId,quantity) => {
        //Intento incrementar la cantidad si se encuentra el producto en el carrito
        const result = await cartModel.updateOne({_id: cartId, "products.product": productId },
        {$inc: {"products.$.quantity": quantity}});
        //Pregunto si pudo modificar, sino pudo es que no existe y lo agrego
        if (result.acknowledged & result.modifiedCount === 0){
            //creo arreglo para el nuevo producto con sus datos
            const newProduct = {
                product: productId,
                quantity: quantity
                };
            const result = await cartModel.updateOne({_id: cartId}, {$push: { products: newProduct}});
            return result;
        };
        return result;
    };

    deleteProductInCart = async (cartId, productId) => {
        const result = await cartModel.updateOne({_id: cartId}, {$pull: { products: {"product": productId }}});
        return result;
    };

    deleteAllProductsInCart = async (cartId) => {
        const result = await cartModel.updateOne({_id: cartId}, { $set: { products: [] }});
        return result;
    };
    
};