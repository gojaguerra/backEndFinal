import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../helpers/proyect.constants.js';
import { responseMessages } from '../helpers/proyect.helpers.js';
import nodemailer from 'nodemailer';
import config from "../config/config.js";
import multer from 'multer';
import { getUserById } from '../services/user.services.js';

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h' });
    return token;
};

const authToken = (req, res, next) => {
    const authToken = req.headers.authorization;
    
    if (!authToken) return res.status(401).send({error: responseMessages.not_authenticated});

    const token = authToken.split(' ')[1];

    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({error: responseMessages.not_authorized});
        req.user = credentials.user;
        next();
    });
};

const authTokenResetPass = (req, res, next) => {
    const authToken = req.query.token
    if(!authToken) return res.redirect('/resetPasswordError');
    jwt.verify(authToken, PRIVATE_KEY, (error, credentials) => {
    if (error) return res.redirect('/resetPasswordError');
        req.user = credentials.user;
        next();
    });
};

const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.redirect('/login')
            }
            req.user = user;
            next();
        })(req, res, next)
    };
};

const authorization = (role) => {
    return async (req, res, next) => {
        if(req.user.role != role) return res.status(403).send({error: responseMessages.not_permissions});
        next();
    };
};

const authorizationRole = (role) => {
    return async (req, res, next) => {
        let roleOk=false;
        const userRole=req.user.role;
        role.forEach(element => {
            if (userRole===element){
                roleOk=true;
            };
        });
        if(!roleOk) return res.status(403).send({error: responseMessages.not_permissions});
        next();
    };
};

const verifyUserStatus = async (req, res, next) => {
    const id = String(req.params.uid)
    let user;
    try {
        user = await getUserById({_id: id});
    } catch (error) {
        return res.status(500).send({error: responseMessages.incorrect_user});
    };
    if(user){
        if(user.role==="user") {
            let identification, address, account;
            user.status.forEach(element => {
                switch (element) {
                    case "IDENTIFICATION":
                        identification=true;
                        break;
                    case "ADDRESS":
                        address=true;
                        break;
                    case "ACCOUNT":
                        account=true;
                        break;
                    }
            });
            if(identification && address && account){
                next();
            } else {
                return res.status(403).send({error: responseMessages.not_complete_role});
            }
        } else {
            next();
        }
    } else {
        return res.status(403).send({error: responseMessages.user_notfound});
    };
};

const generateProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        code: faker.string.alphanumeric(10),
        stock: faker.string.numeric(1),
        category: faker.commerce.department(),
        thumbnail: [faker.image.url()]
    };
};

const generateTokenResetPass = (user) => {
    const tokenResetPass = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '1h' });
    return tokenResetPass;
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.userNodemailer,
        pass: config.passNodemailer
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    
        switch (file.fieldname) {
            case "profiles":
                cb(null, `${__dirname}/public/files/profiles`);
                break;
            case "products":
                cb(null, `${__dirname}/public/files/products`);
                break;
            case "documents":
                cb(null, `${__dirname}/public/files/documents`);
                break;    
            default:
                break;
        }  
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploader = multer({
    storage, onError: (err, next) => {
        console.log(err);
        next();
    }
});

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);
const __dirname = path.join(dirname, '..');

export {
    __dirname,
    createHash,
    isValidPassword,
    generateToken,
    passportCall,
    authToken,
    authorization,
    generateProduct,
    generateTokenResetPass,
    transporter,
    authTokenResetPass,
    authorizationRole, 
    uploader,
    verifyUserStatus
};