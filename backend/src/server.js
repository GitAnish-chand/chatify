import express from 'express';
import path from 'path';

import authRoutes from './routes/auth.route.js';    
import messagesRoutes from './routes/messages.route.js';
import {connectDB} from './lib/db.js';
import { ENV } from './lib/env.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = ENV.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messagesRoutes);

// deployment
const __dirname = path.resolve();

if (ENV.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../frontend', 'dist');

    app.use(express.static(frontendPath));

    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}

const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log('Server is running on port:', PORT);
        });
        await connectDB();
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();