import express from 'express';

import { registerUser, LoginUser, LogoutUser , refreshAccessToken} from '../../controllers/Auth/authController.js';

const router = express.Router();

router.post('/register' , registerUser);
router.post('/login' , LoginUser);
router.post('/logout' , LogoutUser);
router.post('/refresh-token' , refreshAccessToken);

export default router;