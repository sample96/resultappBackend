import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import categoryRoutes from './routes/categories.js';
import resultRoutes from './routes/results.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://resultapp.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// MongoDB connection with proper serverless handling
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2) {
    // Connection is connecting, wait for it
    return new Promise((resolve, reject) => {
      mongoose.connection.on('connected', () => resolve(mongoose.connection));
      mongoose.connection.on('error', reject);
    });
  }

  try {
    // Disable buffering for serverless
    mongoose.set('bufferCommands', false);
    
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('Connected to MongoDB');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/results', resultRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    res.json({ 
      status: 'OK', 
      message: 'Server is running',
      mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// For local development
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  // Connect to DB and start server for local development
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to start server:', error);
      process.exit(1);
    });
}

// Main handler for Vercel
export default async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: 'Database connection failed',
      message: error.message 
    });
  }
};