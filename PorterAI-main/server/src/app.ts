import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/aiRoutes';
import orderRoutes from './routes/orderRoutes';
// import userRoutes = require("./routes/userRoutes");
import userRoutes from "./routes/userRoutes";

// import userRoutes from "./routes/userRoutes";

import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

// Always mount under /api/*
app.use('/api/ai', aiRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URI || '')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
