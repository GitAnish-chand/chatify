import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
import authRoutes from './routes/auth.route.js';    
import messagesRoutes from './routes/messages.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/messages', messagesRoutes);

// deployment
const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../frontend', 'dist');

    app.use(express.static(frontendPath));

    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT);
});