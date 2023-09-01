import { productModel } from '../models/productModel.js';

export default class ProductManager {

    constructor() {
        console.log('Working products with DB');
    };

    getProducts = async (limit, page, query, sort) => {
        let querys = {}
        if (query) { querys = query };
            let options = {
                limit: limit,
                page: page,
                query: query,
                sort: sort,
                lean: true
        };
        // Si no hay limite no hago el paginate
        if (!limit) options = { pagination: false };
        // Leo MONGO devolviendo los productos
        const products = await productModel.paginate(querys, options)
        
        return products; 
    };

    getProductById = async (id) => {
        //Leo MONGO devolviendo los productos
        const product = await productModel.find({_id:id}).lean();
        return product;
    };

    addProduct = async (product) => {
        const result = await productModel.create(product);
        return result;
    };

    updateProduct = async (id, product) => {
        const result = await productModel.updateOne({_id:id}, {$set: product});
        return result;
    };

    deleteProductById = async (id) => {
        const result = await productModel.deleteOne({_id:id});
        return result;
    };

    stockProduct = async (id, stock) => {
        const result = await productModel.updateOne({_id: id}, {$inc: {stock: stock}});
        return result;
    }
    
};
