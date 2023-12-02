// user-management-backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const teamRoutes = require('./routes/team');
require('dotenv').config(); // Load environment variables from .env

const cors = require('cors');
app.use(cors());

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
