import express from 'express';
import dotenv from 'dotenv';
import { signup, updateProfile } from '../controllers/auth.controller.js';
import { login } from '../controllers/auth.controller.js';
import { logout } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import arcjetProtection from '../middleware/arcjet.middleware.js';

dotenv.config();
const router = express.Router();

router.use(arcjetProtection);

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.put('/update-profile', protectRoute, updateProfile);



export default router;