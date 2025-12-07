const { Router } = require('express');
const RevenueModel = require('./models/revenue-model');
const createRevenueRules = require('./middlewares/create_revenue_rules');
const updateRevenueRules = require('./middlewares/update_revenue_rules');


const revenueRoute = Router();

// GET method
revenueRoute.get("/", async (req, res) => {
  try {
    const query = {};

    // TEXT FILTERING ON COMPANY
    if (req.query.company) {
      query.company = { $regex: `^${req.query.company}$`, $options: "i" }; // exact
    } else if (req.query.company_like) {
      query.company = { $regex: req.query.company_like, $options: "i" }; // partial
    }

    // NUMERIC FILTERING
    const numericFields = ["invoice", "revenue", "variable_cost", "fixed_cost", "profit"];
    numericFields.forEach(field => {
      const min = req.query[`${field}_min`];
      const max = req.query[`${field}_max`];
      if (min || max) {
        query[field] = {};
        if (min) query[field].$gte = Number(min);
        if (max) query[field].$lte = Number(max);
      }
    });

    // DATE FILTERING
    if (req.query.createdBefore || req.query.createdAfter) {
      query.createdAt = {};
      if (req.query.createdBefore) query.createdAt.$lte = new Date(req.query.createdBefore);
      if (req.query.createdAfter) query.createdAt.$gte = new Date(req.query.createdAfter);
    }

    // PAGINATION
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const revenues = await RevenueModel.find(query)
      .skip(skip)
      .limit(limit);

    res.status(200).json(revenues);

  } catch (err) {
    console.error(err);
    res.status(500).send(`Failed to get revenues: ${err}`);
  }
});

// POST method
revenueRoute.post("/", createRevenueRules, async (req, res) => {
  try {
    const products = req.body.products.map(p => ({
      name: p.name,
      units_sold: Number(p.units_sold),
      price: Number(p.price),
      variable_cost: Number(p.variable_cost)
    }));

    const revenue = products.reduce((sum, p) => sum + p.units_sold * p.price, 0);
    const totalVariableCost = products.reduce((sum, p) => sum + p.units_sold * p.variable_cost, 0);
    const fixedCost = Number(req.body.fixed_cost) || 0;
    const profit = revenue - totalVariableCost - fixedCost;

    const newRevenue = await RevenueModel.create({
      company: req.body.company,
      invoice: revenue,
      revenue,
      variable_cost: totalVariableCost,
      fixed_cost: fixedCost,
      profit,
      products
    });

    res.status(200).json(newRevenue);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Failed to create new revenue: ${err}`);
  }
});

// PUT method
revenueRoute.put("/:id", updateRevenueRules, async (req, res) => {
  try {
    const id = req.params.id;
    const updatedRevenue = await RevenueModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedRevenue);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Failed to update revenue: ${err}`);
  }
});

// DELETE method
revenueRoute.delete("/:id", async (req, res) => {
  try {
    const deletedRevenue = await RevenueModel.findByIdAndDelete(req.params.id);
    if (!deletedRevenue) return res.status(500).send('Revenue record not found');
    res.status(200).json(deletedRevenue);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Failed to delete revenue: ${err}`);
  }
});

module.exports = revenueRoute;
