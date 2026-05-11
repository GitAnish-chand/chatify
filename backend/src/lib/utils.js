import jwt from 'jsonwebtoken';
import { ENV } from './env.js';

export const generateToken = (user,res) => {

    const {JWT_SECRET} = ENV;
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined. Check backend/.env and that dotenv is loading correctly.');
    }

    const token = jwt.sign({ id: user._id }, ENV.JWT_SECRET, {
        expiresIn: '7d',
    });
    res.cookie('token', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        httpOnly: true, // prevent XSS attacks
        sameSite: 'strict',  //prevent CSRF attacks
        secure: ENV.NODE_ENV === 'development' ? false : true,
    });

    return token;
}
