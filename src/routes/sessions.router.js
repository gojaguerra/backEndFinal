import { Router } from 'express';
import { registerUser, loginUser, logoutUser, gitUser, gitCallbackUser, currentUser, passLink, linkPass, changePassword } from '../controllers/user.controller.js';
import { authTokenResetPass, passportCall } from '../utils/utils.js';

const router = Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/logout', passportCall('jwt'), logoutUser);

router.post('/password-link', passLink);

router.post('/password-change/', passportCall('jwt'), changePassword);

router.get('/linkPassword', authTokenResetPass, linkPass);

router.get('/github', passportCall('github', { scope: ['user:email']}), gitUser);

router.get('/github-callback', passportCall('github', { failureRedirect: '/login' }), gitCallbackUser);    

router.get('/current', passportCall('jwt'), currentUser);

export default router;