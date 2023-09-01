import { 
    getProducts as getProductsService, 
    postProduct as postProductService,
    getProductById as getProductByIdService, 
    putProductById as putProductByIdService,
    deleteProductById as deleteProductByIdService  
} from "../services/products.services.js";
import { getUser as getUserService} from "../services/user.services.js";
import { sendEmail } from "../services/mail.js";

const getProducts = async (req, res) => {
    //leo el parametro por req.query
    const limit = parseInt(req.query.limit, 10) || 3;
    const page = parseInt(req.query.page, 10) || 1;
    let query = req.query.query; 
    let sort  = req.query.sort;
    try {
        let sort1= "";
        let sort2= "";
        let query1= "";
        let query2= "";
        if (query) {
            query2= query; 
            query1= {category: query};
        }
        if (sort) {
            sort2=sort;
            sort1= {price: sort};
        }
        const products = await getProductsService(limit, page, query1, sort1);
        products.prevLink = products.hasPrevPage?`http://localhost:8080/api/products?page=${products.prevPage}&query=${query2}&sort=${sort2}`:'';
        products.nextLink = products.hasNextPage?`http://localhost:8080/api/products?page=${products.nextPage}&query=${query2}&sort=${sort2}`:'';
        products.isValid= !(page<=0||page>products.totalPages)
        //Postman
        // res.send({ status: "success", payload: products}); 
        //Render page
        res.render("products.handlebars", products );
    } catch (error) {
        req.logger.error('Error getProducts ' + error.message);
        res.status(500).send({ status: "error", error });
    };
};

const getProductById =  async(req, res) => {
    const id = String(req.params.pid);

    // BUsco el ID en el arreglo
    try {
        const productById = await getProductByIdService(id);
        const response = { status: "OK", payload: productById} 
        //muestro resultado
        //Postman
        res.status(200).json(response);
        //Render page
        //res.render("products.hbs", { productById });
    } catch (error) {
        req.logger.error(`getProductById = El producto con ID ${id} NO existe!`);
        const response = { status: "NOT FOUND", payload: `El producto con ID ${id} NO existe!` };
        res.status(404).json(response);
    };
};

const postProduct = async(req, res) => {
    const product = req.body;
    
    if (!product.status){
        product.status = true
    };
    if(!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category){
        req.logger.error(`postProduct = Faltan completar campos!`);
        return res.status(400).send({ status: 'error', error: 'Faltan completar campos!'})
    };
    
    if (!product.owner){
        product.owner=req.user.email;
    };

    try {
        const result = await postProductService(product);
        //Valido el resultado de la creacion del producto
        if (result.acknowledged) {
            const io = req.app.get('socketio');
            io.emit("showProducts", await getProductsService());
        };

        const response = { status: "Success", payload: result};

        /* res.send({ status: 'success', message: 'Product OK' }) */
        res.send( response )

    } catch (error) {
        if(error.code===11000){
            // Código de producto duplicado
            req.logger.error(`postProduct = Producto duplicado!`);
            res.status(501).send({ status: "error", error });
        }else{
            req.logger.error('Error postProduct ' + error.message);
            res.status(500).send({ status: "error", error });
        };
    };
};

const putProductById = async(req,res) =>{
    // llamar al metodo updateProduct para actualizar sin modificar el id
    const id = String(req.params.pid);
    const product = req.body;

    if("id" in product){
        req.logger.error(`putProductById = Error no se puede modificar el id ${id}`);
        return res.status(404).json({ status: "NOT FOUND", data: "Error no se puede modificar el id"});
    }

    //Intento actualizar los datos de productos
    try {
        const result = await putProductByIdService(id, product);
        if (result.acknowledged) {
            req.logger.info(`putProductById = El producto con ID ${id} fue actualizado con éxito!`);
            const response = { status: "OK",  payload: `El producto con ID ${id} fue actualizado con éxito!`};
            res.status(200).json(response);
        } else {
            req.logger.error('Error putProductById ERROR');
            res.status(200).send("ERROR");
        }
    } catch (error) {
        req.logger.error('Error putProductById ' + error.message);
        res.status(404).send({ status: "error", error });
    };
};

const deleteProductById = async(req,res)=>{
    const id = String(req.params.pid);
    const email=req.user.email.trim();
    const role=req.user.role;
    try {
        
        // obtengo el producto para verificar el owner
        const productById = await getProductByIdService(id)

        // si role es premium solo puede borrar sus productos
        if (role==="premium" && productById[0].owner!==email){
            
            req.logger.error(`Error deleteProductById: NO tiene permiso para eliminar este producto!`);
            const response = { status: "NOT PERMISION", payload: `NO tiene permiso para eliminar este producto!`}; 
            return res.status(403).json(response);
        };

        /* const result = await deleteProductByIdService(id); */
        const result = {
            acknowledged:true,
            deletedCount:1
        };
        // si el producto es de user premium debo notificarle por email que se elimino el producto
        if (productById[0].owner){
            const user = await getUserService({ email: productById[0].owner });
            if (user.role==="premium"){
                // Envío mail de aviso
                const type = "Producto"
                const detail = `producto codigo: ${productById[0].code}`
                const reason = "admin elimino!"
                const mail = { 
                    to: productById[0].owner,
                    subject: 'Eliminación de Producto',
                    html: deleteNotification(type, detail, reason)
                }
                await sendEmail(mail);
            };
        };

        //Valido el resultado de la búsqueda y renderizo con el socket
        if (result.acknowledged & result.deletedCount!==0 ) {
            const io = req.app.get('socketio');
            io.emit("showProducts", await getProductsService());
            req.logger.info(`deleteProductById = El producto con ID ${id} fue eliminado!`);
            const response = { status: "Success", payload: `El producto con ID ${id} fue eliminado!`}; 
            /* res.status(200).json(response); */
            res.send( response );
        } else {
            req.logger.error(`Error deleteProductById: NO existe el producto que desea eliminar!`);
            const response = { status: "NOT FOUND", payload: `NO existe el producto que desea eliminar!`}; 
            res.status(404).json(response);
        };
    } catch (error) {
        req.logger.error(`Error deleteProductById: NO existe el producto que desea eliminar!`);
        res.status(404).json({ status: "NOT FOUND", payload: `NO existe el producto que desea eliminar!` });
        /* res.status(500).send({ status: "error", error }); */
    };
};

export {
    getProducts,
    postProduct,
    getProductById,
    putProductById,
    deleteProductById
};