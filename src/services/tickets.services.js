import { ticketsRepository } from '../repositories/index.js';

const getTicketsById = async (id) => {
    const ticket = await ticketsRepository.getTicketsById(id);
    return ticket;
};

export {
    getTicketsById
};