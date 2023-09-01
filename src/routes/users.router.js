import { Router } from 'express';
import { changeRol, uploadFile, getAllUser, deleteUser, deleteAllUser } from '../controllers/user.controller.js';
import { authorization, passportCall, uploader, verifyUserStatus } from '../utils/utils.js';

const router = Router();

// Eliminar un usuario
router.delete('/delete/:uid', deleteUser)

// Eliminar usuarios segun filtro
router.delete('/deleteall', deleteAllUser);

// Cambio de ROL - middleware para verificar si corresponde o no
router.post('/premium/:uid', verifyUserStatus, changeRol);

/* router.post('/:uid/documents', uploader.array('file'), uploadFile); */

// Subir los documentos: ACCOUNT ADDRESS IDENTIFICATION
router.post('/:uid/documents', uploader.fields([
        {name: 'profiles', maxCount: 1}, 
        {name: 'products', maxCount: 1},
        {name: 'documents', maxCount: 3}]), uploadFile);

// Obtener usuarios para poder cambiarles el ROLE
router.get('/usersrole', passportCall('jwt'), authorization('admin'), getAllUser);
/* router.get('/usersrole', getAllUser); */

export default router;