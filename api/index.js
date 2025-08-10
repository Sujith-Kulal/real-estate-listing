//added
import uploadRoute from './routes/upload.route.js';
//
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
//
import cors from 'cors';
//
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';

import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

 mongoose
.connect(process.env.MONGO)
.then(() => {
console.log('Connected to MongoDB!');
})
.catch((err) => {
console.log(err);
});


  // const __dirname = path.resolve();

const app = express();
// Serve uploads folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors({
  origin: 'http://localhost:5173', // frontend
  credentials: true,              // allow cookies
}));

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/upload', uploadRoute);//added

//  Serve the uploads folder so images are publicly accessible
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
