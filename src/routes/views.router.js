import { Router } from 'express';
import { passportCall } from '../utils/utils.js';
import { homeRoot, loginRoot, profileRoot, registerRoot, resetRoot, resetRootError } from '../controllers/viewsRouter.controller.js';

const router = Router();

router.get('/register', registerRoot);

router.get('/login', loginRoot);

router.get('/resetPassword', resetRoot);

router.get('/resetPasswordError', resetRootError);  

router.get('/', passportCall('jwt'), homeRoot);

router.get('/profile', passportCall('jwt'), profileRoot);

export default router;