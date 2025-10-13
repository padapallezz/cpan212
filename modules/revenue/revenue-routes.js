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
//get all revenue
router.get("/", getAllRevenue);
//get revenue by id
router.get("/:id", getRevenueById);
//post new revenue
router.post("/", validateRevenue, addNewRevenue);
//put update revenue
router.put("/:id", validateRevenueUpdate, updateRevenue);
//delete revenue
router.delete("/:id", deleteRevenue);

module.exports = router;
