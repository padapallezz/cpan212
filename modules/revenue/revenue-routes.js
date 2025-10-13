const express = require("express");
const {
  getAllRevenue,
  getRevenueByID,
  addNewRevenue,
  updateRevenue,
  deleteRevenue,
} = require("../models/revenue-model");

const {
  validateRevenue,
  validateRevenueUpdate,
} = require("../middlewares/revenue-validator");

const router = express.Router();

// GET all revenue records
router.get("/", async (req, res) => {
  try {
    const data = await getAllRevenue();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET revenue by ID
router.get("/:id", async (req, res) => {
  try {
    const record = await getRevenueByID(req.params.id);
    if (!record) return res.status(404).json({ error: "Revenue not found" });
    res.status(200).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new revenue
router.post("/", validateRevenue, async (req, res) => {
  try {
    const newRecord = await addNewRevenue(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update revenue
router.put("/:id", validateRevenueUpdate, async (req, res) => {
  try {
    const updated = await updateRevenue(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    if (err.message.includes("doesn't exist")) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// DELETE revenue
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deleteRevenue(req.params.id);
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
