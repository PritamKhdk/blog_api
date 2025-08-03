require('dotenv').config();

const express = require('express');
const app = express();

const blogRoutes = require('./routes/router');
const connectDB = require('./config/db');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/blogs', blogRoutes);

app.get("/", (req, res) => {
  res.send("Hello from Node API Server Updated");
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
