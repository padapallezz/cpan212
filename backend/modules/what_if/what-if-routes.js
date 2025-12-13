const { Router } = require('express');
const WhatIfModel = require('./models/what_if-model');
const createWhatIfRules = require('./middlewares/create_whatif_rules');
const updateWhatIfRules = require('./middlewares/update_whatif_rules');
const authorize = require('../../shared/middlewares/authorize'); // RBAC middleware

const whatifRoute = Router();

// ==================== GET ALL WHATIF ====================
// Admin: can see all
// Customer: can only see their own
whatifRoute.get("/", authorize(["admin", "customer"]), async (req, res) => {
  try {
    const query = {};

    // Ownership filter
    if (!req.account.roles.includes("admin")) {
      query.createdBy = req.account._id;
    }

    // TEXT FILTERING
    if (req.query.scenario_name) {
      query.scenario_name = { $regex: `^${req.query.scenario_name}$`, $options: "i" };
    } else if (req.query.scenario_name_like) {
      query.scenario_name = { $regex: req.query.scenario_name_like, $options: "i" };
    }

    if (req.query.base_product) {
      query.base_product = { $regex: `^${req.query.base_product}$`, $options: "i" };
    } else if (req.query.base_product_like) {
      query.base_product = { $regex: req.query.base_product_like, $options: "i" };
    }

    // NUMERIC FILTERING
    const numericFields = ['old_price', 'new_price', 'fixed_cost', 'variable_cost', 'units_sold', 'expected_profit'];
    numericFields.forEach(field => {
      const min = req.query[`${field}_min`];
      const max = req.query[`${field}_max`];
      if (min || max) {
        query[field] = {};
        if (min) query[field].$gte = Number(min);
        if (max) query[field].$lte = Number(max);
      }
    });

    // PAGINATION
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const whatifs = await WhatIfModel.find(query).skip(skip).limit(limit);
    res.status(200).json(whatifs);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Failed to get WhatIf: ${err}`);
  }
});

// ==================== GET WHATIF BY ID ====================
// Admin: can access any
// Customer: only own
whatifRoute.get("/:id", authorize(["admin", "customer"]), async (req, res) => {
  try {
    const whatif = await WhatIfModel.findById(req.params.id);
    if (!whatif) return res.status(404).json({ message: "WhatIf not found" });

    // Ownership check
    if (!req.account.roles.includes("admin") && whatif.createdBy.toString() !== req.account._id) {
      return res.status(403).json({ message: "Forbidden: cannot access other's WhatIf" });
    }

    res.status(200).json(whatif);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch WhatIf" });
  }
});

// ==================== CREATE WHATIF ====================
// Admin & Customer
whatifRoute.post("/", authorize(["admin", "customer"]), createWhatIfRules, async (req, res) => {
  try {
    const newWhatIf = await WhatIfModel.create({
      scenario_name: req.body.scenario_name,
      base_product: req.body.base_product,
      old_price: Number(req.body.old_price),
      new_price: Number(req.body.new_price),
      fixed_cost: Number(req.body.fixed_cost),
      variable_cost: Number(req.body.variable_cost),
      units_sold: Number(req.body.units_sold),
      expected_profit: Number(req.body.expected_profit),
      createdBy: req.account._id // 🔥 link to user
    });

    res.status(200).json(newWhatIf);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Failed to create WhatIf: ${err}`);
  }
});

// ==================== UPDATE WHATIF ====================
// Admin: can update any
// Customer: can only update own
whatifRoute.put("/:id", authorize(["admin", "customer"]), updateWhatIfRules, async (req, res) => {
  try {
    const whatif = await WhatIfModel.findById(req.params.id);
    if (!whatif) return res.status(404).json({ message: "WhatIf not found" });

    // Ownership check
    if (!req.account.roles.includes("admin") && whatif.createdBy.toString() !== req.account._id) {
      return res.status(403).json({ message: "Forbidden: cannot update other's WhatIf" });
    }

    const updatedWhatIf = await WhatIfModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedWhatIf);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Failed to update WhatIf: ${err}`);
  }
});

// ==================== DELETE WHATIF ====================
// Admin: can delete any
// Customer: only delete own
whatifRoute.delete("/:id", authorize(["admin", "customer"]), async (req, res) => {
  try {
    const whatif = await WhatIfModel.findById(req.params.id);
    if (!whatif) return res.status(404).json({ message: "WhatIf not found" });

    // Ownership check
    if (!req.account.roles.includes("admin") && whatif.createdBy.toString() !== req.account._id) {
      return res.status(403).json({ message: "Forbidden: cannot delete other's WhatIf" });
    }

    const deletedWhatIf = await WhatIfModel.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedWhatIf);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Failed to delete WhatIf: ${err}`);
  }
});

module.exports = whatifRoute;
