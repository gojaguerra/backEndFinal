import express from 'express';
import { Server } from 'socket.io';
import { __dirname } from "./utils/utils.js";
import homeRouter from "./routes/home.router.js";
import cartsRouter from "./routes/cart.router.js";
import productRouter from "./routes/products.router.js";
import viewsProdRouter from "./routes/viewsProd.router.js";
import viewsChatPage from "./routes/viewsChatPage.route.js"
import sessionsRouter from './routes/sessions.router.js'
import usersRouter from './routes/users.router.js';
import mockingproducts from './routes/mockingproducts.route.js';
import loggerTest from './routes/loggerTest.route.js';
import "./dao/dbManagers/dbConfig.js";
import config from "./config/config.js";
import viewsRouter from './routes/views.router.js';
import ProductManager from './dao/dbManagers/productManager.js';
import MessageManager from './dao/dbManagers/chatManager.js';
import cookieParser from 'cookie-parser';
import handlebars from "express-handlebars";
import initializePassport from './config/passport.config.js';
import passport from 'passport';
import { addLogger } from './utils/logger.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

const app = express();
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//SWAGGER
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación del proyecto Comision 39760 - Jose Guerra',
            description: 'API demo para comisión 39760 CoderHouse'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Middleware para cookies
app.use(cookieParser());

// Middleware para logger
app.use(addLogger);

//middleware Log conexiones
app.use((req, res, next) => {
    console.log(`Nueva ${req.method} - ${req.path}`);
    next();
});

//PASSPORT
initializePassport();
app.use(passport.initialize());

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/', viewsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);
app.use('/home', homeRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);
app.use('/realtimeproducts', viewsProdRouter);
app.use('/chat', viewsChatPage);
// MONCKING
app.use('/mockingproducts', mockingproducts);
// TEST LOGGER
app.use('/loggerTest', loggerTest);

const server = app.listen(config.port, () => console.log('Server running'));

const io = new Server(server);
app.set('socketio',io);

const productManager = new ProductManager();
const messageManager = new MessageManager();

const messages = [];

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado');
    const products = await productManager.getProducts();
    io.emit("showProducts", products.docs);

    socket.on('message', data => {
        messages.push(data);
        io.emit('messageLogs', messages);
        
        // Persistir en MONGO el chat
        try {
            const messageUser = messageManager.addMessage(data);
        } catch (error) {
            console.log("Error",error);
        }

    });

    socket.on('authenticated', data => {
        socket.emit('messageLogs', messages);
        socket.broadcast.emit('newUserConnected', data);
    });

});