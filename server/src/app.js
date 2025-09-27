import express from 'express';
import cors from 'cors';

// Import configurations
import { corsConfig } from './config/cors.js';

// Import routes
import authRoutes from './routes/auth.js';
import selfRoutes from './routes/self.js';
import healthRoutes from './routes/health.js';

// Import services
import { startupTasks } from './services/startupService.js';

const app = express();

// Call startup tasks (commented out for now)
// startupTasks();  // dont call only for checking employee seeding

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsConfig));

// Route handlers
app.use("/api/auth", authRoutes);
app.use("/api/self", selfRoutes);
app.use("/api/health", healthRoutes);

export default app;
