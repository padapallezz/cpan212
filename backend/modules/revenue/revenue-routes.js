const { Router } = require('express');
const RevenueModel = require('./models/revenue-model');
const createRevenueRules = require('./middlewares/create_revenue_rules');
const updateRevenueRules = require('./middlewares/update_revenue_rules');
const parseRevenueCSV = require('../../utils/parseRevenueCSV')
const authorize = require('../../shared/middlewares/authorize'); // our RBAC middleware
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
// Admin: view all revenues
// User: only view their own revenues
revenueRoute.get(
  "/",
  authorize(["admin", "customer"]),
  async (req, res) => {
    try {
      const query = {};

      // ================= ROLE / OWNERSHIP =================
      // If not admin → restrict to user's own data
      if (!req.account.roles.includes("admin")) {
        query.createdBy = req.account._id;
      }

      // ================= YEAR / MONTH FILTERING =================
      if (req.query.year) query.year = Number(req.query.year);
      if (req.query.month) query.month = Number(req.query.month);

      // ================= TEXT FILTERING (company) =================
      if (req.query.company) {
        query.company = { $regex: `^${req.query.company}$`, $options: "i" }; // exact match
      } else if (req.query.company_like) {
        query.company = { $regex: req.query.company_like, $options: "i" }; // partial match
      }

      // ================= NUMERIC FILTERING =================
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

      // ================= DATE FILTERING =================
      if (req.query.createdBefore || req.query.createdAfter) {
        query.createdAt = {};
        if (req.query.createdBefore)
          query.createdAt.$lte = new Date(req.query.createdBefore);
        if (req.query.createdAfter)
          query.createdAt.$gte = new Date(req.query.createdAfter);
      }

      // ================= PAGINATION =================
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
  }
);

// ==================== GET REVENUE BY ID ====================
// Admin: can access any revenue
// Customer: can only access their own revenue
revenueRoute.get(
  "/:id",
  authorize(["admin", "customer"]),
  async (req, res) => {
    try {
      const revenue = await RevenueModel.findById(req.params.id);
      console.log(req.params.id)

      if (!revenue) {
        return res.status(404).json({ message: "Revenue not found" });
      }

      // Ownership check for customer
      if (
        !req.account.roles.includes("admin") &&
        revenue.createdBy.toString() !== req.account._id
      ) {
        return res.status(403).json({
          message: "Forbidden: cannot access other user's revenue",
        });
      }

      res.status(200).json(revenue);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch revenue" });
    }
  }
);


// POST - Upload revenue CSV
// Admin & Customer can upload revenue data
revenueRoute.post(
  "/",
  authorize(["admin", "customer"]),
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const month = Number(req.body.month);
    const year = Number(req.body.year);

    if (isNaN(month) || isNaN(year)) {
      return res.status(400).send("Invalid month/year");
    }

    try {
      // Parse CSV and save records with creator info
      const records = await parseRevenueCSV(
        req.file.path,
        month,
        year,
        req.account._id // ownership
      );

      // Remove uploaded file after processing
      fs.unlinkSync(req.file.path);

      res.status(200).json({
        message: "CSV uploaded and saved successfully",
        count: records.length,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error processing CSV file");
    }
  }
);


// ==================== UPDATE REVENUE BY ID (CSV) ====================
// Admin can update any revenue
// Customer can only update THEIR OWN revenue record
revenueRoute.put(
  "/:id",
  authorize(["admin", "customer"]), // must be logged in
  upload.single("file"),
  async (req, res) => {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).send("CSV file is required");
    }

    try {
      // Find the revenue first
      const revenue = await RevenueModel.findById(id);
      if (!revenue) {
        return res.status(404).json({ message: "Revenue not found" });
      }

      // Ownership check for customer
      if (
        !req.account.roles.includes("admin") &&
        revenue.createdBy.toString() !== req.account._id
      ) {
        return res.status(403).json({ message: "Forbidden: cannot update other user's revenue" });
      }

      // Delete old revenue record
      await RevenueModel.findByIdAndDelete(id);

      // Parse CSV and save new revenue (ownership retained)
      const savedRecords = await parseRevenueCSV(
        req.file.path,
        req.body.month,
        req.body.year,
        req.account._id
      );

      // Remove uploaded file
      fs.unlinkSync(req.file.path);

      res.status(200).json({
        message: "Revenue updated successfully",
        count: savedRecords.length,
        records: savedRecords,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to update revenue");
    }
  }
);

// ==================== DELETE REVENUE BY ID ====================
// Admin can delete any revenue
// Customer can only delete THEIR OWN revenue record
revenueRoute.delete(
  "/:id",
  authorize(["admin", "customer"]), // must be logged in
  async (req, res) => {
    const { id } = req.params;

    try {
      // Find the revenue first
      const revenue = await RevenueModel.findById(id);
      if (!revenue) {
        return res.status(404).json({ message: "Revenue not found" });
      }

      // Ownership check for customer
      if (
        !req.account.roles.includes("admin") &&
        revenue.createdBy.toString() !== req.account._id
      ) {
        return res.status(403).json({
          message: "Forbidden: cannot delete other user's revenue",
        });
      }

      // Delete revenue
      await RevenueModel.findByIdAndDelete(id);

      res.status(200).json({
        message: `Revenue record with ID ${id} deleted successfully`,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send(`Failed to delete revenue record: ${err.message}`);
    }
  }
);


module.exports = revenueRoute;
