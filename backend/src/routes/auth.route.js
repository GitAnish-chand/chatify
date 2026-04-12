import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

router.get('/signup', (req, res) => {
    res.send('signup endpoint');
});

router.get('/login', (req, res) => {
    res.send('login endpoint');
});

router.get('/logout', (req, res) => {
    res.send('logout endpoint');
});

export default router;