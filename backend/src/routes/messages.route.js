import express from 'express';
import dotenv from 'dotenv';
import { get } from 'mongoose';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getAllContacts } from '../controllers/message.controller.js';

dotenv.config();
const router = express.Router();

router.get('/contacts', protectRoute, getAllContacts);
// router.get('/chats',getChatPartners);
// router.post('/:id',getMessagesByUserId);
// router.post('/send/:id',sendMessage);

export default router;

