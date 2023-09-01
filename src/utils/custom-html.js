export const resetPassNotification = (link) => {
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Notificación Cambio de Password</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
  
        .notification {
          background-color: #fff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          padding: 20px;
          max-width: 400px;
          text-align: center;
        }
  
        .notification h2 {
          margin-bottom: 20px;
          color: #333;
        }
  
        .notification p {
          color: #777;
        }
  
        .btn {
          background-color: #007bff;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
  
        .btn:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="notification">
        <h2>Cambio de contraseña</h2>
        <p>Estimado cliente, <br>
        <br />
        Hemos recibido una solicitud para restablecer su contraseña</p>
        <a href="${link}"> <button>Reset Password</button> </a>
        <p>Si usted no ha realizado esta solicitud, ignore este mensaje!</p>
        <p>Saludos </p>
        <p>Comision site 39760</p>
      </div>
    </body>
    </html>`
    return html;
  };