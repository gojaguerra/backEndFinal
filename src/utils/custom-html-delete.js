export const deleteNotification = (type, detail, reason) => {
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Notificación de Eliminación de ${type}</title>
</head>
<body>
    <h1>Notificación de Eliminación de ${type}</h1>
    <p>Estimado cliente,</p>
    
    <p>Se ha eliminado: ${detail}.</p>
    <p>Por el siguiente motivo: ${reason}.</p>
    
    <p>Si tienes alguna pregunta o necesitas asistencia, no dudes en ponerte en contacto con nuestro equipo de soporte.</p>
    
    <p>Gracias por utilizar nuestros servicios.</p>
    
    <p>Atentamente,</p>
    <p>Comision site 39760</p>
</body>
</html>`
return html;
};
