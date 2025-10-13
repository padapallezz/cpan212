const express = require('express');
const router = express.Router();

let forecasts = [];

// Get all forecasts
router.get('/', (req, res) => {
  res.json(forecasts);
});

// Add forecast
router.post('/', (req, res) => {
  const forecast = req.body;
  forecast.id = forecasts.length + 1;
  forecasts.push(forecast);
  res.json(forecast);
});

module.exports = router;
