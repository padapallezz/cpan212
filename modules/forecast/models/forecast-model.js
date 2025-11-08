const { default: mongoose, mongo } = require("mongoose");

// create forecast model
const ForecastSchema= new mongoose.Schema({
    company: {type: String, required: true, minLength: 3},
    product: {type: String, required: true, minLength: 3},
    predicted_unit_sold: {type: Number, required: true, min: 0},
    predicted_price: {type: Number, required: true, min: 0},
    predicted_variable_cost: {type:Number, required: true, min: 0},
    predicted_revenue: {type: Number, required: true, min: 0}

}, {timestamps: true});

const ForecastModel = mongoose.model("Forecast", ForecastSchema);
module.exports = ForecastModel