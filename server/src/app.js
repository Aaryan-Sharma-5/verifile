import express from 'express';
import { validateMetaMaskCredentials, optionalMetaMaskValidation } from './middleware/metamaskAuth.js';

const app = express();

// Middleware setup
app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 
// app.use(cors({
//     origin: true, 
//     credentials: true  
// }));

// Example route with required MetaMask validation
app.post('/api/self', validateMetaMaskCredentials, (req, res) => {
    console.log('Received request body:', req.body);
    console.log('Verified MetaMask data:', req.metamask);
    res.json({ 
        message: 'Hello from /api/self',
        metamaskAddress: req.metamask.address,
        verified: req.metamask.verified
    });
});

// Example route with optional MetaMask validation
app.post('/api/public', optionalMetaMaskValidation, (req, res) => {
    console.log('Received request body:', req.body);
    console.log('MetaMask data (if provided):', req.metamask);
    res.json({ 
        message: 'Hello from /api/public',
        hasMetaMask: !!req.metamask,
        metamaskAddress: req.metamask?.address || null
    });
});

// Health check route without MetaMask validation
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;