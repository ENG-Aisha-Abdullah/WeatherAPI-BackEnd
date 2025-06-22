import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';


const router = Router();

// Public routes
router.post('/signup', AuthController.signUp);
router.post('/signin', AuthController.signIn);
router.post('/signout', AuthController.signOut);
router.post('/refresh-token', AuthController.refreshToken);



export default router; 