import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import queryRoutes from './routes/query.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/queries', queryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Function to print routes once server is ready
function printRoutes() {
    if (!app._router) {
        console.log('No routes registered yet.');
        return;
    }

    app._router.stack
        .filter(r => r.route) // only routes
        .forEach(r => console.log(Object.keys(r.route.methods), r.route.path));
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    printRoutes();
});
