let nIntervId;

// Botón para ir al HOME
const goHome = document.getElementById('goHome')
if(goHome) {
    goHome.addEventListener('click', (event) => {
        /* window.location= "/home"; */
        window.location= "/";
    });
};

function delayNavigateOk() {
    if (!nIntervId) {
        nIntervId = setInterval(navigateOk, 2000);
    };
};

function navigateOk() {
    window.location.replace('/');
};

const form = document.getElementById('resetForm');
if (form) {
form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Enviando correo...',
        showConfirmButton: true,
      })
    fetch('/api/sessions/password-link', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Se envio un email de reset!',
                showConfirmButton: true,
              })
            delayNavigateOk();
        }else{
            if (result.status === 400) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'El usuario no existe, por favor registrese',
                    showConfirmButton: true,
                })
            }else{
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Hay datos incompletos, vuelva a intentarlo',
                    showConfirmButton: true,
                })                
            }    
        }
    });
});
};

const formPass = document.getElementById('setPassForm');
if (formPass) {
    formPass.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = new FormData(formPass);
        const obj = {};
        data.forEach((value, key) => obj[key] = value);
        Swal.fire({
            position: 'center',
            title: 'Cambiando contraseña ..',
            showConfirmButton: false,
          })
        fetch('/api/sessions/password-change/', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(result => {     
            if (result.status === 200) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'La contraseña fue cambiada con exito!',
                    showConfirmButton: true,
                  })
    
                delayNavigateOk();
                //window.location.replace('/');
            }else{
                if (result.status === 401) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'La contraseña debe ser distinta a la actual!',
                        showConfirmButton: true,
                    })
                }else{
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'No se pudo actualizar la contraseña!',
                        showConfirmButton: true,
                    })                
                }    
            }
        });
    });
};