const { Router } = require('express');
//import ForecastModel
const ForecastModel = require('./models/forecast-model');
const createForecastRules = require("./middlewares/create_forecast_rules");
const updateForecastRules = require("./middlewares/update_forecast_rules");
const forecastRoute = Router();

//get method
forecastRoute.get("/", async(req, res) => {
  try {
    const query = {};

    // TEXT FILTERING ON COMPANY NAME
    //exact match, case-insensitive
    if (req.query.company) {
      query.company = { $regex: `^${req.query.company}$`, $options: "i"};
    } 
    //partial match, case_insensitive
    else if (req.query.company_like) {
      query.company = { $regex: req.query.company_like, $options: "i"};
    }

    //TEXT FILTERING ON PRODUCT NAME
    if (req.query.product) {
      query.product = { $regex: `^${req.query.product}$`, $options: "i"};
    } 
    //partial match, case_insensitive
    else if (req.query.product_like) {
      query.product = { $regex: req.query.product_like, $options: "i"};
    }

    //NUMERIC FILTERING (predicted_unit_sold, predicted_price, predicted_variable_cost, predicted_revenue)
    const numeric_field = ["predicted_unit_sold", "predicted_price", "predicted_variable_cost", "predicted_revenue"];
    numeric_field.forEach(field => {
      const min = req.query[`${field}_min`];
      const max = req.query[`${field}_max`];
      if (min || max) {
        query[field] = {};
        if (min) query[field].$gte = Number(min);
        if (max) query[field].$lte = Number(max);
      }
    })

    if (req.query.createdBefore || req.query.createdAfter) {
            query.createdAt = {};
            if (query.createdBefore) query.createdAt.$lte = new Date(req.query.createdBefore);
            if (query.createdAfter) query.createdAt.$gte = new Date(req.query.createdAfter);
        }

    // PAGINATION 
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // Execute query
    const forecasts = await ForecastModel.find(query)
        .skip(skip)
        .limit(limit);

    res.status(200).json(forecasts);

  } catch (err) {
      console.error(err);
      res.status(500).send(`Failed to get Forecast: ${err}`)
  }
});

//post new forecast
forecastRoute.post("/", createForecastRules, async(req, res) => {
  try {
    const new_forecast = await ForecastModel.create({
      company: req.body.company,
      product: req.body.product,
      predicted_unit_sold: req.body.predicted_unit_sold,
      predicted_price: req.body.predicted_price,
      predicted_variable_cost: req.body.predicted_variable_cost,
      predicted_revenue: req.body.predicted_revenue
    });
    res.status(200).json(new_forecast);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Failed to create new forecast: ${err}`);
  }
});

//put update forecast
forecastRoute.put("/:id", updateForecastRules, async(req, res) => {
  try {
    const id = req.params.id;
    const updated_forecast = await ForecastModel.findByIdAndUpdate(
      id,
      {$set: req.body},
      {new: true, runValidators: true}
    );
    res.status(200).json(updated_forecast);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Failed to update forecast: ${err}`);
  }
});

//delete forecast
forecastRoute.delete("/:id", async(req, res) => {
  try {
    const id = req.params.id;
    //delete the forecast
    const deleted_forecast = await ForecastModel.findByIdAndDelete(id);
    if (!deleted_forecast) return res.status(500).send(`Forecast with this ID not found`);
    res.status(200).json(deleted_forecast);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Failed to deleted forecast: ${err}`);
  }
});


module.exports = forecastRoute;
