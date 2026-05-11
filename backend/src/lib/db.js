import mongoose from 'mongoose';

export const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error('MONGO_URI is not defined. Check backend/.env and that dotenv is loading correctly.');
    }

    try {
        const conn = await mongoose.connect(uri);
        console.log('MongoDB connected successfully:', conn.connection.host);
    } catch (error) {
        console.error('MongoDB connection error :', error);
        process.exit(1);
    }
};

