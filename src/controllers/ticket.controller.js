import { getTicketsById as getTicketsByIdService } from '../services/tickets.services.js';

// OBTENER SI EXISTE UN CARRITO PASANDO EL ID
const getTicketsById = async(req, res) => {
    const ticketId = String(req.params.tid);
    try {
        const ticket = await getTicketsByIdService(ticketId);
        const response ={ status: "Success", payload: ticket };
        console.log(ticket);
        // VISTA DEL CARRITO
        // res.status(200).json(response);
        res.render("ticket.handlebars", ticket );
    } catch (error) {
        req.logger.error(`getTicketById = El ticket con ID ${ticketId} NO existe!`);
        const response = { status: "NOT FOUND", payload: `El ticket con ID ${ticketId} NO existe!` };
        res.status(404).send(response);
    };
};

export { 
    getTicketsById
};