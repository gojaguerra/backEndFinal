// Conecto el socket para comunicarnos con el server
const socket = io();

const container = document.getElementById('container');

//Socket
socket.on('showProducts', data => {
    
    container.innerHTML = ``
    data.forEach(prod => {
        container.innerHTML +=`<div class="card" style="width: 18rem;">
            <img src="${prod.thumbnail}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${prod.title}</h5>
                <p class="card-text">Descripción:  ${prod.description}</p>
                <p class="card-text">Precio:$ ${prod.price}</p>
                <p class="card-text">Owner: ${prod.owner}</p>
            </div>
            <button type="button" class="btn btncaja btn-warning" 
            id="${prod._id}" onclick="procesDelId(id)">
            Eliminar
        </button>
            </div>` 
    })
});

function procesDelId(comp){
    const delProduct = document.getElementById(`${comp}`)
    if(delProduct){ 
        Swal.fire({
            title: `Está seguro de eliminar el producto ${comp}? `,
            icon: 'warning',
            showCancelButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(result =>{
            if (result.isConfirmed) {
                id = result.value;
                fetch('/api/products/' + comp, {
                    method: 'DELETE'
                    })
                    .then((result) => {
                        if (result.status === 200) {
                            Swal.fire({
                                title: 'Producto Eliminado',
                                icon: 'success'
                            })
                            window.location= "/realTimeProducts";
                        }else{
                            if (result.status === 403) {
                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'error',
                                    title: 'No cuenta con permisos para realizar dicha acción!',
                                    showConfirmButton: true,
                                })
                            }else {
                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'error',
                                    title: 'Hubo un error al registrar la eliminición del producto, intente luego',
                                    showConfirmButton: true,
                                })                
                            }    
                        }
                    })
            }
       }); 
    };
};

// Botón para ir al HOME
const goHome = document.getElementById('goHome')
if(goHome) {
    goHome.addEventListener('click', (event) => {
        /* window.location= "/home"; */
        window.location= "/";
    });
};

let nIntervId;

const form = document.getElementById('productForm');

function delayNavigateOk() {
    if (!nIntervId) {
        nIntervId = setInterval(navigateOk, 2000);
    };
};

function navigateOk() {
    window.location.replace('/realTimeProducts');
};

if(form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const data = new FormData(form);
        const obj = {};
        data.forEach((value, key) => obj[key] = value);
        fetch('/api/products', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(result => {
            if (result.status === 200) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Producto creado',
                    showConfirmButton: true,
                })
                delayNavigateOk();
            }else{
                if (result.status === 400) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'Los datos ingresados son incorrectos, vuelva a intentarlo!',
                        showConfirmButton: true,
                    })
                }else{
                    if (result.status === 501) {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: 'Código duplicado, vuelva a intentarlo!',
                            showConfirmButton: true,
                    })}else{
                        
                        if (result.status === 403) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: 'No tiene permisos para esta acción!',
                                showConfirmButton: true,
                        })}else{
                            Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: 'Hay datos incompletos, vuelva a intentarlo',
                                showConfirmButton: true,
                            });
                        }
                    }
                }
            }
        });
    });
};