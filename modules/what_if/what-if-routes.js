const { Router } = require('express');

//import WhatIFModel model
const WhatIfModel = require('./models/what_if-model');
const createWhatIfRules = require('./middlewares/create_whatif_rules');
const updateWhatIfRules = require('./middlewares/update_whatif_rules');
const whatifRoute = Router();


whatifRoute.get("/", async (req, res) => {
  try {
    const query = {};

    // TEXT FILTERING
    if (req.query.scenario_name) {
      query.scenario_name = { $regex: `^${req.query.scenario_name}$`, $options: "i" };
    }
    else if (req.query.scenario_name_like) {
      query.scenario_name = { $regex: req.query.scenario_name_like, $options: "i" };
    }

    if (req.query.base_product) {
      query.base_product = { $regex: `^${req.query.base_product}$`, $options: "i" };
    }
    else if (req.query.base_product_like) {
      query.base_product = { $regex: req.query.base_product_like, $options: "i" };
    }

    // NUMERIC FILTERING
    const numeric_fields = ['old_price', 'new_price', 'fixed_cost', 'variable_cost', 'units_sold', 'expected_profit'];
    numeric_fields.forEach(field => {
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

// POST method
whatifRoute.post("/", createWhatIfRules, async (req, res) => {
  try {
    const newWhatIf = await WhatIfModel.create({
      scenario_name: req.body.scenario_name,
      base_product: req.body.base_product,
      old_price: Number(req.body.old_price),
      new_price: Number(req.body.new_price),
      fixed_cost: Number(req.body.fixed_cost),
      variable_cost: Number(req.body.variable_cost),
      units_sold: Number(req.body.units_sold),
      expected_profit: Number(req.body.expected_profit)
    });

    res.status(200).json(newWhatIf);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Failed to create WhatIf: ${err}`);
  }
});

// PUT update
whatifRoute.put("/:id", updateWhatIfRules, async (req, res) => {
  try {
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

// DELETE
whatifRoute.delete("/:id", async (req, res) => {
  try {
    const deletedWhatIf = await WhatIfModel.findByIdAndDelete(req.params.id);
    if (!deletedWhatIf) return res.status(404).send('WhatIf not found');
    res.status(200).json(deletedWhatIf);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Failed to delete WhatIf: ${err}`);
  }
});

module.exports = whatifRoute;