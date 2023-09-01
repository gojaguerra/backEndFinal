import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing de products', () => {
    
    let cookie;
    let idProducto;
    
    // LOGUEO AL USER
    before(async function () {
            const credentialsMock = {
                email: 'jd@gmail.com',
                password: '1234'
            };

            const loginResult = await requester.post('/api/sessions/login').send(credentialsMock);
            const cookieResult = loginResult.headers['set-cookie'][0];
            const cookieResultSplit = cookieResult.split('=');

            cookie = {
                name: cookieResultSplit[0],
                value: cookieResultSplit[1]
            };

    });

    it('POST de /api/products debe crear un nuevo producto correctamentte', async () => {
        const productMock = {
            title: 'Galletitas Arcor',
            description: 'Galletitas de avena x 200grs',
            price: 100,
            code: '15004',
            stock: 100, 
            category: 'grocery',
            thumbnail: 'imagenes/demo.jpg'
        };
        
        const { statusCode, ok, _body } = await requester.post('/api/products').set('Cookie', [`${cookie.name}=${cookie.value}`]).send(productMock);
        
        expect(statusCode).to.be.eql(200);
        expect(_body.payload).to.have.property('_id');
        idProducto=_body.payload._id;

    });

    it('POST de /api/products se debe corroborrar que si no se envia el description debe retornar un bad request (400)', async () => {
        const productMock = {
            title: 'Galletitas Arcor',
            price: 100,
            code: '15004',
            stock: 100, 
            category: 'grocery',
            thumbnail: 'imagenes/demo.jpg'
        };
        
        const { statusCode, ok, _body } = await requester.post('/api/products').set('Cookie', [`${cookie.name}=${cookie.value}`]).send(productMock);
        
        expect(statusCode).to.be.eql(400);
        expect(_body).to.have.property('error');
        expect(_body.error).to.be.eql('Faltan completar campos!');
    });

    it('GET de /api/products se debe corroborrar que existe el producto y que la respuesta tiene los campos status y payload, además el payload debe ser un arreglo', async () => {
        const { statusCode, _body } = await requester.get(`/api/products/${idProducto}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(statusCode).to.be.eql(200);
        expect(_body).to.have.property('status');
        expect(_body).to.have.property('payload');
        expect(Array.isArray(_body.payload)).to.be.eql(true);
    });

    it('PUT de /api/products debe modificar una de las caracteristicas de un producto correctamentte. En este caso STOCK, ademas en el payload debe retornar que se actualizao correctamente ese id.', async () => {
        const productMock = {
            title: 'Galletitas Arcor',
            description: 'Galletitas de avena x 200grs',
            price: 100,
            code: '15004',
            stock: 500, 
            category: 'grocery',
            thumbnail: 'imagenes/demo.jpg'
        };
        
        const { statusCode, ok, _body } = await requester.put(`/api/products/${idProducto}`).set('Cookie', [`${cookie.name}=${cookie.value}`]).send(productMock);
        
        const result = `El producto con ID ${idProducto} fue actualizado con éxito!`
        
        expect(statusCode).to.be.eql(200);
        expect(_body).to.have.property('payload');
        expect(_body.payload).to.be.eql(result);

    });

    it('DELETE de /api/products se debe corroborrar que se elimine correctamente el último producto agregado', async () => {
        const deleteResult = await requester.delete(`/api/products/${idProducto}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(deleteResult.statusCode).to.be.eql(200);
    });

});