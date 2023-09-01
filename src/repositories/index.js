import { Carts, Products, Users, Tickets } from '../dao/factory.js';
import CartsRepository from '../repositories/carts.repository.js';
import ProductRepository from '../repositories/products.repository.js';
import UsersRepository from '../repositories/users.repository.js';
import TicketsRepository from '../repositories/ticket.repository.js';

const cartsRepository = new CartsRepository(new Carts());
const productsRepository = new ProductRepository(new Products());
const usersRepository = new UsersRepository(new Users());
const ticketsRepository = new TicketsRepository(new Tickets());

export {
    cartsRepository,
    productsRepository,
    usersRepository,
    ticketsRepository
};