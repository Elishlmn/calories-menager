// Eli Shulman 316040120
// Shahar Ashkenazi 316244060

// Imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const calorieRouter = require('./routes'); // Assuming 'routes.js' file contains your API routes
require('dotenv').config(); // For loading environment variables

// Protection and Port Selection
const app = express();
const port = process.env.PORT || 3000;
const connectionString = process.env.MONGODB_CONNECTION_STRING;

// Middleware
app.use(express.json()); // Built-in middleware for parsing JSON bodies
app.use((req, res, next) => {
  console.log('Request body middleware:', req.body);
  next();
});
app.use(express.urlencoded({ extended: true })); // Built-in middleware for parsing URL-encoded bodies
app.use(cors());
app.use(calorieRouter); // Use the routes defined in 'routes.js'

// MongoDB Connection
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Start Server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});