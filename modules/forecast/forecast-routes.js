const express = require("express");
const {
  getAllForecast,
  getForecastByID,
  addNewForecast,
  updateForecast,
  deleteForecast,
} = require("../models/forecast-model");

const {
  validateForecast,
  validateForecastUpdate,
} = require("../middlewares/forecast-validator");

const router = express.Router();

// GET all forecast records
router.get("/", async (req, res) => {
  try {
    const data = await getAllForecast();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET forecast by ID
router.get("/:id", async (req, res) => {
  try {
    const record = await getForecastByID(req.params.id);
    if (!record) return res.status(404).json({ error: "Forecast not found" });
    res.status(200).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new forecast
router.post("/", validateForecast, async (req, res) => {
  try {
    const newRecord = await addNewForecast(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update forecast
router.put("/:id", validateForecastUpdate, async (req, res) => {
  try {
    const updated = await updateForecast(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    if (err.message.includes("doesn't exist")) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// DELETE forecast
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deleteForecast(req.params.id);
    res.status(200).json(deleted);
  } catch (err) {
    if (err.message.includes("doesn't exist")) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

module.exports = router;
