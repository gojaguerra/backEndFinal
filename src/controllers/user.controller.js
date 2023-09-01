import { getUser as getUserService, addUser as addUserService, updateUser as updateUserService, updateUserPush as updateUserPushService, getAllUser as getAllUserService, deleteUserById as deleteUserByIdService, getUserById as getUserByIdService, deleteAllUser as deleteAllUserService } from '../services/user.services.js';
import { deleteCartById as deleteCartByIdService, postCart } from '../services/carts.services.js';
import { generateToken, generateTokenResetPass, createHash, isValidPassword } from '../utils/utils.js';
import { PRIVATE_COOKIE } from '../helpers/proyect.constants.js';
import UsersDto from '../dao/DTOs/users.dto.js';
import { resetPassNotification } from '../utils/custom-html.js';
import { deleteNotification } from '../utils/custom-html-delete.js';
import { sendEmail } from '../services/mail.js';
import { responseMessages } from '../helpers/proyect.helpers.js';
import moment from "moment";

const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        if(!first_name || !last_name || !email || !age || !password){
            req.logger.error(`Error registerUser: Faltan completar campos!`);
            return res.status(401).send({ status: 'error', error: 'Faltan completar campos!' })
        };

        const exists = await getUserService({ email });
        
        if (exists) {
            req.logger.error(`Error registerUser: User already exist!`);
            return res.status(400).send({ status: 'error', error: 'User already exists' });
        };

        const cartId = await postCart();

        const user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password), 
            cart: cartId
        }

        await addUserService(user);

        const accessToken = generateToken(user);
        
        req.logger.info(`registerUser = User registered`);
        res.send({ status: 'success', message: 'User registered', access_token: accessToken })

    } catch (error) {
        req.logger.error(`registerUser = ` + error.message);
        res.status(500).send({ status: 'error', error: error.message });
    };
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await getUserService({ email });
        
        if (!user) {
            req.logger.error(`loginUser = Incorrect credentials`);
            return res.status(400).send({ status: 'error', error: 'Incorrect credentials' });
        };

        if (!isValidPassword(user, password)) {
            req.logger.error(`loginUser = Incorrect password`);
            return res.status(401).send({ status: 'error', error: 'Incorrect password' })
        };

        req.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age, 
            role: "user",
            cartId: user.cart._id
        }
        
        // role ADMIN
        /* if(email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            console.log(req.user.role);
        } */
        if(req.user.email === 'adminCoder@coder.com' ) {
            req.user.role = "admin";
        }

        // ACTUALIZO ULTIMA CONEXION
        const id = String(user._id)
        const newDateTime =  new Date();
        await updateUserService(id, { "last_connection": newDateTime });

        const accessToken = generateToken(user);

        res.cookie(PRIVATE_COOKIE, accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
        ).send({ status: 'success', message: 'Login success!' });
    } catch (error) {
        req.logger.error(`registerUser = ` + error.message);
        res.status(500).send({ status: 'error', error });
    };
};

const logoutUser = async (req, res) => {
    
    // ACTUALIZO ULTIMA CONEXION
    const id = String(req.user._id)
    const newDateTime =  new Date();
    const result = await updateUserService(id, { "last_connection": newDateTime });

    res.clearCookie(PRIVATE_COOKIE);
    res.redirect('/login');
};

const gitUser = async (req, res) => {
    res.redirect('/');
    //res.send({ status: "success", mesage: responseMessages.user_register_ok})
};

const gitCallbackUser = async (req, res) => {
    req.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email, 
        role: "user", 
    };

    if(req.user.email === 'adminCoder@coder.com' ) {
        req.user.role = "admin";
    };
    const accessToken = generateToken(req.user);

    res.cookie(
        PRIVATE_COOKIE, accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
    );
    
    res.redirect('/');
};

const currentUser = (req, res) => {
    const user = new UsersDto(req.user);
    res.send({ status: 'success', payload: user });
};

const passLink = async (req, res) => {
    try {
        const { email } = req.body;
        req.logger.warning(`email = ` + email); 
        const user = await getUserService({ email });

        if (!user) {
            req.logger.warning(`loginUser = ` + responseMessages.incorrect_user); 
            return res.status(400).send({ status: 'error', error: responseMessages.incorrect_user });
        }

        const accessToken = generateTokenResetPass(user);

        const link = `http://localhost:8080/api/sessions/linkPassword?token=${accessToken}`
        const mail = {
            to: user.email,
            subject: 'Reseteo de Contraseña',
            html: resetPassNotification(link)
        }
        await sendEmail(mail);

        res.send({ status: 'success', message: 'link OK', access_token: accessToken });
    } catch (error) {
        req.logger.error(`loginUser = ` + error.message);
        res.status(500).send({ status: 'error', error });
    };

};

const linkPass = (req, res) => {
    
    const accessToken = req.query.token;

    res.cookie(
        PRIVATE_COOKIE, accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
    );

    res.render('linkPassword.handlebars');

};

const changePassword = async (req, res) =>{
    try {
        const { password } = req.body;
        const email = req.user.email;
        const user = await getUserService({ email });

        if (isValidPassword(user, password)) {
            req.logger.warning(`User = ` + responseMessages.invalid_password); 
            return res.status(401).send({ status: 'error', error: responseMessages.invalid_password })
        } else {
            const id = String(user._id)
            const newPass =  createHash(password)
            const result = await updateUserService(id, { "password": newPass });
            
            //Valido UPDATE
            if (result.acknowledged & result.modifiedCount!==0) {
                const response = { status: "Success", payload: `La contraseña fue cambiada con exito!`};       
                //muestro resultado y elimino la cookie
                res.clearCookie(PRIVATE_COOKIE);
                res.status(200).json(response);
            } else {
                req.logger.error(`putPass = Error no se pudo actualizar el producto, verifique los datos ingresados`);
                //muestro resultado error
                res.status(404).json({ status: "NOT FOUND", data: "Error no se pudo actualizar el producto, verifique los datos ingresados"});
            };   
        }
    } catch(error) {
        res.status(500).send({ status: 'error', error });
    };
};

const changeRol = async (req, res) => {
    const uid = String(req.params.uid);
    const { role } = req.body;
    const result = await updateUserService(uid, { "role": role });

    try { 
        //Valido UPDATE
        if (result.acknowledged & result.modifiedCount!==0) {
            const response = { status: "Success", payload: `El rol fue cambiado con exito!`};       
            //muestro resultado y elimino la cookie
            res.status(200).json(response);
        } else {
            req.logger.error(`putPass = Error no se pudo actualizar el rol, verifique los datos ingresados`);
            //muestro resultado error
            res.status(404).json({ status: "NOT FOUND", data: "Error no se pudo actualizar el rol, verifique los datos ingresados"});
        };   
    } catch(error) {
        res.status(500).send({ status: 'error', error });
    };
};

// OBTENER TODOS LOS USUARIOS
const getAllUser = async(req, res) => {
    try {
        const usersList = await getAllUserService();
        const users = [];
        usersList.forEach(element => {
            users.push(new UsersDto(element))
        });
        const response ={ status: "Success", payload: users};
        users.isValid = users.length > 0
        // VISTA DE USUARIOS
        //res.status(200).json(response);
        res.render("users.cards.handlebars", { users });
    } catch (error) {
        req.logger.error(`getAllUser = No se pudieron mostrar los usuarios!`);
        const response = { status: "NOT FOUND", payload: 'No se pudieron mostrar los usuarios!', error };
        res.status(404).send(response);
    };
};

const uploadFile = async (req, res) => {
    try {
        const id = String(req.params.uid); 
        const typeDocument = req.body.typedocument;
        const newDocument = [];

        if (!req.files) {
            return res.status(404).json({ status: "NOT FOUND", data: "Error no se pudo actualizar el usuario, porque no hay archivos!"});
        };
        if (req.files.products) {
            return res.status(200).json({ status: "Success", data: "Se almaceno la imagen del producto correctamente!"});
        }
        if (req.files.profiles) {
            req.files.profiles.forEach(element => {
                const filename = element.filename;
                let name = element.fieldname;
                if (typeDocument){
                    name=typeDocument;
                };
                const document = {
                    name: name,
                    reference: `http://localhost:8080/files/${name}/${filename}`
                };
                newDocument.push(document);
            });
        };
        if (req.files.documents) {
            req.files.documents.forEach(element => {
                const filename = element.filename;
                let name = element.fieldname;
                if (typeDocument){
                    name=typeDocument;
                    updateUserPushService(id, {status: name});
                };
                const document = {
                    name: name,
                    reference: `http://localhost:8080/files/${name}/${filename}`
                };
                newDocument.push(document);
            });
        };

        // ACTUALIZO DOCUMENTS EN EL USER HACIENDO PUSH
        const result = await updateUserPushService(id, {documents: newDocument});
        
        // VALIDO EL UPDATE
        if (result.acknowledged & result.modifiedCount!==0) {
            const response = { status: "Success", payload: `Se adjunto el archivo al usuario!`};       
            res.status(200).json(response);
        } else {
            req.logger.error(`insertFile = No subio la imagen`);
            res.status(404).json({ status: "NOT FOUND", data: "Error no se pudo subir el archivo!"});
        }; 

    } catch (error) {
        res.status(500).send({message: "Could not upload the file: " + req.files.originalname, error});
    };
}

const deleteUser = async (req, res) => {
    try {
        
        const id = String(req.params.uid);
        const { motivo } = req.body;
        const user = await getUserByIdService({ _id: id });
        
        if(user) {
            // eliminar el cart asociado al user
            const cartId = user.cart;
            await deleteCartByIdService(cartId);

            // eliminar el usuario
            const result = await deleteUserByIdService(id);
            
            // Envío mail de aviso
            const type = "Usuario"
            const detail = `usuario con mail ${user.email}`
            const reason = `${motivo}`
            const mail = { 
                to: user.email,
                subject: 'Eliminación de Usuario',
                html: deleteNotification(type, detail, reason)
            };
            
            await sendEmail(mail);
            
            if (result.acknowledged & result.deletedCount!==0) {
                const response = { status: "Success", payload: `El usuario fue eliminado con Exito!`};       
                res.status(200).json(response);
            } else {
                req.logger.error(`deleteUser = No se pudo eliminar el user`);
                res.status(404).json({ status: "NOT FOUND", data: "Error no se pudo eliminar el usuario, verifique los datos ingresados"});
            };
        } else {
            req.logger.error(`deleteUser = No se pudo eliminar el user. No se encontro el usuario.`);
            res.status(404).json({ status: "NOT FOUND", data: "Error no se pudo eliminar el usuario. No se encontro el usuario."});
        };
    } catch (error) {
        res.status(500).send({ status: 'error', error });
    }
};

const deleteAllUser = async (req, res) => {
    try {
        const day = 1;
        /* const condition = moment().subtract(day, 'days'); */
        const condition = moment().subtract(30, 'minutes');

        // no quiero borrar estos IDS
        const condUserExclude = {$and: [{ _id: {$ne: '648db29c17e05dbabba91f03'} }, { _id: {$ne: '648db6f58ce7033d67aee2b0'} }, { _id: {$ne: '64ada31c22ec3fa7e8c91be3'} }, { _id: {$ne: '64ade5160a5c4030e21aa515'} }, { _id: {$ne: '64be674527cf84a028a6c668'} }, { _id: {$ne: '64e0ad827686bbf728168024'} }]}
        // busco los usuarios para eliminar sus carros
        const usersAll = await getAllUserService( {$and: [{ last_connection: {$lt: condition} }, condUserExclude]} );
        
        //Elimino los carritos asociados a los usuarios a eliminar
        usersAll.forEach(async (element) => {
            //Elimino el carrito asociado al usuario
            await deleteCartByIdService(element.cart);

            // Envío mail de aviso
            const type = "Usuario"
            const detail = `usuario con mail ${element.email}`
            const reason = "Por inactividad de la cuenta"
            const mail = { 
                to: element.email,
                subject: 'Eliminación de Usuario',
                html: deleteNotification(type, detail, reason)
            }
            
            await sendEmail(mail);

        });
        
        const usersDelete = await deleteAllUserService( {$and: [{ last_connection: {$lt: condition} }, condUserExclude]} );
        
        //Valido que se realizo el UPDATE
        if (usersDelete.acknowledged & usersDelete.deletedCount!==0) {
            const response = { status: "Success", payload: `Se eliminaron ${usersDelete.deletedCount} usuarios!`};       
            //muestro resultado
            res.status(200).send(response);
            
        } else {
            req.logger.error(`deleteAllUser = No se pudo eliminar el user`);
            //muestro resultado error
            res.status(404).json({ status: "NOT FOUND", data: "Error no se pudo eliminar el usuario, verifique los datos ingresados"});
        };
    } catch (error) {
        res.status(500).send({ status: 'error', error });
    }
};

export { 
    registerUser, 
    loginUser, 
    logoutUser, 
    gitUser, 
    gitCallbackUser, 
    currentUser,
    passLink,
    linkPass,
    changePassword,
    changeRol,
    getAllUser,
    uploadFile,
    deleteUser,
    deleteAllUser
};