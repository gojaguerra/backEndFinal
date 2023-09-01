import dotenv from 'dotenv';

dotenv.config();

export default {
    ENVIRONMENT: process.env.NODE_ENV,
    persistence: process.env.PERSISTENCE,
    mongoUrl: process.env.MONGO_URL,
    port: process.env.PORT,
    url_base: process.env.URL_BASE,
    gitClienteID: process.env.GITCLIENTID,
    gitClientSecret: process.env.GITCLIENTSECRET,
    gitCallbackURL: process.env.GITCALLBACKURL,
    userNodemailer: process.env.USER_NODEMAILER,
    passNodemailer: process.env.PASS_NODEMAILER
};