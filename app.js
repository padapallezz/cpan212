// Load .env file
require('dotenv').config();

const express = require('express');
const app = express();

// Connect to database
const connectDB = require('./shared/middlewares/connect-db');
connectDB();

// Application-level middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes

const bepRoute = require('./modules/break_even_analysis/break_even_analysis-routes');
const forecastRoute  = require("./modules/forecast/forecast-routes");
const revenueRoute = require("./modules/revenue/revenue-routes")
const whatIfRoute = require('./modules/what_if/what-if-routes');

app.use('/bep', bepRoute);
app.use('/forecast', forecastRoute);
app.use('/revenue', revenueRoute);
app.use('/whatif', whatIfRoute);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to your BTracker!');
});

// 404 Middleware (AFTER routes)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler (AFTER routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong on the server.'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
