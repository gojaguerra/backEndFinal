let nIntervId;

function delayNavigateOkUsers() {
    if (!nIntervId) {
        nIntervId = setInterval(navigateOk, 2000);
    };
};

function navigateOk() {
    window.location.replace('/api/users/usersrole');
};

// Selector de Orden de precio
const ordPri = document.getElementById('ordPri')
if(ordPri){
    ordPri.addEventListener('change', () => {
    let sort ="";
    if (ordPri.options[ordPri.selectedIndex].value === "v2" ){
        sort = 1; 
    }else if (ordPri.options[ordPri.selectedIndex].value === "v3" ){  
        sort = -1;
    } 
    window.location= "/api/products?sort="+`${sort}`;
    });
};

// Selector de Categoría
const categSel = document.getElementById('categSel1')
if(categSel){
    categSel.addEventListener('change', () => {
    if (categSel.options[categSel.selectedIndex].value === "c6" ){
        window.location= "/api/products";
    }else{
        const query = categSel.options[categSel.selectedIndex].text;
        window.location= "/api/products?query="+`${query}`;
    }; 
    }); 
}; 

// Botón para agregar / Eliminar productos
const addProduct = document.getElementById('addProduct')
if(addProduct) {
    addProduct.addEventListener('click', (event) => {
        window.location= "/realTimeProducts";
    });
};

// Botón para ir al HOME
const goHome = document.getElementById('goHome')
if(goHome) {
    goHome.addEventListener('click', (event) => {
        /* window.location= "/home"; */
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

// Botón para ir al chat
const viewChat = document.getElementById('viewChat')
if(viewChat) {
    viewChat.addEventListener('click', (event) => {
        window.location= "/chat";
    });
};

// Botón para ver el carrito de prueba
const viewCart = document.getElementById('viewCart')
if(viewCart) {
    viewCart.addEventListener('click', async (event) => {
        const prueba = await fetch('/api/sessions/current', {
            method: 'GET'
        });
        const data = await prueba.json();
        const cart =data.payload.cart;
        window.location= "/api/carts/"+cart;
    });
};

// Botón para acceder a ADMINISTRAR USUARIOS
const changeRole = document.getElementById('changeRole')
if(changeRole) {
    changeRole.addEventListener('click', async (event) => {
        await fetch('/api/users/usersrole', {
            method: 'GET'
        })
        .then((result) => {
            if (result.status === 200) {
                window.location= '/api/users/usersrole';
            }else{
                if (result.status === 403) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'No tiene permisos para administrar usuarios!',
                        showConfirmButton: true,
                    });
                };
            };
        });
    });
};

// Botón para ELIMINAR USUARIOS
function userDeleteId(comp){
    const id = comp.id;
    const butCart = document.getElementById(`${id}`)
    if(butCart){ 
        Swal.fire({
            title: `Está seguro de eliminar el user? `,
            icon: 'warning',
            input: 'text',
            inputLabel: "Ingrese el motivo de la eliminación:",
            inputValidator: (value) =>{
                return !value && 'Por favor ingrese un motivo!';
            },
            showCancelButton: true,
            confirmButtonText: 'Eliminar!',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(result =>{
            if (result.isConfirmed) {
                const motivo= `{"motivo": "${result.value}"}`;
                const url='/api/users/delete/'+id
                fetch(url, {
                    method: 'DELETE',
                    body: motivo,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((result) => {
                    if (result.status === 200) {
                        Swal.fire({
                            title: 'Usuario Eliminado',
                            icon: 'success'
                        })
                        delayNavigateOkUsers();
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
                                title: 'Hubo un error al registrar la eliminición del usuario, intente luego',
                                showConfirmButton: true,
                            })                
                        }    
                    }
                });
            };
       }); 
    };
};

// Botón para el cambio de ROL
function userChangeRoleId(comp){
    const id = comp.id;
    const butCart = document.getElementById(`${id}`)
    if(butCart){ 
        Swal.fire({
            title: 'Cambio de Rol',
            text: 'Seleccione de la lista',
            input: 'select', 
            inputOptions:{
                admin: 'Admin',
                premium: 'Premium',
                user: 'User'
            },
            showCancelButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Aceptar'
        }).then(async result =>{
            if (result.isConfirmed) {
                const obj=`{"role": "${result.value}"}`;
                const url='/api/users/premium/'+id
                fetch(url, {
                    method: 'POST',
                    body: obj,
                    headers: {
                        'Accept': "application/json",
                        'Content-Type': 'application/json; charset=UTF-8'
                    }
                })
                .then((result) => {
                    if (result.status === 200) {
                        Swal.fire({
                            title: 'Ha cambiado el rol correctamente',
                            icon: 'success'
                        })
                        delayNavigateOkUsers();
                        /* window.location= "/api/users/usersrole"; */
                    }else{
                        if (result.status === 403) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: 'User PREMIUM no cumple los requisitos!',
                            })
                        }else{
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: 'Hubo un error al registrar el producto, intente luego',
                            showConfirmButton: true,
                        })}
                    }
                })
            }
        }); 
    };
};

// Botón para Eliminar usuarios por inactividad
const goDeleteForTime = document.getElementById('goDeleteForTime')
if(goDeleteForTime) {
    goDeleteForTime.addEventListener('click', (event) => {
        Swal.fire({
            title: 'Eliminar Usuarios por Inactividad',
            icon: 'warning',
            showCancelButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Eliminar'
        }).then(async result =>{
            if (result.isConfirmed) {
                await fetch('/api/users/deleteall', {
                    method: 'DELETE',
                    headers: {
                        'Accept': "application/json",
                        'Content-Type': 'application/json; charset=UTF-8'
                    }
                })
                .then((result) => {
                    console.log(result);
                    if (result.status === 200) {
                        Swal.fire({
                            title: 'Se eliminaron los usuarios correctamente',
                            icon: 'success',
                            timer: 2000
                        })
                        delayNavigateOkUsers();
                    } else { 
                        if (result.status === 404) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: 'No se encontraron usuarios a eliminar!',
                                showConfirmButton: true,
                        }) 
                    } else {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: 'Hubo un error al querer eliminar usuarios, intente luego',
                            showConfirmButton: true,
                        })
                    }
                }
                })
            }        
        })        
    })
};

// Botón para ver finalizar pedido
const closeCart = document.getElementById('cerrarTicket')
if(closeCart) {
    /* closeCart.addEventListener('click', async (event) => {
        const prueba = await fetch('/api/sessions/current', {
            method: 'GET'
        });
        const data = await prueba.json();
        const cart =data.payload.cart;
        window.location= "/api/carts/"+cart;
    }); */
};

// Botón para insertar en carro
function procesoId(comp){
    const id = comp.id
    const butCart = document.getElementById(`${id}`)
    if(butCart){ 
        Swal.fire({
            title: 'Muy buena eleccion',
            text: 'Ingrese la cantidad a pedir',
            input: 'text',
            inputValidator: (value) =>{
                return !value && "Ingrese la cantidad a pedir";
            },
            showCancelButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Agregar al Carrito'
        }).then(async result =>{
            if (result.isConfirmed) {
                const obj=`{"quantity": ${result.value}}`;
                const prueba = await fetch('/api/sessions/current', {
                    method: 'GET'
                });
                const data = await prueba.json();
                const cart =data.payload.cart;
                const cartId='/api/carts/'+cart+'/product/'+id
                fetch(cartId, {
                    method: 'PUT',
                    body: obj,
                    headers: {
                        'Accept': "application/json",
                        'Content-Type': 'application/json; charset=UTF-8'
                    }
                })
                .then((result) => {
                    if (result.status === 200) {
                        Swal.fire({
                            title: 'Producto Agregado al Carrito',
                            icon: 'success'
                        })
                    }else{
                        if (result.status === 405) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: 'User PREMIUM no puede agregar al Carrito productos propios!',
                            })
                        }else{
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: 'Hubo un error al registrar el producto, intente luego',
                            showConfirmButton: true,
                        })}
                    }
                })
            }
        }); 
    };
};

// Botón para ver profile
const viewProfile = document.getElementById('viewProfile')
if(viewProfile) {
    viewProfile.addEventListener('click', (event) => {
        window.location= "/profile";
    });
};

// Botón para logout
const logout = document.getElementById('logout')
if(logout) {
    logout.addEventListener('click', (event) => {
        window.location= "/api/sessions/logout";
    });
};