import jwt from 'jsonwebtoken';
import { ENV } from '../lib/env.js';    
import User from '../models/User.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({ message: 'Unauthorized - No token provided' });
        }
        const decoded = jwt.verify(token, ENV.JWT_SECRET);

        if(!decoded || !decoded.id) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }
        const user = await User.findById(decoded.id).select('-password');
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}



