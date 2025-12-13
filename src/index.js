import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import queryRoutes from './routes/query.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import mediaRoutes from './routes/media.routes.js';
import truevalueRoutes from './routes/truevalue.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// const allowedOrigins = [
//     "http://localhost:3000",
//     "http://localhost:3001",
//     "http://127.0.0.1:3000",
//     "http://127.0.0.1:3001",
//     "https://vipulmotors.com",
//     "https://admin.vipulmotors.com",
// ];

// Middleware
app.use(cors());
// app.use(cors({
//     origin: allowedOrigins,
//     credentials: true
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/queries', queryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/true-value', truevalueRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Function to print routes once server is ready
// function printRoutes() {
//     if (!app._router) {
//         console.log('No routes registered yet.');
//         return;
//     }

//     app._router.stack
//         .filter(r => r.route) // only routes
//         .forEach(r => console.log(Object.keys(r.route.methods), r.route.path));
// }

// Start server
app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 Server is running on http://127.0.0.1:${PORT}`);
});