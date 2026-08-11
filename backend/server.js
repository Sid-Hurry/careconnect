const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/careconnect';
const PORT = process.env.PORT || 5000;

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());


// Routes
app.use('/api', apiRoutes);

// Base route / healthcheck
app.get('/', (req, res) => {
  res.json({ message: 'CareConnect Resource Optimization API is running' });
});

// Database connection
console.log('Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    // Allow server to run even if Mongo is down (e.g. for offline evaluation fallback support)
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT} without MongoDB connection`);
    });
  });
