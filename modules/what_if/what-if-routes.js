const express = require("express");
const {
  getAllWhatIf,
  getScenarioByID,
  addNewScenario,
  updateScenario,
  deleteScenario,
} = require("../models/what_if-model");

const {
  validateScenario,
  validateScenarioUpdate,
} = require("../middlewares/whatif-validator");

const router = express.Router();

// GET all scenarios
router.get("/", async (req, res) => {
  try {
    const scenarios = await getAllWhatIf();
    res.status(200).json(scenarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET scenario by ID
router.get("/:id", async (req, res) => {
  try {
    const scenario = await getScenarioByID(req.params.id);
    if (!scenario) return res.status(404).json({ error: "Scenario not found" });
    res.status(200).json(scenario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new scenario
router.post("/", validateScenario, async (req, res) => {
  try {
    const newScenario = await addNewScenario(req.body);
    res.status(201).json(newScenario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update scenario
router.put("/:id", validateScenarioUpdate, async (req, res) => {
  try {
    const updated = await updateScenario(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    if (err.message.includes("doesn't exist")) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// DELETE scenario
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deleteScenario(req.params.id);
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
