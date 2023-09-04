let nIntervId;

function delayNavigateCart() {
    if (!nIntervId) {
        nIntervId = setInterval(navigateCart(), 2000);
    };
};

function navigateCart() {
    window.location.reload();
};

function delayNavigateOk() {
    if (!nIntervId) {
        nIntervId = setInterval(navigateOk, 2000);
    };
};

function navigateOk() {
    window.location.replace('/');
};

// Botón para ir al HOME
const goHome = document.getElementById('goHome')
if(goHome) {
    goHome.addEventListener('click', (event) => {
        window.location= "/";
    });
};

// Botón para ver lista de productos
const viewProduct = document.getElementById('viewProduct')
if(viewProduct) {
    viewProduct.addEventListener('click', (event) => {
        window.location= "/api/products";
    });
};

// FUNCTION para el Botón para ELIMINAR PRODUCTOS DEL CARRITO
function cartDeleteItem(comp){
    const id = comp.id;
    const butCart = document.getElementById(`${id}`)
    if(butCart){ 
        Swal.fire({
            title: `Está seguro de eliminar el producto? `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar!',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(async result => {
            if (result.isConfirmed) {
                const pruebaCurrent = await fetch('/api/sessions/current', {
                    method: 'GET'
                });
                const data = await pruebaCurrent.json();
                const cartId=data.payload.cart;
                const url='/api/carts/'+cartId+'/product/'+id
                fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((result) => {
                    if (result.status === 200) {
                        Swal.fire({
                            title: 'Producto Eliminado',
                            icon: 'success'
                        })
                        delayNavigateCart();
                    }else{
                        if (result.status === 403) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: 'No cuenta con permisos para realizar dicha acción!',
                                showConfirmButton: true,
                            })
                        }else{
                            Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: 'Hubo un error al registrar la eliminición del producto, intente luego',
                                showConfirmButton: true,
                            })
                        }
                    }
                });
            };
       });
    };
};

// EVENTO para el Botón de finalizar pedido
const closeCart = document.getElementById('cerrarTicket')
if(closeCart) {
     closeCart.addEventListener('click', async (event) => {
        Swal.fire({
        title: `Está seguro de finalizar la compra? `,
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Finalizar',
        allowOutsideClick: false,
        allowEscapeKey: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
        }).then(async result => {
            if (result.isConfirmed) {
                const pruebaCurrent = await fetch('/api/sessions/current', {
                    method: 'GET'
                });

                Swal.fire({
                    title: 'Procesando compra...',
                    timer: 5000,
                    timerProgressBar: true,
                  })

                const data = await pruebaCurrent.json();
                const cartId=data.payload.cart;
                const url='/api/carts/'+cartId+'/purchase'
                fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((result) => {
                    if (result.status === 200) {
                        Swal.fire({
                            title: 'Carrito Cerrado',
                            icon: 'success'
                        })
                        Swal.fire({
                            title: '<strong>Pedido generado!</strong>',
                            icon: 'info',
                            html:
                              'Su pedido a sido generado con exito, ' +
                              'y se han enviado instrucciones por email.<br>' +
                              'Seguimiento <a href="https://www.andreani.com/#!/personas" target="_blank">AQUI</a> ',
                            showCloseButton: true,
                            showCancelButton: false,
                            focusConfirm: false,
                            confirmButtonText:
                              '<i class="fa fa-thumbs-up"></i> Gracias!',
                            confirmButtonAriaLabel: 'Thumbs up, great!',
                            cancelButtonText:
                              '<i class="fa fa-thumbs-down"></i>'
                          }).then(()=>{
                            window.location.replace("/");
                          })
                    }else{
                        if (result.status === 201) {

                            Swal.fire({
                                title: 'Carrito Cerrado',
                                icon: 'success'
                            })
                            Swal.fire({
                                title: '<strong>Pedido generado!</strong>',
                                icon: 'info',
                                html:
                                  'Su pedido a sido generado con exito, ' +
                                  'pero <b>hay items que se excluyeron por falta de stock.</b> ' +
                                  'Se han enviado instrucciones por email.<br>' +
                                  'Seguimiento <a href="https://www.andreani.com/#!/personas" target="_blank">AQUI</a> ',
                                showCloseButton: true,
                                showCancelButton: false,
                                focusConfirm: false,
                                confirmButtonText:
                                  '<i class="fa fa-thumbs-up"></i> Gracias!',
                                confirmButtonAriaLabel: 'Thumbs up, great!',
                                cancelButtonText:
                                  '<i class="fa fa-thumbs-down"></i>'
                              }).then(()=>{
                                window.location.replace("/");
                              })
                        }else{
                            if (result.status === 405){
                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'error',
                                    title: 'Hubo un error al registrar el pedido por falta de stock, intente luego',
                                    showConfirmButton: true,
                                })
                            }else{
                                if (result.status === 403) {
                                    Swal.fire({
                                        position: 'top-end',
                                        icon: 'error',
                                        title: 'No cuenta con permisos para realizar dicha acción!',
                                        showConfirmButton: true,
                                    })
                                }else{
                                    Swal.fire({
                                        position: 'top-end',
                                        icon: 'error',
                                        title: 'Hubo un error al registrar la finalizacion del carrito, intente luego',
                                        showConfirmButton: true,
                                    })
                                }
                            }
                        }
                    }
                });
            };
        });
    });
};

// EVENTO para el Botón de vaciar pedido
const deleteCart = document.getElementById('deleteCart')
if(deleteCart) {
    deleteCart.addEventListener('click', async (event) => {
        Swal.fire({
        title: 'Esta seguro de eliminar todos los productos del carrito?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar',
        allowOutsideClick: false,
        allowEscapeKey: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
        }).then(async result => {
            if (result.isConfirmed) {
                const pruebaCurrent = await fetch('/api/sessions/current', {
                    method: 'GET'
                });
                const data = await pruebaCurrent.json();
                const cartId=data.payload.cart;
                const url='/api/carts/'+cartId
                fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((result) => {
                    if (result.status === 200) {
                        Swal.fire({
                            title: 'Carrito Eliminado!',
                            icon: 'success'
                        })
                        delayNavigateCart();
                    }else{
                        if (result.status === 403) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: 'No cuenta con permisos para realizar dicha acción!',
                                showConfirmButton: true,
                            })
                        }else{
                            Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: 'Hubo un error al registrar la eliminación del carrito, intente luego',
                                showConfirmButton: true,
                            })
                        }
                    }
                });
            };
        });
    });
};
