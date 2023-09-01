import config from "../config/config.js";

let Carts;
let Products;
let Users;
let Tickets;
const persistence = config.persistence;

switch(persistence) {
    case 'MONGO':
        const mongoose = await import("mongoose");
        await mongoose.connect(config.mongoUrl);
        const { default: CartsMongo } = await import('./dbManagers/cartManager.js');
        const { default: ProductsMongo } = await import('./dbManagers/productManager.js');
        const { default: UsersMongo } = await import('./dbManagers/user.Manager.js');
        const { default: TicketsMongo } = await import('./dbManagers/ticket.Manager.js');
        Carts = CartsMongo;
        Products = ProductsMongo;
        Users = UsersMongo;
        Tickets = TicketsMongo;
        break;
    case 'FILES':
        const { default: CartsFiles } = await import('./managers/cartManager.js');
        const { default: ProductsFiles } = await import('./managers/productManager.js');
        Carts = CartsFiles;
        Products = ProductsFiles;
        break;
}

export {
    Carts,
    Products,
    Users,
    Tickets
};