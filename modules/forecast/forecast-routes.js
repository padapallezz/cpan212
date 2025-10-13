const express = require("express");
const {
  getAllForecast,
  getForecastByID,
  addNewForecast,
  updateForecast,
  deleteForecast,
} = require("../models/forecast-model");


const { validateForecast, validateForecastUpdate } = require("../middlewares/forecast-validator");

//get all forecast records
router.get("/", getAllForecast);
//get forecast by id
router.get("/:id", getForecastByID);
//post new forecast
router.post("/", validateForecast, addNewForecast);
//put update forecast
router.put("/:id", validateForecastUpdate, updateForecast);
//delete forecast
router.delete("/:id", deleteForecast);


module.exports = router;
