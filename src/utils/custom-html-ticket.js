export const ticketNotification = (ticketId, sumTotal, linkFollow, linkTicket) => {
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Notificación de Nuevo Pedido # ${ticketId}</title>
</head>
<body>
    <h1>Notificación de Nuevo Pedido # ${ticketId}</h1>
    <p>Estimado cliente,</p>
    
    <p>Gracias por haber realizado un nuevo pedido.</p>
    <p>El importe total es de $ ${sumTotal}.</p>
    
    <p>Puede consultar su pedido</p>
    <a href="${linkTicket}"> <button>Pedido</button> </a>

    <p>Puede hacer seguimiento de su pedido</p>
    <a href="${linkFollow}"> <button>Seguimiento</button> </a>
    
    <p>Si tienes alguna pregunta o necesitas asistencia, no dudes en ponerte en contacto con nuestro equipo de soporte.</p>
    
    <p>Gracias por utilizar nuestros servicios.</p>
    
    <p>Atentamente,</p>
    <p>Comision site 39760</p>
</body>
</html>`
return html;
};
