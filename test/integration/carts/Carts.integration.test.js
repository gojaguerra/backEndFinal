import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing de carts', () => {
    
    let cookie;
    let idCart;
    const idProduct1='64660f16b7de90929cb6eb2a';
    const idProduct2='64660f78b7de90929cb6eb2e';
    
    // LOGUEO al USER y OBTENGO EL carrito asociado al user
    before(async function () {
            const credentialsMock = {
                email: 'tutiguerra99@gmail.com',
                password: '1234'
            };

            const loginResult = await requester.post('/api/sessions/login').send(credentialsMock);
            const cookieResult = loginResult.headers['set-cookie'][0];
            const cookieResultSplit = cookieResult.split('=');

            cookie = {
                name: cookieResultSplit[0],
                value: cookieResultSplit[1]
            };

            const { _body } = await requester.get('/api/sessions/current')
            .set('Cookie', [`${cookie.name}=${cookie.value}`]);

            expect(_body.payload.email).to.be.eql('tutiguerra99@gmail.com');
            idCart=_body.payload.cart;
    });

    it('PUT de /api/carts/:cid/products/:pid debe agregar un producto (PRODUCTO #1) al carro correctamente, recibiendo su correspondiente payload.', async () => {
        const cartMock = {
            quantity: 1
        };
        
        const { statusCode, ok, _body } = await requester.put(`/api/carts/${idCart}/product/${idProduct1}`).set('Cookie', [`${cookie.name}=${cookie.value}`]).send(cartMock);

        const result = 'Se actualizo correctamente el producto al carrito'
        
        expect(statusCode).to.be.eql(200);
        expect(_body).to.have.property('payload');
        expect(_body.payload).to.be.eql(result);

    });

    it('PUT de /api/carts/:cid/products/:pid debe agregar un producto (PRODUCTO #2) al carro correctamente, recibiendo su correspondiente payload.', async () => {
        const cartMock = {
            quantity: 1
        };
        
        const { statusCode, ok, _body } = await requester.put(`/api/carts/${idCart}/product/${idProduct2}`).set('Cookie', [`${cookie.name}=${cookie.value}`]).send(cartMock);

        const result = 'Se actualizo correctamente el producto al carrito'
        
        expect(statusCode).to.be.eql(200);
        expect(_body).to.have.property('payload');
        expect(_body.payload).to.be.eql(result);

    });

    it('DELETE de /api/carts/:cid/products/:pid debe eliminar un producto (PRODUCTO #2) del carro correctamente, recibiendo su correspondiente payload.', async () => {
        const { statusCode, ok, _body } = await requester.delete(`/api/carts/${idCart}/product/${idProduct2}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        
        expect(statusCode).to.be.eql(200);
        expect(_body).to.have.property('status');
        expect(_body).to.have.property('payload');
        /* expect(_body.payload.acnowledged).to.be.eql(true); */

    });

    it('PUT de /api/carts/:cid/purchase finalizo la compra, recibiendo su correspondiente payload.', async () => {
        const { statusCode, ok, _body } = await requester.put(`/api/carts/${idCart}/purchase`).set('Cookie', [`${cookie.name}=${cookie.value}`]);

        expect(statusCode).to.be.eql(200);
        expect(_body).to.have.property('payload');
        /* expect(_body.payload).to.be.eql(result); */

    });

});