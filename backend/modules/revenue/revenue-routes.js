const { Router } = require('express');
const RevenueModel = require('./models/revenue-model');
const createRevenueRules = require('./middlewares/create_revenue_rules');
const updateRevenueRules = require('./middlewares/update_revenue_rules');
const parseRevenueCSV = require('../../utils/parseRevenueCSV')
const multer = require("multer");
const fs = require("fs");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

const revenueRoute = Router();

// GET method
revenueRoute.get("/", async (req, res) => {
  try {
    const query = {};
    
    // YEAR / MONTH FILTERING
    if (req.query.year) query.year = Number(req.query.year);
    if (req.query.month) query.month = Number(req.query.month);

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

//get route
revenueRoute.get("/by-month/:year/:month", async (req, res) => {
  const { year, month } = req.params;

  try {
    const records = await RevenueModel.find({
      year: Number(year),
      month: Number(month),
    });

    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching month data");
  }
});

// POST
revenueRoute.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  let month = Number(req.body.month);
  let year = Number(req.body.year);

  if (isNaN(month) || isNaN(year)) return res.status(400).send("Invalid month/year");

  try {
    const records = await parseRevenueCSV(req.file.path, month, year);
    fs.unlinkSync(req.file.path);
    res.status(200).json({ message: "CSV uploaded and saved", count: records.length });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing CSV file");
  }
});

// PUT
revenueRoute.put("/:year/:month", upload.single("file"), async (req, res) => {
  const paramYear = Number(req.params.year);
  const paramMonth = Number(req.params.month);

  let month = Number(req.body.month);
  let year = Number(req.body.year);

  if (!req.file) return res.status(400).send("CSV file is required");
  if (isNaN(month) || isNaN(year)) return res.status(400).send("Invalid month/year");

  try {
    // Delete previous records
    await RevenueModel.deleteMany({ year: paramYear, month: paramMonth });

    // Parse new CSV
    const savedRecords = await parseRevenueCSV(req.file.path, month, year);

    res.status(200).json({ message: "Revenue updated", records: savedRecords });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update revenue");
  }
});



// DELETE method
// DELETE all revenues of a month/year
revenueRoute.delete("/:year/:month", async (req, res) => {
  const { year, month } = req.params;

  try {
    const result = await RevenueModel.deleteMany({
      year: Number(year),
      month: Number(month),
    });

    if (result.deletedCount === 0)
      return res.status(404).send("No revenue records found for this month/year");

    res.status(200).json({
      message: `Deleted ${result.deletedCount} revenue record(s) for ${month}/${year}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(`Failed to delete revenue records: ${err}`);
  }
});


module.exports = revenueRoute;
